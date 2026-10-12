"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, type RapierRigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useGame } from "@/game/core/state/GameContext";
import { dialogueManager, dialogueStore } from "@/game/dialogue";
import { interactionManager, interactionStore } from "@/game/interaction";
import { missionManager } from "@/game/missions/MissionManager";
import { PLAYER_PHYSICS } from "@/game/physics/PhysicsConfig";
import { playerPositionTracker } from "@/game/world/map/PlayerPositionTracker";

import { PlayerCamera } from "./PlayerCamera";
import { DEFAULT_PLAYER_CONFIG } from "./PlayerConfig";
import { PlayerController, type PlayerPhysicsBridge } from "./PlayerController";
import { PlayerInputManager } from "./PlayerInput";
import { createPlayerRuntimeState } from "./PlayerState";

export interface PlayerProps {
  onRuntimeUpdate?: (
    pos: THREE.Vector3,
    speed: number,
    stateName: string,
    yaw: number,
    isGrounded?: boolean,
  ) => void;
}

/**
 * Playable third-person character with real Rapier physics for OPENVERSE.
 * Integrates:
 * - Dynamic Rapier RigidBody with humanoid CapsuleCollider
 * - Downward raycast for precise ground detection
 * - Real jump, gravity, falling, and landing
 * - Air control and obstacle collision
 * - Procedural animations adapted for grounded, jumping, falling, and landing states
 */
