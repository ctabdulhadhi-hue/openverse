"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { PhysicsWorld } from "@/game/physics";
import { Player } from "@/game/player";
import { World } from "@/game/world";
import { streamingStore } from "@/game/world/streaming";

import { DebugGrid } from "./DebugGrid";
import { Lighting } from "./Lighting";
import { PhysicsTestZone } from "./PhysicsTestZone";
import { SkyEnvironment } from "./SkyEnvironment";

function RenderStatsCollector() {
  const { gl } = useThree();
  const counterRef = useRef(0);

  useFrame(() => {
    counterRef.current++;
    if (counterRef.current % 15 === 0) {
      streamingStore.updateStats({
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
      });
    }
  });

  return null;
}

export interface SceneProps {
  showDebugGrid?: boolean;
  freeCamera?: boolean;
  showTestZone?: boolean; // Debug-only toggle to inspect Phase 3 physics obstacle course
  onPlayerRuntimeUpdate?: (
    pos: THREE.Vector3,
    speed: number,
    stateName: string,
    yaw: number,
    isGrounded?: boolean,
  ) => void;
}

/**
 * OPENVERSE 3D Scene (Phase 4).
 *
 * Integrates:
 * - Atmospheric sky and natural distance fog
 * - Dynamic sun, ambient, and hemisphere lighting with soft shadows
 * - Rapier 3D Physics World
 * - First Continuous Open World (Town → Road → Forest → Mountain → City → Coast)
 * - Physics-aware playable third-person character
 * - Optional debug grid and developer tools
 */
export function Scene({
  showDebugGrid = false,
  freeCamera = false,
  showTestZone = false,
  onPlayerRuntimeUpdate,
}: SceneProps) {
  const playerPosRef = useRef<THREE.Vector3 | null>(null);

  return (
    <>
      {/* Real-time WebGL render telemetry collector */}
      <RenderStatsCollector />

      {/* Sky and atmospheric horizon distance fog */}
      <SkyEnvironment />

      {/* Sun, ambient, and hemisphere lighting with soft shadows */}
      <Lighting />

      {/* Development grid and coordinate axes (toggleable via F3 / Debug Panel) */}
      <DebugGrid visible={showDebugGrid} />

      {/* Rapier Physics World: simulates physical collisions, gravity, and player body */}
      <PhysicsWorld debug={showDebugGrid}>
        {/* Continuous OPENVERSE World with dynamic chunk streaming */}
        {!showTestZone && <World playerPosRef={playerPosRef} />}

        {/* Phase 3 Physics Test Zone (available for diagnostic testing via debug toggle) */}
        {showTestZone && <PhysicsTestZone />}

        {/* Playable third-person character with Rapier RigidBody */}
        <Player
          onRuntimeUpdate={(pos, speed, stateName, yaw, isGrounded) => {
            if (!playerPosRef.current) {
              playerPosRef.current = pos.clone();
            } else {
              playerPosRef.current.copy(pos);
            }
            onPlayerRuntimeUpdate?.(pos, speed, stateName, yaw, isGrounded);
          }}
        />
      </PhysicsWorld>

      {/* Developer free orbit controls (disabled by default; activated via debug panel) */}
      {freeCamera && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={4}
          maxDistance={250}
          target={[0, 1.5, 0]}
        />
      )}
    </>
  );
}
