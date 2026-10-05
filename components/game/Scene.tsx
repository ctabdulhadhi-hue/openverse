"use client";

import { OrbitControls } from "@react-three/drei";

import { DebugGrid } from "./DebugGrid";
import { Lighting } from "./Lighting";
import { PrototypeGround } from "./PrototypeGround";
import { SkyEnvironment } from "./SkyEnvironment";

export interface SceneProps {
  showDebugGrid?: boolean;
}

/**
 * Phase 1 Scene composition.
 * Organizes lighting, sky, ground, and development helpers.
 * Serves as the mounting point for future World, Player (Phase 2), and Physics (Phase 3).
 */
export function Scene({ showDebugGrid = true }: SceneProps) {
  return (
    <>
      {/* Sky and atmospheric distance fog */}
      <SkyEnvironment />

      {/* Sun, ambient, and hemisphere lighting with soft shadows */}
      <Lighting />

      {/* Prototype terrain ground with depth reference monoliths */}
      <PrototypeGround />

      {/* Development grid and coordinate axes (toggleable) */}
      <DebugGrid visible={showDebugGrid} />

      {/* Prototype scene inspection controls (free orbit around center, no player follow) */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera clipping below ground plane
        minDistance={6}
        maxDistance={120}
        target={[0, 1.5, 0]}
      />
    </>
  );
}
