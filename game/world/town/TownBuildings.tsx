"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface BuildingProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  variant?: "shop" | "cottage" | "townhouse" | "civic";
}

/**
 * Reusable Town Buildings with varied heights, facades, rooflines, and solid colliders.
 */
export function TownBuilding({
  position,
  rotation = [0, 0, 0],
  variant = "cottage",
}: BuildingProps) {
  if (variant === "shop") {
    return (
      <group position={position} rotation={rotation}>
        <RigidBody type="fixed" colliders={false} position={[0, 2.5, 0]}>
          <CuboidCollider args={[4, 2.5, 5]} />
          {/* Main Body */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingTan}>
            <boxGeometry args={[8, 5, 10]} />
          </mesh>
        </RigidBody>
        {/* Roof */}
        <mesh position={[0, 5.8, 0]} castShadow material={SHARED_MATERIALS.roofTerracotta}>
          <boxGeometry args={[8.4, 0.8, 10.4]} />
        </mesh>
        {/* Front Awning */}
        <mesh position={[0, 3.2, 5.8]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[6.5, 0.15, 2.0]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
        {/* Shop Display Windows */}
        <mesh position={[0, 1.8, 5.05]} material={SHARED_MATERIALS.glassWindow}>
          <planeGeometry args={[5.5, 2.0]} />
        </mesh>
      </group>
    );
  }

  if (variant === "townhouse") {
    return (
      <group position={position} rotation={rotation}>
        <RigidBody type="fixed" colliders={false} position={[0, 4.0, 0]}>
          <CuboidCollider args={[3.5, 4.0, 4.5]} />
          {/* Tall 2-Story Body */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingBlue}>
            <boxGeometry args={[7, 8, 9]} />
          </mesh>
        </RigidBody>
        {/* Pitched Roof */}
        <mesh
          position={[0, 8.8, 0]}
          rotation={[0, 0, 0]}
          castShadow
          material={SHARED_MATERIALS.roofSlate}
        >
          <boxGeometry args={[7.4, 1.6, 9.4]} />
        </mesh>
      </group>
    );
  }

  if (variant === "civic") {
    return (
      <group position={position} rotation={rotation}>
        <RigidBody type="fixed" colliders={false} position={[0, 3.5, 0]}>
          <CuboidCollider args={[6, 3.5, 7]} />
          {/* Civic Hall Body */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingWhite}>
            <boxGeometry args={[12, 7, 14]} />
          </mesh>
        </RigidBody>
        {/* Pillars / Portico */}
        <mesh position={[0, 3.0, 7.8]} castShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[8, 6, 1.5]} />
        </mesh>
        <mesh position={[0, 7.6, 0]} castShadow material={SHARED_MATERIALS.roofSlate}>
          <boxGeometry args={[12.6, 1.2, 14.6]} />
        </mesh>
      </group>
    );
  }

  // Default: Cottage
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false} position={[0, 2.0, 0]}>
        <CuboidCollider args={[3.5, 2.0, 4]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingTan}>
          <boxGeometry args={[7, 4, 8]} />
        </mesh>
      </RigidBody>
      {/* Gable Roof */}
      <mesh position={[0, 4.6, 0]} castShadow material={SHARED_MATERIALS.roofTerracotta}>
        <boxGeometry args={[7.5, 1.2, 8.5]} />
      </mesh>
    </group>
  );
}
