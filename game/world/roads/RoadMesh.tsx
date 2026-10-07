"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface RoadMeshProps {
  position: [number, number, number];
  length: number;
  width?: number;
  rotation?: [number, number, number];
  hasCurbs?: boolean;
}

/**
 * Reusable paved road strip with lane markings, curbs, and static collision.
 */
export function RoadMesh({
  position,
  length,
  width = 8.0,
  rotation = [0, 0, 0],
  hasCurbs = true,
}: RoadMeshProps) {
  const halfLength = length / 2;
  const halfWidth = width / 2;

  // Generate dashed center line positions
  const dashCount = Math.floor(length / 8);
  const dashes = Array.from({ length: dashCount }, (_, i) => -halfLength + 4 + i * 8);

  return (
    <group position={position} rotation={rotation}>
      {/* Road Deck with Solid Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.05, 0]}>
        <CuboidCollider args={[halfWidth, 0.05, halfLength]} />
        <mesh receiveShadow material={SHARED_MATERIALS.plazaCobble}>
          <boxGeometry args={[width, 0.1, length]} />
        </mesh>
      </RigidBody>

      {/* Carved Stone Center Inlay */}
      {dashes.map((zPos, idx) => (
        <mesh
          key={idx}
          position={[0, 0.11, zPos]}
          receiveShadow
          material={SHARED_MATERIALS.carvedStone}
        >
          <boxGeometry args={[0.5, 0.02, 4]} />
        </mesh>
      ))}

      {/* Curbs */}
      {hasCurbs && (
        <>
          {/* East Curb */}
          <RigidBody type="fixed" colliders={false} position={[halfWidth + 0.15, 0.12, 0]}>
            <CuboidCollider args={[0.15, 0.08, halfLength]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[0.3, 0.16, length]} />
            </mesh>
          </RigidBody>
          {/* West Curb */}
          <RigidBody type="fixed" colliders={false} position={[-halfWidth - 0.15, 0.12, 0]}>
            <CuboidCollider args={[0.15, 0.08, halfLength]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[0.3, 0.16, length]} />
            </mesh>
          </RigidBody>
        </>
      )}
    </group>
  );
}
