import * as THREE from "three";

import { PLAYER_PHYSICS } from "@/game/physics/PhysicsConfig";

import { DEFAULT_PLAYER_CONFIG, type PlayerMovementConfig } from "./PlayerConfig";
import type { PlayerInputSnapshot } from "./PlayerInput";
import type { PlayerRuntimeState } from "./PlayerState";

export interface PlayerPhysicsBridge {
  linvel: { x: number; y: number; z: number };
  translation: { x: number; y: number; z: number };
  isGrounded: boolean;
  setLinvel: (vel: { x: number; y: number; z: number }) => void;
  setTranslation: (pos: { x: number; y: number; z: number }) => void;
}

export class PlayerController {
  private config: PlayerMovementConfig;
  private runtime: PlayerRuntimeState;

  // Stored last moving direction for smooth deceleration after releasing keys
  private lastMoveDirX = 0;
  private lastMoveDirZ = -1;

  // Jump trigger debounce and buffering
  private wasJumpPressed = false;
  private coyoteTimer = 0; // 150ms grace window after leaving ground
  private jumpBufferTimer = 0; // 120ms input buffer for jump commands
  // Brief landing recovery timer
  private landingTimer = 0;

  constructor(
    runtimeState: PlayerRuntimeState,
    config: PlayerMovementConfig = DEFAULT_PLAYER_CONFIG.movement,
  ) {
    this.runtime = runtimeState;
    this.config = config;
  }

