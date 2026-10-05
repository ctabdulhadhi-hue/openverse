"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

import { useGame } from "@/game/core/state/GameContext";

import { PlayerCamera } from "./PlayerCamera";
import { DEFAULT_PLAYER_CONFIG } from "./PlayerConfig";
import { PlayerController } from "./PlayerController";
import { PlayerInputManager } from "./PlayerInput";
import { createPlayerRuntimeState } from "./PlayerState";

export interface PlayerProps {
  onRuntimeUpdate?: (pos: THREE.Vector3, speed: number, stateName: string, yaw: number) => void;
}

/**
 * Playable third-person character for OPENVERSE.
 * Integrates procedural humanoid avatar, PlayerController, PlayerCamera, and centralized input.
 */
export function Player({ onRuntimeUpdate }: PlayerProps) {
  const { state } = useGame();
  const { gl, camera } = useThree();

  // Root character transform ref
  const characterGroupRef = useRef<THREE.Group>(null);

  // Limb refs for procedural locomotion animation
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);

  // Animation cycle accumulator
  const animTimeRef = useRef(0);

  // Persistent simulation instances initialized once
  const [instances] = useState(() => {
    const runtime = createPlayerRuntimeState(DEFAULT_PLAYER_CONFIG.spawn);
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
      // Request pointer lock only when no menu overlay is open
      if (state.ui.activeMenu === "none") {
        input.requestPointerLock(canvasElement);
      }
    };

    canvasElement.addEventListener("click", handleCanvasClick);

    return () => {
      input.detach();
      canvasElement.removeEventListener("click", handleCanvasClick);
    };
  }, [gl.domElement, instances.inputManager, state.ui.activeMenu]);

  // Synchronize input enabling with game menu state
  useEffect(() => {
    const isGameplayActive = state.ui.activeMenu === "none";
    instances.inputManager.setEnabled(isGameplayActive);
  }, [instances.inputManager, state.ui.activeMenu]);

  // Frame simulation loop
  useFrame((_, delta) => {
    // Clamp delta to prevent simulation spikes during tab focus changes
    const dt = Math.min(delta, 0.1);

    const { inputManager: input, controller, cameraController: camControl, runtime } = instances;

    // 1. Process mouse camera rotation
    const mouseDelta = input.consumeMouseDelta();
    if (mouseDelta.deltaX !== 0 || mouseDelta.deltaY !== 0) {
      camControl.updateMouseLook(
        mouseDelta.deltaX,
        mouseDelta.deltaY,
        state.settings.controls.invertY,
      );
    }

    // 2. Update character movement relative to camera yaw
    const inputSnapshot = input.getSnapshot();
    controller.update(dt, inputSnapshot, camControl.yaw);

    // 3. Update third-person camera following character
    camControl.update(camera, runtime.position, dt);

    // 4. Update visual character model position and yaw
    if (characterGroupRef.current) {
      characterGroupRef.current.position.copy(runtime.position);
      characterGroupRef.current.rotation.y = runtime.rotation;
    }

    // 5. Procedural limb animation
    const speed = runtime.speed;
    const isMoving = speed > 0.1;

    if (isMoving) {
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

    // Optional runtime telemetry callback
    onRuntimeUpdate?.(runtime.position, runtime.speed, runtime.movementState, camControl.yaw);
  });

  return (
    <group ref={characterGroupRef} dispose={null}>
      {/* Humanoid Placeholder Mesh: Stylized Low-Poly Hadhi Silhouette */}

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
  );
}
