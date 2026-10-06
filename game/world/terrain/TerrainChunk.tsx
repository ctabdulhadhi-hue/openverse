"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type * as THREE from "three";

export interface TerrainChunkProps {
  id?: string;
  position: [number, number, number];
  size: [number, number]; // [width (X), depth (Z)]
  material: THREE.Material;
  thickness?: number; // depth below ground surface for solid foundation (default: 1.0m)
  hasCollider?: boolean;
}

/**
 * Reusable Terrain Chunk Component for OPENVERSE.
 *
 * Provides modular, expandable world terrain architecture.
 * Regions compose multiple TerrainChunks with distinct surface materials,
 * elevations, and physical static colliders.
 *
 * Guaranteed horizontal orientation — completely eliminates vertical plane bugs.
 */
export function TerrainChunk({
  id,
  position,
  size,
  material,
  thickness = 1.0,
  hasCollider = true,
}: TerrainChunkProps) {
  const [width, depth] = size;
  const halfThickness = thickness / 2;

  return (
    <group position={position} name={id ? `terrain-chunk-${id}` : "terrain-chunk"}>
      {hasCollider ? (
        <RigidBody type="fixed" colliders={false} position={[0, -halfThickness, 0]}>
          <CuboidCollider args={[width / 2, halfThickness, depth / 2]} />
          <mesh receiveShadow material={material}>
            <boxGeometry args={[width, thickness, depth]} />
          </mesh>
        </RigidBody>
      ) : (
        <mesh position={[0, -halfThickness, 0]} receiveShadow material={material}>
          <boxGeometry args={[width, thickness, depth]} />
        </mesh>
      )}
    </group>
  );
}
