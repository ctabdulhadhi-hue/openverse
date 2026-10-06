"use client";

import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * City Landmark: Central Spire & Civic Plaza.
 * Monumental civic landmark located at [380, 2.8, -420].
 */
export function CentralSpire() {
  return (
    <group position={[380, 2.8, -420]} name="landmark-central-spire">
      {/* Civic Podium Steps with Solid Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.6, 0]}>
        <CuboidCollider args={[14, 0.6, 14]} />
        <mesh receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[28, 1.2, 28]} />
        </mesh>
      </RigidBody>

      {/* Main Citadel Tower Shaft */}
      <RigidBody type="fixed" colliders={false} position={[0, 16.0, 0]}>
        <CuboidCollider args={[6.5, 14.8, 6.5]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[13, 29.6, 13]} />
        </mesh>
      </RigidBody>

      {/* Blue Glass Accent Panels */}
      <mesh position={[0, 16.0, 6.6]} material={SHARED_MATERIALS.glassWindow}>
        <planeGeometry args={[10, 26]} />
      </mesh>
      <mesh
        position={[0, 16.0, -6.6]}
        rotation={[0, Math.PI, 0]}
        material={SHARED_MATERIALS.glassWindow}
      >
        <planeGeometry args={[10, 26]} />
      </mesh>

      {/* Upper Spire Tier */}
      <mesh position={[0, 33.5, 0]} castShadow material={SHARED_MATERIALS.roofSlate}>
        <boxGeometry args={[9, 6, 9]} />
      </mesh>

      {/* Antenna Mast with Beacon Light */}
      <RigidBody type="fixed" colliders={false} position={[0, 42.0, 0]}>
        <CylinderCollider args={[6.0, 0.3]} />
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.4, 12, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </RigidBody>
      {/* Beacon Glow */}
      <mesh position={[0, 48.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}
