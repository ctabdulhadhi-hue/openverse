import { DEFAULT_PLAYER_CONFIG, type PlayerMovementConfig } from "./PlayerConfig";
import type { PlayerInputSnapshot } from "./PlayerInput";
import type { PlayerRuntimeState } from "./PlayerState";

export class PlayerController {
  private config: PlayerMovementConfig;
  private runtime: PlayerRuntimeState;

  // Stored last moving direction for smooth deceleration after releasing keys
  private lastMoveDirX = 0;
  private lastMoveDirZ = -1;

  constructor(
    runtimeState: PlayerRuntimeState,
    config: PlayerMovementConfig = DEFAULT_PLAYER_CONFIG.movement,
  ) {
    this.runtime = runtimeState;
    this.config = config;
  }

  public update(delta: number, input: PlayerInputSnapshot, cameraYaw: number): void {
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

    // 4. Smooth frame-rate independent acceleration / deceleration
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

    // 5. Update velocity and position
    if (this.runtime.speed > 0.001) {
      this.runtime.velocity.set(moveDirX * this.runtime.speed, 0, moveDirZ * this.runtime.speed);
      this.runtime.position.x += this.runtime.velocity.x * delta;
      this.runtime.position.z += this.runtime.velocity.z * delta;
    } else {
      this.runtime.velocity.set(0, 0, 0);
      this.runtime.speed = 0;
    }

    // 6. Smooth character rotation towards movement direction
    if (inputLength > 0) {
      const targetYaw = Math.atan2(moveDirX, moveDirZ);
      let diff = targetYaw - this.runtime.rotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.runtime.rotation += diff * Math.min(1, this.config.rotationSpeed * delta);
    }

    // 7. Update state machine
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
