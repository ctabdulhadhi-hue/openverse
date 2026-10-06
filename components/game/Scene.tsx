"use client";

import { OrbitControls } from "@react-three/drei";
import type * as THREE from "three";

import { PhysicsWorld } from "@/game/physics";
import { Player } from "@/game/player";

import { DebugGrid } from "./DebugGrid";
import { Lighting } from "./Lighting";
import { PhysicsTestZone } from "./PhysicsTestZone";
import { PrototypeGround } from "./PrototypeGround";
import { SkyEnvironment } from "./SkyEnvironment";

export interface SceneProps {
  showDebugGrid?: boolean;
  freeCamera?: boolean;
  onPlayerRuntimeUpdate?: (
    pos: THREE.Vector3,
    speed: number,
    stateName: string,
    yaw: number,
    isGrounded?: boolean,
  ) => void;
}

/**
 * OPENVERSE 3D Scene (Phase 3).
 * Integrates:
 * - Environmental lighting & atmospheric sky
 * - Rapier 3D Physics World
 * - Playable Physics Test Zone (ground, road, walls, building, platforms, crates)
 * - Physics-aware playable character with real gravity, jump, and collision
 * - Developer diagnostics and optional free orbit camera
 */
export function Scene({
  showDebugGrid = false,
  freeCamera = false,
  onPlayerRuntimeUpdate,
}: SceneProps) {
  return (
    <>
      {/* Sky and atmospheric distance fog */}
      <SkyEnvironment />

      {/* Sun, ambient, and hemisphere lighting with soft shadows */}
      <Lighting />

      {/* Distant background landscape horizon */}
      <PrototypeGround showDebugMonoliths={false} />

      {/* Development grid and coordinate axes (toggleable via F3 / Debug Panel) */}
      <DebugGrid visible={showDebugGrid} />

      {/* Rapier Physics World: simulates physical collisions, gravity, and player body */}
      <PhysicsWorld debug={showDebugGrid}>
        {/* Playable Physics Test Zone (Ground, Road, Walls, Building, Platforms, Crates) */}
        <PhysicsTestZone />

        {/* Playable third-person character with Rapier RigidBody */}
        <Player onRuntimeUpdate={onPlayerRuntimeUpdate} />
      </PhysicsWorld>

      {/* Developer free orbit controls (disabled by default; activated via debug panel) */}
      {freeCamera && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={4}
          maxDistance={150}
          target={[0, 1.5, 0]}
        />
      )}
    </>
  );
}
