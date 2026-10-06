"use client";

import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Forest Landmark: Ancient Hollow Cedar & Stone Shrine.
 * Located in a tranquil forest clearing at [-280, 5, -380].
 */
export function AncientTree() {
  return (
    <group position={[-280, 3.8, -380]} name="landmark-ancient-tree">
      {/* Massive Ancient Cedar Trunk with Solid Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 7.0, 0]}>
        <CylinderCollider args={[7.0, 2.8]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[2.2, 3.8, 14, 16]} />
        </mesh>
      </RigidBody>

      {/* Canopy Layers */}
      <mesh position={[0, 15, 0]} castShadow material={SHARED_MATERIALS.pineFoliage}>
        <coneGeometry args={[11, 9, 12]} />
      </mesh>
      <mesh position={[0, 21, 0]} castShadow material={SHARED_MATERIALS.pineFoliage}>
        <coneGeometry args={[8.5, 7.5, 12]} />
      </mesh>
      <mesh position={[0, 26, 0]} castShadow material={SHARED_MATERIALS.pineFoliage}>
        <coneGeometry args={[5.5, 6, 12]} />
      </mesh>

      {/* Ancient Shrine Stone Altar at Base */}
      <RigidBody type="fixed" colliders={false} position={[5.5, 0.6, 2.0]}>
        <CylinderCollider args={[0.6, 1.4]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <cylinderGeometry args={[1.4, 1.6, 1.2, 12]} />
        </mesh>
      </RigidBody>
      {/* Shrine Lantern Glow */}
      <mesh position={[5.5, 1.5, 2.0]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}
