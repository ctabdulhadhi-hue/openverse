"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Coastal Ocean Water Plane for OPENVERSE.
 * Extends over the eastern maritime shore beyond the beach.
 * Correctly rotated horizontally to lay flat across the ocean basin.
 */
export function WaterPlane() {
  return (
    <group position={[640, 0.08, 160]} name="ocean-water">
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={SHARED_MATERIALS.oceanWater}>
        <planeGeometry args={[480, 720, 16, 16]} />
      </mesh>
    </group>
  );
}
