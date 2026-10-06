"use client";

import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface PineTreeProps {
  position: [number, number, number];
  scale?: number;
}

/**
 * Procedural stylized Pine Tree with solid trunk collider and layered evergreen needles.
 */
export function PineTree({ position, scale = 1.0 }: PineTreeProps) {
  const trunkHeight = 3.5 * scale;
  const trunkRadius = 0.45 * scale;

  return (
    <group position={position}>
      {/* Solid Trunk Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, trunkHeight / 2, 0]}>
        <CylinderCollider args={[trunkHeight / 2, trunkRadius]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[trunkRadius * 0.7, trunkRadius, trunkHeight, 8]} />
        </mesh>
      </RigidBody>

      {/* Layer 1 Needle Tier */}
      <mesh
        position={[0, trunkHeight + 2.0 * scale, 0]}
        castShadow
        material={SHARED_MATERIALS.pineFoliage}
      >
        <coneGeometry args={[3.2 * scale, 4.5 * scale, 8]} />
      </mesh>

      {/* Layer 2 Needle Tier */}
      <mesh
        position={[0, trunkHeight + 4.8 * scale, 0]}
        castShadow
        material={SHARED_MATERIALS.pineFoliage}
      >
        <coneGeometry args={[2.4 * scale, 3.8 * scale, 8]} />
      </mesh>

      {/* Top Peak Needle Tier */}
      <mesh
        position={[0, trunkHeight + 7.2 * scale, 0]}
        castShadow
        material={SHARED_MATERIALS.pineFoliage}
      >
        <coneGeometry args={[1.5 * scale, 3.0 * scale, 8]} />
      </mesh>
    </group>
  );
}
