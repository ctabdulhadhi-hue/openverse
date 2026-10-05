"use client";

import { OrbitControls } from "@react-three/drei";
import type * as THREE from "three";

import { Player } from "@/game/player";

import { DebugGrid } from "./DebugGrid";
import { Lighting } from "./Lighting";
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
  ) => void;
}

/**
 * OPENVERSE 3D Scene.
 * Integrates environmental lighting, sky atmosphere, terrain ground,
 * the playable third-person character (Phase 2), and optional developer tools.
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

      {/* Natural terrain ground (debug monoliths hidden by default) */}
      <PrototypeGround showDebugMonoliths={showDebugGrid} />

      {/* Development grid and coordinate axes (toggleable via F3 / Debug Panel) */}
      <DebugGrid visible={showDebugGrid} />

      {/* Playable third-person character + follow camera */}
      <Player onRuntimeUpdate={onPlayerRuntimeUpdate} />

      {/* Developer free orbit controls (disabled by default; activated via debug panel) */}
      {freeCamera && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent clipping below ground plane
          minDistance={4}
          maxDistance={150}
          target={[0, 1.5, 0]}
        />
      )}
    </>
  );
}