  public update(
    delta: number,
    input: PlayerInputSnapshot,
    cameraYaw: number,
    physicsBridge?: PlayerPhysicsBridge,
  ): void {
    // 1. Raw input in local 2D space (X: right/left, Z: backward/forward)
    // In Three.js: -Z is forward, +Z is backward, +X is right, -X is left
    let rawX = 0;
    let rawZ = 0;

    if (input.right) rawX += 1;
    if (input.left) rawX -= 1;
    if (input.backward) rawZ += 1;
    if (input.forward) rawZ -= 1;

    const inputLength = Math.hypot(rawX, rawZ);
    let normX = 0;
    let normZ = 0;

    if (inputLength > 0) {
      normX = rawX / inputLength;
      normZ = rawZ / inputLength;
    }

    // 2. Camera-relative transformation
    let moveDirX = 0;
    let moveDirZ = 0;

    if (inputLength > 0) {
      // Rotate 2D movement vector by camera yaw around Y
      moveDirX = normX * Math.cos(cameraYaw) - normZ * Math.sin(cameraYaw);
      moveDirZ = normX * Math.sin(cameraYaw) + normZ * Math.cos(cameraYaw);

      this.lastMoveDirX = moveDirX;
      this.lastMoveDirZ = moveDirZ;
    } else {
      moveDirX = this.lastMoveDirX;
      moveDirZ = this.lastMoveDirZ;
    }

    // 3. Target speed determination
    let targetSpeed = 0;
    if (inputLength > 0) {
      targetSpeed = input.sprint ? this.config.sprintSpeed : this.config.walkSpeed;
    }

    // ==========================================
    // PATH A: PHYSICS-AWARE RAPIER SIMULATION
    // ==========================================
    if (physicsBridge) {
      const isGrounded = physicsBridge.isGrounded;
      const currentVy = physicsBridge.linvel.y;
      const currentVx = physicsBridge.linvel.x;
      const currentVz = physicsBridge.linvel.z;

      // Update coyote timer (grace window after stepping off a ledge)
      if (isGrounded) {
        this.coyoteTimer = 0.15; // 150ms coyote window
      } else {
        this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
      }

      // Update jump input buffer (register jump slightly before touchdown)
      if (input.jump && !this.wasJumpPressed) {
        this.jumpBufferTimer = 0.12; // 120ms jump buffer
        this.wasJumpPressed = true;
      } else if (!input.jump) {
        this.wasJumpPressed = false;
      }

      if (this.jumpBufferTimer > 0) {
        this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);
      }

      let targetVy = currentVy;

      // JUMP & VERTICAL LOGIC (responsive with coyote time and input buffering)
      const canJump = (isGrounded || this.coyoteTimer > 0) && this.jumpBufferTimer > 0;

      if (canJump) {
        targetVy = PLAYER_PHYSICS.jumpVelocity;
        this.runtime.jumpRequested = true;
        this.runtime.movementState = "JUMPING";
        this.runtime.isGrounded = false;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
      } else {
        if (!isGrounded) {
          this.runtime.jumpRequested = false;
          // Gravity naturally pulls body down; clamp maximum terminal fall velocity
          targetVy = Math.max(currentVy, -PLAYER_PHYSICS.maxFallSpeed);

          if (targetVy < -1.0) {
            this.runtime.movementState = "FALLING";
          } else {
            this.runtime.movementState = "AIRBORNE";
          }
        } else {
          // Grounded
          this.runtime.isGrounded = true;
          this.runtime.jumpRequested = false;

          if (this.runtime.movementState === "FALLING") {
            this.landingTimer = 0.12;
          }

          if (this.landingTimer > 0) {
            this.landingTimer -= delta;
            this.runtime.movementState = "LANDING";
          } else if (this.runtime.speed > this.config.walkSpeed + 0.2) {
            this.runtime.movementState = "SPRINTING";
          } else if (this.runtime.speed > 0.05) {
            this.runtime.movementState = "WALKING";
          } else {
            this.runtime.movementState = "IDLE";
          }
        }
      }

      // HORIZONTAL ACCELERATION WITH AIR CONTROL
      const desiredVx = moveDirX * targetSpeed;
      const desiredVz = moveDirZ * targetSpeed;

      const accelRate = isGrounded
        ? this.config.acceleration
        : this.config.acceleration * PLAYER_PHYSICS.airControl;
      const decelRate = isGrounded
        ? this.config.deceleration
        : this.config.deceleration * PLAYER_PHYSICS.airControl;

      const rate = inputLength > 0 ? accelRate : decelRate;
      const nextVx = THREE.MathUtils.damp(currentVx, desiredVx, rate, delta);
      const nextVz = THREE.MathUtils.damp(currentVz, desiredVz, rate, delta);

      // Apply horizontal + vertical velocities to Rapier body
      physicsBridge.setLinvel({ x: nextVx, y: targetVy, z: nextVz });

      // FALL-OUT-OF-WORLD RECOVERY
      if (physicsBridge.translation.y < PLAYER_PHYSICS.respawnY) {
        const spawn = PLAYER_PHYSICS.spawnPosition;
        physicsBridge.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] });
        physicsBridge.setLinvel({ x: 0, y: 0, z: 0 });
        this.runtime.position.set(spawn[0], spawn[1], spawn[2]);
        this.runtime.velocity.set(0, 0, 0);
        this.runtime.speed = 0;
        this.runtime.movementState = "IDLE";
        this.runtime.isGrounded = true;
      } else {
        // Sync runtime position & velocity from Rapier
        this.runtime.position.set(
          physicsBridge.translation.x,
          physicsBridge.translation.y,
          physicsBridge.translation.z,
        );
        this.runtime.velocity.set(nextVx, targetVy, nextVz);
        this.runtime.speed = Math.hypot(nextVx, nextVz);
        this.runtime.isGrounded = isGrounded;
      }

      // Character rotation towards movement direction
      if (inputLength > 0) {
        const targetYaw = Math.atan2(moveDirX, moveDirZ);
        let diff = targetYaw - this.runtime.rotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.runtime.rotation += diff * Math.min(1, this.config.rotationSpeed * delta);
      }

      return;
    }

    // ==========================================
    // PATH B: KINEMATIC SIMULATION (Unit Tests & Fallback)
    // ==========================================
    if (this.runtime.speed < targetSpeed) {
      this.runtime.speed = Math.min(
        targetSpeed,
        this.runtime.speed + this.config.acceleration * delta,
      );
    } else if (this.runtime.speed > targetSpeed) {
      this.runtime.speed = Math.max(
        targetSpeed,
        this.runtime.speed - this.config.deceleration * delta,
      );
    }

    if (this.runtime.speed > 0.001) {
      this.runtime.velocity.set(moveDirX * this.runtime.speed, 0, moveDirZ * this.runtime.speed);
      this.runtime.position.x += this.runtime.velocity.x * delta;
      this.runtime.position.z += this.runtime.velocity.z * delta;
    } else {
      this.runtime.velocity.set(0, 0, 0);
      this.runtime.speed = 0;
    }

    if (inputLength > 0) {
      const targetYaw = Math.atan2(moveDirX, moveDirZ);
      let diff = targetYaw - this.runtime.rotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.runtime.rotation += diff * Math.min(1, this.config.rotationSpeed * delta);
    }

    if (input.jump) {
      this.runtime.jumpRequested = true;
      this.runtime.movementState = "JUMP_REQUESTED";
    } else if (this.runtime.speed > this.config.walkSpeed + 0.2) {
      this.runtime.movementState = "SPRINTING";
      this.runtime.jumpRequested = false;
    } else if (this.runtime.speed > 0.05) {
      this.runtime.movementState = "WALKING";
      this.runtime.jumpRequested = false;
    } else {
      this.runtime.movementState = "IDLE";
      this.runtime.jumpRequested = false;
    }
  }

  public getRuntimeState(): PlayerRuntimeState {
    return this.runtime;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.runtime.position.set(x, y, z);
  }

  public setRotation(yaw: number): void {
    this.runtime.rotation = yaw;
  }
}
