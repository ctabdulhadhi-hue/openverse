"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Westport Clock Tower Landmark.
 * Positioned prominently at the north edge of Town Square ([0, 0, -28]),
 * facing the player's spawn point with grand archways, stone shaft, clock faces, and copper spire.
 */
export function ClockTower() {
  return (
    <group position={[0, 0, -28]} name="landmark-town-clock-tower">
      {/* 1. Base Plinth / Steps */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.4, 0]}>
        <CuboidCollider args={[4, 0.4, 4]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.plazaCobble}>
          <boxGeometry args={[8, 0.8, 8]} />
        </mesh>
      </RigidBody>

      {/* 2. Main Stone Shaft */}
      <RigidBody type="fixed" colliders={false} position={[0, 6.0, 0]}>
        <CuboidCollider args={[2.2, 5.2, 2.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingTan}>
          <boxGeometry args={[4.4, 10.4, 4.4]} />
        </mesh>
      </RigidBody>

      {/* Decorative shaft pilasters / corners */}
      {[
        [-2.1, 6.0, -2.1] as const,
        [2.1, 6.0, -2.1] as const,
        [-2.1, 6.0, 2.1] as const,
        [2.1, 6.0, 2.1] as const,
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[0.5, 10.4, 0.5]} />
        </mesh>
      ))}

      {/* 3. Clock Chamber */}
      <group position={[0, 12.4, 0]}>
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[4.8, 3.2, 4.8]} />
        </mesh>
        {/* 4 Clock Faces (North, South, East, West) */}
        {[
          { pos: [0, 0, 2.45] as const, rot: [0, 0, 0] as const },
          { pos: [0, 0, -2.45] as const, rot: [0, Math.PI, 0] as const },
          { pos: [2.45, 0, 0] as const, rot: [0, Math.PI / 2, 0] as const },
          { pos: [-2.45, 0, 0] as const, rot: [0, -Math.PI / 2, 0] as const },
        ].map((face, i) => (
          <group key={i} position={face.pos} rotation={face.rot}>
            <mesh material={SHARED_MATERIALS.plazaCobble}>
              <cylinderGeometry args={[1.3, 1.3, 0.1, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.06]} material={SHARED_MATERIALS.buildingWhite}>
              <cylinderGeometry args={[1.15, 1.15, 0.05, 24]} />
            </mesh>
            {/* Clock Hands */}
            <mesh position={[0, 0.35, 0.1]} material={SHARED_MATERIALS.roofSlate}>
              <boxGeometry args={[0.08, 0.7, 0.02]} />
            </mesh>
            <mesh position={[0.25, 0, 0.1]} material={SHARED_MATERIALS.roofSlate}>
              <boxGeometry args={[0.5, 0.08, 0.02]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Belfry & Spire */}
      <RigidBody type="fixed" colliders={false} position={[0, 15.6, 0]}>
        <CuboidCollider args={[2.0, 1.6, 2.0]} />
        <mesh castShadow material={SHARED_MATERIALS.roofSlate}>
          <boxGeometry args={[4.0, 3.2, 4.0]} />
        </mesh>
      </RigidBody>

      {/* Pyramidal Spire Roof */}
      <mesh position={[0, 19.4, 0]} castShadow material={SHARED_MATERIALS.roofSlate}>
        <coneGeometry args={[2.6, 4.8, 4]} />
      </mesh>

      {/* Spire Finial Needle */}
      <mesh position={[0, 22.4, 0]} material={SHARED_MATERIALS.curbConcrete}>
        <cylinderGeometry args={[0.08, 0.18, 1.8, 8]} />
      </mesh>
    </group>
  );
}
