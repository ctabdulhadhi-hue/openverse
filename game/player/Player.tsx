"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, type RapierRigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { ambientAudioSystem } from "@/game/audio";
import { introStore } from "@/game/cinematic/introStore";
import { useGame } from "@/game/core/state/GameContext";
import { dialogueManager, dialogueStore } from "@/game/dialogue";
import { discoveryManager } from "@/game/discovery";
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
  const { state, pushNotification } = useGame();
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
  const torsoRef = useRef<THREE.Group>(null);
  const ribbonsRef = useRef<THREE.Group>(null);

  // Dynamic animation and turning lean refs
  const animTimeRef = useRef(0);
  const prevYawRef = useRef(0);
  const turnRollRef = useRef(0);
  const landingTimerRef = useRef(0);
  const wasAirborneRef = useRef(false);
  const discoveryTimerRef = useRef(0);

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
      // Start/resume procedural ambient audio
      ambientAudioSystem.init();
      ambientAudioSystem.resume();

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

  // Synchronize ambient audio volume settings
  useEffect(() => {
    const vol =
      (state.settings.audio.masterVolume / 100) * (state.settings.audio.ambientVolume / 100);
    ambientAudioSystem.setVolume(vol);
  }, [state.settings.audio.masterVolume, state.settings.audio.ambientVolume]);

  // Synchronize input enabling with game menu, dialogue, and cinematic intro state
  useEffect(() => {
    const updateInputState = () => {
      const isGameplayActive =
        state.ui.activeMenu === "none" && !dialogueStore.isActive() && !introStore.isActive();
      instances.inputManager.setEnabled(isGameplayActive);
    };

    updateInputState();
    const unsubDialogue = dialogueStore.subscribe(() => {
      updateInputState();
    });
    const unsubIntro = introStore.subscribe((t) => {
      updateInputState();
      if (t.phase === "COMPLETED") {
        instances.cameraController.resetInitialization();
      }
    });

    return () => {
      unsubDialogue();
      unsubIntro();
    };
  }, [instances.cameraController, instances.inputManager, state.ui.activeMenu]);

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
    if (!introStore.isFlyoverActive()) {
      camControl.update(camera, runtime.position, dt, cameraObstacleDist);
    }

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

    // Throttled open-world location discovery & ambient audio position update (~5 Hz)
    discoveryTimerRef.current += dt;
    if (discoveryTimerRef.current > 0.2) {
      discoveryTimerRef.current = 0;
      const posTuple: [number, number, number] = [
        runtime.position.x,
        runtime.position.y,
        runtime.position.z,
      ];
      ambientAudioSystem.updatePlayerPosition(posTuple[0], posTuple[1], posTuple[2]);
      const discoveredLocations = discoveryManager.checkProximity(posTuple);
      for (const disc of discoveredLocations) {
        ambientAudioSystem.playDiscoveryChime();
        pushNotification({
          type: "location",
          title: disc.isViewpoint ? "VIEWPOINT DISCOVERED" : "LOCATION DISCOVERED",
          subtitle: `${disc.name} (${disc.regionName})`,
        });
      }
    }

    if (input.consumeInteract()) {
      if (!interactionStore.getActiveReadable() && !dialogueStore.isActive()) {
        void interactionManager.trigger(runtime.position, camForwardRef.current);
      }
    }

    // 7. Update visual character model position and yaw with turning banking
    const currentYaw = runtime.rotation;
    let yawDiff = currentYaw - prevYawRef.current;
    while (yawDiff > Math.PI) yawDiff -= 2 * Math.PI;
    while (yawDiff < -Math.PI) yawDiff += 2 * Math.PI;
    prevYawRef.current = currentYaw;

    // Smooth banking roll into sharp turns
    const targetRoll = Math.max(-0.14, Math.min(0.14, yawDiff * 3.5));
    turnRollRef.current = THREE.MathUtils.lerp(turnRollRef.current, targetRoll, dt * 10.0);

    if (characterGroupRef.current) {
      characterGroupRef.current.position.copy(runtime.position);
      characterGroupRef.current.rotation.y = currentYaw;
      characterGroupRef.current.rotation.z = -turnRollRef.current;
    }

    // 8. Procedural limb & posture animation
    const speed = runtime.speed;
    const isMoving = speed > 0.1;
    const movementState = runtime.movementState;
    const isAirborne =
      movementState === "JUMPING" || movementState === "AIRBORNE" || movementState === "FALLING";

    // Detect touchdown transition for landing impact squash
    if (wasAirborneRef.current && !isAirborne && runtime.isGrounded) {
      landingTimerRef.current = 0.18; // 180ms landing impact compression
    }
    wasAirborneRef.current = isAirborne;

    if (landingTimerRef.current > 0) {
      landingTimerRef.current -= dt;
    }

    if (isAirborne) {
      // Dynamic airborne posture: arms spread for aerodynamic balance, knees drawn up
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          -0.45,
          dt * 12,
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          -0.22,
          dt * 12,
        );
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          -0.45,
          dt * 12,
        );
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0.22,
          dt * 12,
        );
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(
          leftLegRef.current.rotation.x,
          0.38,
          dt * 12,
        );
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(
          rightLegRef.current.rotation.x,
          0.16,
          dt * 12,
        );
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = THREE.MathUtils.lerp(
          torsoRef.current.position.y,
          1.08,
          dt * 10,
        );
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(
          torsoRef.current.rotation.x,
          -0.05,
          dt * 10,
        );
      }
      if (ribbonsRef.current) {
        ribbonsRef.current.rotation.x = -0.45;
      }
    } else if (landingTimerRef.current > 0 || movementState === "LANDING") {
      // Impact compression: slight squat on touchdown
      const landRatio = Math.max(0, landingTimerRef.current / 0.18);
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.22 * landRatio;
        leftArmRef.current.rotation.z = -0.1 * landRatio;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.22 * landRatio;
        rightArmRef.current.rotation.z = 0.1 * landRatio;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.15 * landRatio;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.15 * landRatio;
      if (torsoRef.current) {
        torsoRef.current.position.y = 1.05 - 0.08 * landRatio;
        torsoRef.current.rotation.x = 0.08 * landRatio;
      }
    } else if (isMoving) {
      // Ground locomotion stride
      const isSprinting = speed > 4.5;
      const frequency = isSprinting ? 13.0 : 8.5; // Faster stride when sprinting
      animTimeRef.current += dt * frequency;
      const swing = Math.sin(animTimeRef.current);
      const armSwingRange = isSprinting ? 0.75 : 0.42;
      const legSwingRange = isSprinting ? 0.82 : 0.52;

      // Sprint forward torso lean & dynamic bounce
      const forwardLean = isSprinting ? 0.16 : 0.04;
      if (torsoRef.current) {
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(
          torsoRef.current.rotation.x,
          forwardLean,
          dt * 10,
        );
        torsoRef.current.position.y =
          1.05 + Math.abs(Math.sin(animTimeRef.current * 2)) * (isSprinting ? 0.06 : 0.035);
      }

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = swing * armSwingRange;
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          0,
          dt * 10,
        );
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -swing * armSwingRange;
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0,
          dt * 10,
        );
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * legSwingRange;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * legSwingRange;

      if (ribbonsRef.current) {
        ribbonsRef.current.rotation.x = THREE.MathUtils.lerp(
          ribbonsRef.current.rotation.x,
          isSprinting
            ? 0.55 + Math.sin(animTimeRef.current * 2) * 0.12
            : 0.25 + Math.sin(animTimeRef.current * 2) * 0.08,
          dt * 12,
        );
      }
    } else {
      // Idle breathing and neutral limb rest
      animTimeRef.current += dt * 2.2;
      const breath = Math.sin(animTimeRef.current) * 0.012;

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          0.04,
          dt * 8,
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          0.02,
          dt * 8,
        );
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          0.04,
          dt * 8,
        );
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          -0.02,
          dt * 8,
        );
      }
      if (leftLegRef.current)
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(
          leftLegRef.current.rotation.x,
          0,
          dt * 8,
        );
      if (rightLegRef.current)
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(
          rightLegRef.current.rotation.x,
          0,
          dt * 8,
        );
      if (torsoRef.current) {
        torsoRef.current.position.y = 1.05 + breath;
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, 0, dt * 8);
      }
      if (ribbonsRef.current) {
        ribbonsRef.current.rotation.x = 0.15 + Math.sin(animTimeRef.current * 1.5) * 0.06;
      }
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

      {/* Visual Humanoid Character Model — Styled Coastal Adventurer */}
      <group ref={characterGroupRef} dispose={null}>
        {/* === HEAD & FACE === */}
        <group position={[0, 1.7, 0]}>
          {/* Head Base */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.175, 18, 18]} />
            <meshStandardMaterial color="#d4be9e" roughness={0.65} />
          </mesh>

          {/* Sculpted Wanderer Hair (Dark Espresso) */}
          <mesh position={[0, 0.08, -0.04]} castShadow>
            <sphereGeometry args={[0.185, 16, 16]} />
            <meshStandardMaterial color="#1f1a16" roughness={0.9} />
          </mesh>
          {/* Front swept hair locks */}
          <mesh position={[0, 0.14, 0.08]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.24, 0.08, 0.12]} />
            <meshStandardMaterial color="#1f1a16" roughness={0.9} />
          </mesh>

          {/* Saffron Silk Headband */}
          <mesh position={[0, 0.04, 0]} rotation={[0.08, 0, 0]} castShadow>
            <cylinderGeometry args={[0.182, 0.182, 0.05, 18]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>
          {/* Trailing Headband Ribbons (Back of Head with Wind Flutter) */}
          <group ref={ribbonsRef} position={[0, -0.04, -0.19]}>
            <mesh position={[0.06, -0.04, 0]} rotation={[0.25, 0.15, -0.2]} castShadow>
              <boxGeometry args={[0.04, 0.22, 0.015]} />
              <meshStandardMaterial color="#ea580c" roughness={0.6} />
            </mesh>
            <mesh position={[-0.04, -0.02, 0]} rotation={[0.2, -0.1, 0.15]} castShadow>
              <boxGeometry args={[0.035, 0.18, 0.015]} />
              <meshStandardMaterial color="#ea580c" roughness={0.6} />
            </mesh>
          </group>

          {/* Gold Earring (Left Ear) */}
          <mesh position={[-0.18, -0.03, 0]}>
            <torusGeometry args={[0.025, 0.006, 8, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Facial Features (Eyes & Brow) */}
          <mesh position={[0.055, 0.02, 0.16]}>
            <boxGeometry args={[0.04, 0.015, 0.01]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
          <mesh position={[-0.055, 0.02, 0.16]}>
            <boxGeometry args={[0.04, 0.015, 0.01]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </group>

        {/* === TORSO (Layered Explorer Tunic & Leather Harness) === */}
        <group ref={torsoRef} position={[0, 1.05, 0]}>
          {/* Main Traveler Coat (Deep Indigo / Navy) */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.44, 0.64, 0.28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>

          {/* Ivory Linen Collar V-Neck Inlay */}
          <mesh position={[0, 0.24, 0.145]}>
            <boxGeometry args={[0.18, 0.16, 0.01]} />
            <meshStandardMaterial color="#fdfbf7" roughness={0.55} />
          </mesh>

          {/* Leather Cross-Chest Harness Strap */}
          <mesh position={[0, 0.06, 0.145]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[0.06, 0.68, 0.015]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* Polished Brass Chest Buckle */}
          <mesh position={[0.02, 0.08, 0.155]}>
            <boxGeometry args={[0.09, 0.08, 0.02]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Wide Waist Belt (Leather) */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <boxGeometry args={[0.46, 0.12, 0.3]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* Ornate Gold Sun Medallion Belt Buckle */}
          <mesh position={[0, -0.22, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Hip Leather Utility Pouch (Right Hip) */}
          <mesh position={[0.24, -0.2, 0.04]} castShadow>
            <boxGeometry args={[0.09, 0.14, 0.12]} />
            <meshStandardMaterial color="#92400e" roughness={0.75} />
          </mesh>

          {/* === BACKPACK & TRAVEL EQUIPMENT === */}
          {/* Rugged Traveler Pack */}
          <mesh position={[0, 0.1, -0.2]} castShadow>
            <boxGeometry args={[0.3, 0.38, 0.18]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          {/* Rolled Saffron Bedroll (Strapped on top of pack) */}
          <mesh position={[0, 0.32, -0.19]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.36, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.85} />
          </mesh>
          {/* Brass Canteen Flask (Hanging on side of pack) */}
          <mesh position={[-0.18, 0.02, -0.18]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>

        {/* === ARMS & HANDS === */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.29, 1.32, 0]}>
          {/* Shoulder Pauldron Cap */}
          <mesh position={[-0.01, 0.02, 0]} castShadow>
            <sphereGeometry args={[0.095, 12, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Upper Arm Sleeve */}
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.06, 0.32, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Forearm Leather Bracer / Vambrace */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <cylinderGeometry args={[0.062, 0.055, 0.22, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
          {/* Leather Glove Wrist Cuff */}
          <mesh position={[0, -0.47, 0]} castShadow>
            <cylinderGeometry args={[0.064, 0.058, 0.06, 10]} />
            <meshStandardMaterial color="#5c2606" roughness={0.75} />
          </mesh>
          {/* Palm & Glove Hand */}
          <mesh position={[0, -0.53, 0.01]} castShadow>
            <boxGeometry args={[0.075, 0.08, 0.07]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
          {/* Exposed Fingers */}
          <mesh position={[0, -0.58, 0.015]} castShadow>
            <boxGeometry args={[0.065, 0.04, 0.06]} />
            <meshStandardMaterial color="#d4be9e" roughness={0.65} />
          </mesh>
          {/* Glove Thumb */}
          <mesh position={[0.04, -0.52, 0.02]} rotation={[0, 0, -0.35]} castShadow>
            <boxGeometry args={[0.025, 0.045, 0.03]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.29, 1.32, 0]}>
          {/* Shoulder Pauldron Cap */}
          <mesh position={[0.01, 0.02, 0]} castShadow>
            <sphereGeometry args={[0.095, 12, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Upper Arm Sleeve */}
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.06, 0.32, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Forearm Leather Bracer / Vambrace */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <cylinderGeometry args={[0.062, 0.055, 0.22, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
          {/* Leather Glove Wrist Cuff */}
          <mesh position={[0, -0.47, 0]} castShadow>
            <cylinderGeometry args={[0.064, 0.058, 0.06, 10]} />
            <meshStandardMaterial color="#5c2606" roughness={0.75} />
          </mesh>
          {/* Palm & Glove Hand */}
          <mesh position={[0, -0.53, 0.01]} castShadow>
            <boxGeometry args={[0.075, 0.08, 0.07]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
          {/* Exposed Fingers */}
          <mesh position={[0, -0.58, 0.015]} castShadow>
            <boxGeometry args={[0.065, 0.04, 0.06]} />
            <meshStandardMaterial color="#d4be9e" roughness={0.65} />
          </mesh>
          {/* Glove Thumb */}
          <mesh position={[-0.04, -0.52, 0.02]} rotation={[0, 0, 0.35]} castShadow>
            <boxGeometry args={[0.025, 0.045, 0.03]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
        </group>

        {/* === LEGS & BOOTS (Ground aligned: sole bottom at y=0.0) === */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.13, 0.72, 0]}>
          {/* Trousers (Tapered Adventurer Breeches) */}
          <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.085, 0.075, 0.44, 10]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Knee-High Leather Boot Cuff Turnover */}
          <mesh position={[0, -0.46, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.08, 0.12, 10]} />
            <meshStandardMaterial color="#5c2606" roughness={0.75} />
          </mesh>
          {/* Boot Shaft & Foot */}
          <mesh position={[0, -0.58, 0.03]} castShadow>
            <boxGeometry args={[0.14, 0.2, 0.22]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          {/* Reinforced Thick Boot Sole (Bottom sits flush at y=0.0) */}
          <mesh position={[0, -0.7, 0.04]} castShadow>
            <boxGeometry args={[0.15, 0.04, 0.26]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.13, 0.72, 0]}>
          {/* Trousers */}
          <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.085, 0.075, 0.44, 10]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Knee-High Leather Boot Cuff Turnover */}
          <mesh position={[0, -0.46, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.08, 0.12, 10]} />
            <meshStandardMaterial color="#5c2606" roughness={0.75} />
          </mesh>
          {/* Boot Shaft & Foot */}
          <mesh position={[0, -0.58, 0.03]} castShadow>
            <boxGeometry args={[0.14, 0.2, 0.22]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          {/* Reinforced Thick Boot Sole (Bottom sits flush at y=0.0) */}
          <mesh position={[0, -0.7, 0.04]} castShadow>
            <boxGeometry args={[0.15, 0.04, 0.26]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </>
  );
}
