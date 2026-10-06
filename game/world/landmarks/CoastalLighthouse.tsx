"use client";

import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Coastal Landmark: Azure Point Lighthouse & Maritime Pier.
 * Located at [480, 0.5, 80] overlooking the eastern sea.
 */
export function CoastalLighthouse() {
  return (
    <group position={[480, 0.5, 80]} name="landmark-coastal-lighthouse">
      {/* Stone Base Podium */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.75, 0]}>
        <CylinderCollider args={[0.75, 5.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <cylinderGeometry args={[4.8, 5.4, 1.5, 20]} />
        </mesh>
      </RigidBody>

      {/* Tapered White & Red Lighthouse Tower Shaft */}
      <RigidBody type="fixed" colliders={false} position={[0, 9.5, 0]}>
        <CylinderCollider args={[8.0, 3.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingWhite}>
          <cylinderGeometry args={[2.4, 3.8, 16, 20]} />
        </mesh>
      </RigidBody>

      {/* Red Accent Band */}
      <mesh position={[0, 11.5, 0]} castShadow material={SHARED_MATERIALS.roofTerracotta}>
        <cylinderGeometry args={[2.7, 3.0, 3.6, 20]} />
      </mesh>

      {/* Observation Balcony Gallery */}
      <mesh position={[0, 17.8, 0]} castShadow material={SHARED_MATERIALS.curbConcrete}>
        <cylinderGeometry args={[3.2, 3.2, 0.5, 20]} />
      </mesh>

      {/* Lantern Room Glass Enclosure */}
      <mesh position={[0, 19.8, 0]} material={SHARED_MATERIALS.glassWindow}>
        <cylinderGeometry args={[2.2, 2.2, 3.5, 16]} />
      </mesh>
      {/* Rotating Lighthouse Beacon Light */}
      <mesh position={[0, 19.8, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#fde047" emissive="#eab308" emissiveIntensity={1.5} />
      </mesh>

      {/* Copper Lantern Dome Roof */}
      <mesh position={[0, 22.3, 0]} castShadow material={SHARED_MATERIALS.roofSlate}>
        <coneGeometry args={[2.6, 1.6, 20]} />
      </mesh>
    </group>
  );
}