export function Player({ onRuntimeUpdate }: PlayerProps) {
  const { state } = useGame();
  const { gl, camera } = useThree();
  const { rapier, world } = useRapier();

  // Rapier physics body ref
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  // Root visual character transform ref
  const characterGroupRef = useRef<THREE.Group>(null);

  // Interaction camera forward vector cache
  const camForwardRef = useRef(new THREE.Vector3());

  // Limb refs for procedural locomotion & airborne animation
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);

  // Animation cycle accumulator
  const animTimeRef = useRef(0);

  // Persistent simulation instances initialized once
  const [instances] = useState(() => {
    const runtime = createPlayerRuntimeState({
      position: [
        PLAYER_PHYSICS.spawnPosition[0],
        PLAYER_PHYSICS.spawnPosition[1],
        PLAYER_PHYSICS.spawnPosition[2],
      ],
      rotation: DEFAULT_PLAYER_CONFIG.spawn.rotation,
    });
    const controller = new PlayerController(runtime, DEFAULT_PLAYER_CONFIG.movement);
    const cameraController = new PlayerCamera(DEFAULT_PLAYER_CONFIG.camera);
    const inputManager = new PlayerInputManager();
    return { runtime, controller, cameraController, inputManager };
  });

  // Attach / Detach input manager & sync menu suppression
  useEffect(() => {
    const input = instances.inputManager;
    input.attach();

    const canvasElement = gl.domElement;
    const handleCanvasClick = () => {
      // Request pointer lock only when no menu overlay is open and dialogue is inactive
      if (state.ui.activeMenu === "none" && !dialogueStore.isActive()) {
        const target = canvasElement && canvasElement.isConnected ? canvasElement : document.body;
        input.requestPointerLock(target);
      }
    };

    canvasElement.addEventListener("click", handleCanvasClick);

    return () => {
      input.detach();
      canvasElement.removeEventListener("click", handleCanvasClick);
    };
  }, [gl.domElement, instances.inputManager, state.ui.activeMenu]);

  // Synchronize input enabling with game menu and dialogue state
  useEffect(() => {
    const updateInputState = () => {
      const isGameplayActive = state.ui.activeMenu === "none" && !dialogueStore.isActive();
      instances.inputManager.setEnabled(isGameplayActive);
    };

    updateInputState();
    const unsubscribe = dialogueStore.subscribe(() => {
      updateInputState();
    });

    return unsubscribe;
  }, [instances.inputManager, state.ui.activeMenu]);

  // Clean up interaction manager on unmount
  useEffect(() => {
    return () => {
      interactionManager.reset();
    };
  }, []);

  // Diagnostic dev & E2E camera / position inspection bridge
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __OPENVERSE_PLAYER__?: unknown }).__OPENVERSE_PLAYER__ = {
        teleport: (x: number, y: number, z: number, yaw?: number) => {
          if (rigidBodyRef.current) {
            rigidBodyRef.current.setTranslation({ x, y, z }, true);
            rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          }
          instances.runtime.position.set(x, y, z);
          if (typeof yaw === "number") {
            instances.cameraController.yaw = yaw;
            if (characterGroupRef.current) {
              characterGroupRef.current.rotation.y = yaw;
            }
          }
          instances.cameraController.resetInitialization();
          playerPositionTracker.update({ x, y, z }, yaw);
        },
        getPosition: () => playerPositionTracker.getPosition(),
        getYaw: () => playerPositionTracker.getYaw(),
        setCameraYaw: (yaw: number, pitch = 0.15) => {
          instances.cameraController.yaw = yaw;
          instances.cameraController.pitch = pitch;
          instances.cameraController.resetInitialization();
        },
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as { __OPENVERSE_PLAYER__?: unknown }).__OPENVERSE_PLAYER__;
      }
    };
  }, [instances.cameraController, instances.runtime.position]);

  // Frame simulation loop
  useFrame((_, delta) => {
    // Clamp delta to prevent physics spikes during tab focus changes
    const dt = Math.min(delta, 0.1);

    const { inputManager: input, controller, cameraController: camControl, runtime } = instances;

    // 1. Process mouse camera rotation
    const mouseDelta = input.consumeMouseDelta();
    if (mouseDelta.deltaX !== 0 || mouseDelta.deltaY !== 0) {
      camControl.updateMouseLook(
        mouseDelta.deltaX,
        mouseDelta.deltaY,
        state.settings.controls.invertY,
        false,
      );
    }

    // 2. Perform Rapier ground detection via downward raycast
    let isGrounded = true;
    const rb = rigidBodyRef.current;

    if (rb && rapier && world) {
      const translation = rb.translation();
      // Cast downward ray from lower torso region (0.5m above character base)
      const rayOriginY = translation.y + 0.5;
      const rayMaxDistance = 0.5 + PLAYER_PHYSICS.groundCheckDistance;

      const ray = new rapier.Ray(
        { x: translation.x, y: rayOriginY, z: translation.z },
        { x: 0, y: -1, z: 0 },
      );

      // Cast ray excluding character's own rigid body
      const hit = world.castRay(ray, rayMaxDistance, true, undefined, undefined, undefined, rb);

      isGrounded = Boolean(hit && hit.timeOfImpact <= rayMaxDistance);

      // Step-climbing assist (smoothly climbs curbs, terraces, and steps up to 0.45m)
      const inputSnapshot = input.getSnapshot();
      if (
        isGrounded &&
        (inputSnapshot.forward ||
          inputSnapshot.backward ||
          inputSnapshot.left ||
          inputSnapshot.right)
      ) {
        let rawMoveX = 0;
        let rawMoveZ = 0;
        if (inputSnapshot.right) rawMoveX += 1;
        if (inputSnapshot.left) rawMoveX -= 1;
        if (inputSnapshot.backward) rawMoveZ += 1;
        if (inputSnapshot.forward) rawMoveZ -= 1;
        const moveLen = Math.hypot(rawMoveX, rawMoveZ);
        if (moveLen > 0) {
          const normMoveX = rawMoveX / moveLen;
          const normMoveZ = rawMoveZ / moveLen;
          const moveDirX =
            normMoveX * Math.cos(camControl.yaw) - normMoveZ * Math.sin(camControl.yaw);
          const moveDirZ =
            normMoveX * Math.sin(camControl.yaw) + normMoveZ * Math.cos(camControl.yaw);

          // 1. Cast forward ray at shin height (0.15m) to detect step riser
          const stepCheckDist = 0.55;
          const shinRay = new rapier.Ray(
            { x: translation.x, y: translation.y + 0.15, z: translation.z },
            { x: moveDirX, y: 0, z: moveDirZ },
          );
          const shinHit = world.castRay(
            shinRay,
            stepCheckDist,
            true,
            undefined,
            undefined,
            undefined,
            rb,
          );

          if (shinHit && shinHit.timeOfImpact < stepCheckDist) {
            // 2. Cast downward ray from above max step climb height (0.65m) ahead of step riser
            const stepProbeDist = Math.max(0.25, shinHit.timeOfImpact + 0.15);
            const probeX = translation.x + moveDirX * stepProbeDist;
            const probeZ = translation.z + moveDirZ * stepProbeDist;
            const stepDownRay = new rapier.Ray(
              { x: probeX, y: translation.y + 0.65, z: probeZ },
              { x: 0, y: -1, z: 0 },
            );
            const stepDownHit = world.castRay(
              stepDownRay,
              0.8,
              true,
              undefined,
              undefined,
              undefined,
              rb,
            );

            if (stepDownHit && stepDownHit.timeOfImpact < 0.8) {
              const stepTopY = translation.y + 0.65 - stepDownHit.timeOfImpact;
              const stepHeightDelta = stepTopY - translation.y;

              // If valid climbable step between 0.04m and 0.45m
              if (stepHeightDelta > 0.04 && stepHeightDelta <= 0.45) {
                const lift = Math.min(stepHeightDelta + 0.02, dt * 10.0);
                translation.y += lift;
                rb.setTranslation({ x: translation.x, y: translation.y, z: translation.z }, true);
              }
            }
          }
        }
      }

      // Construct physics bridge for PlayerController
      const physicsBridge: PlayerPhysicsBridge = {
        linvel: rb.linvel(),
        translation,
        isGrounded,
        setLinvel: (vel) => rb.setLinvel(vel, true),
        setTranslation: (pos) => rb.setTranslation(pos, true),
      };

      // 3. Update physics-aware movement
      controller.update(dt, inputSnapshot, camControl.yaw, physicsBridge);
    } else {
      // Fallback kinematic update if physics body isn't ready
      const inputSnapshot = input.getSnapshot();
      controller.update(dt, inputSnapshot, camControl.yaw);
    }

    // 4. Collision-aware camera check via Rapier raycast
    let cameraObstacleDist: number | null = null;
    if (rb && rapier && world && camControl.getConfig().collisionEnabled) {
      const charPos = runtime.position;
      const targetFocusY = charPos.y + camControl.getConfig().targetHeight;
      const focusVec = { x: charPos.x, y: targetFocusY, z: charPos.z };

      // Compute ideal camera offset vector from focus point
      const horizDist = camControl.getConfig().distance * Math.cos(camControl.pitch);
      const idealOffsetX = -horizDist * Math.sin(camControl.yaw);
      const idealOffsetZ = horizDist * Math.cos(camControl.yaw);
      const idealOffsetY =
        camControl.getConfig().height +
        camControl.getConfig().distance * Math.sin(camControl.pitch);

      const rayDir = { x: idealOffsetX, y: idealOffsetY, z: idealOffsetZ };
      const rayLen = Math.hypot(rayDir.x, rayDir.y, rayDir.z);

      if (rayLen > 0.01) {
        const normDir = { x: rayDir.x / rayLen, y: rayDir.y / rayLen, z: rayDir.z / rayLen };
        const camRay = new rapier.Ray(focusVec, normDir);
        // Cast ray excluding player's own body
        const camHit = world.castRay(camRay, rayLen, true, undefined, undefined, undefined, rb);
        if (camHit && camHit.timeOfImpact < rayLen) {
          cameraObstacleDist = camHit.timeOfImpact;
        }
      }
    }

    // 5. Update third-person camera following character with collision pullback
    camControl.update(camera, runtime.position, dt, cameraObstacleDist);

    // 6. Interaction detection & player interaction trigger
    camera.getWorldDirection(camForwardRef.current);
    interactionManager.update(runtime.position, camForwardRef.current, world, rapier, rb);

    // Dialogue proximity safety check
    if (dialogueStore.isActive()) {
      dialogueManager.checkProximity([runtime.position.x, runtime.position.y, runtime.position.z]);
    }

    // Mission Reach objective verification (Phase 9)
    missionManager.checkReachObjectives([
      runtime.position.x,
      runtime.position.y,
      runtime.position.z,
    ]);

    if (input.consumeInteract()) {
      if (!interactionStore.getActiveReadable() && !dialogueStore.isActive()) {
        void interactionManager.trigger(runtime.position, camForwardRef.current);
      }
    }

    // 7. Update visual character model position and yaw
    if (characterGroupRef.current) {
      characterGroupRef.current.position.copy(runtime.position);
      characterGroupRef.current.rotation.y = runtime.rotation;
    }

    // 6. Procedural limb & posture animation
    const speed = runtime.speed;
    const isMoving = speed > 0.1;
    const movementState = runtime.movementState;

    if (
      movementState === "JUMPING" ||
      movementState === "AIRBORNE" ||
      movementState === "FALLING"
    ) {
      // Dynamic airborne posture: arms spread slightly for balance, knees drawn up
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.35;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.15;
      if (torsoRef.current) torsoRef.current.position.y = 1.08;
    } else if (movementState === "LANDING") {
      // Impact compression: slight squat on touchdown
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.2;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.2;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.15;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.15;
      if (torsoRef.current) torsoRef.current.position.y = 0.96;
    } else if (isMoving) {
      // Ground locomotion stride
      const frequency = speed > 4.5 ? 12 : 8; // Faster stride when sprinting
      animTimeRef.current += dt * frequency;
      const swing = Math.sin(animTimeRef.current);
      const armSwingRange = speed > 4.5 ? 0.75 : 0.45;
      const legSwingRange = speed > 4.5 ? 0.85 : 0.55;

      if (leftArmRef.current) leftArmRef.current.rotation.x = swing * armSwingRange;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing * armSwingRange;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * legSwingRange;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * legSwingRange;
      if (torsoRef.current) {
        torsoRef.current.position.y = 1.05 + Math.abs(Math.sin(animTimeRef.current * 2)) * 0.05;
      }
    } else {
      // Idle breathing and neutral limb rest
      animTimeRef.current += dt * 2.5;
      const breath = Math.sin(animTimeRef.current) * 0.015;

      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (torsoRef.current) torsoRef.current.position.y = 1.05 + breath;
    }

    // Synchronize UI map position tracker
    playerPositionTracker.update(runtime.position, camControl.yaw);

    // Telemetry callback
    onRuntimeUpdate?.(
      runtime.position,
      runtime.speed,
      runtime.movementState,
      camControl.yaw,
      runtime.isGrounded,
    );
  });

  return (
    <>
      {/* 
        Rapier Dynamic Rigid Body for Player
        Origin is at ground/feet position (y = 0).
        Capsule collider is offset vertically so it spans [0.0m, 1.80m].
      */}
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        colliders={false}
        position={PLAYER_PHYSICS.spawnPosition}
        enabledRotations={[false, false, false]}
        mass={PLAYER_PHYSICS.mass}
        gravityScale={PLAYER_PHYSICS.gravityScale}
        linearDamping={PLAYER_PHYSICS.linearDamping}
        friction={0.0}
        canSleep={false}
      >
        <CapsuleCollider
          args={[PLAYER_PHYSICS.capsuleHalfHeight, PLAYER_PHYSICS.capsuleRadius]}
          position={[0, PLAYER_PHYSICS.capsuleHalfHeight + PLAYER_PHYSICS.capsuleRadius, 0]}
        />
      </RigidBody>

      {/* Visual Humanoid Character Model */}
      <group ref={characterGroupRef} dispose={null}>
        {/* Head */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#cbb89d" roughness={0.7} />
        </mesh>
        {/* Hair / Headband Accent */}
        <mesh position={[0, 1.78, -0.02]} castShadow>
          <boxGeometry args={[0.22, 0.12, 0.22]} />
          <meshStandardMaterial color="#2d221c" roughness={0.9} />
        </mesh>

        {/* Torso (Explorer Jacket) */}
        <mesh ref={torsoRef} position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.65, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>

        {/* Backpack detail */}
        <mesh position={[0, 1.15, -0.18]} castShadow>
          <boxGeometry args={[0.28, 0.36, 0.16]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.28, 1.3, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.12, 0.55, 0.14]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.28, 1.3, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.12, 0.55, 0.14]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.13, 0.72, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.72, 0.16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.68, 0.04]} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.24]} />
            <meshStandardMaterial color="#171717" roughness={0.9} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.13, 0.72, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.72, 0.16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.68, 0.04]} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.24]} />
            <meshStandardMaterial color="#171717" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </>
  );
}
