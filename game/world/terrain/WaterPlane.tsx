"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Coastal Ocean Water Plane for OPENVERSE.
 * Located on the eastern maritime boundary past the beach.
 */
export function WaterPlane() {
  return (
    <group position={[680, 0.05, 80]} name="ocean-water">
      <mesh receiveShadow material={SHARED_MATERIALS.oceanWater}>
        <planeGeometry args={[500, 600, 16, 16]} />
      </mesh>
    </group>
  );
}
