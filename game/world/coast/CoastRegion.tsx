"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { CoastalLighthouse } from "../landmarks/CoastalLighthouse";
import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Sunken Coast Region for OPENVERSE (Phase 4).
 * Coastal beach shoreline, maritime wooden pier, and Azure Point Lighthouse.
 */
export function CoastRegion() {
  return (
    <group name="coast-region">
      {/* Azure Point Lighthouse Landmark */}
      <CoastalLighthouse />

      {/* ======================================================== */}
      {/* Maritime Wooden Pier (Walk out over the water)          */}
      {/* ======================================================== */}
      <group position={[520, 0.4, 30]}>
        {/* Pier Main Deck with Solid Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.7, 0]}>
          <CuboidCollider args={[35, 0.2, 3.5]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[70, 0.4, 7.0]} />
          </mesh>
        </RigidBody>

        {/* Pier Support Pilings */}
        {[-30, -15, 0, 15, 30].map((xOffset) => (
          <group key={xOffset} position={[xOffset, 0, 0]}>
            <mesh position={[0, 0.1, 3.2]} castShadow material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.25, 0.3, 1.8, 8]} />
            </mesh>
            <mesh position={[0, 0.1, -3.2]} castShadow material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.25, 0.3, 1.8, 8]} />
            </mesh>
          </group>
        ))}

        {/* Pier End Deck T-Head Platform */}
        <RigidBody type="fixed" colliders={false} position={[36, 0.7, 0]}>
          <CuboidCollider args={[4, 0.2, 8]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[8, 0.4, 16]} />
          </mesh>
        </RigidBody>
      </group>

      {/* Coastal Rocks & Tide Pools */}
      {(
        [
          [430, 0.8, 120],
          [470, 0.6, 160],
          [410, 1.0, 40],
          [510, 0.5, -40],
        ] as const
      ).map((r, idx) => (
        <RigidBody key={idx} type="fixed" colliders={false} position={[r[0], r[1], r[2]]}>
          <CuboidCollider args={[4.5, 1.5, 4.0]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
            <dodecahedronGeometry args={[5.0, 1]} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
