"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { memo, useEffect } from "react";
import type * as THREE from "three";

import { interactionRegistry } from "@/game/interaction";
import { npcManager } from "@/game/npcs";

import { CityRegion } from "../city/CityRegion";
import { CoastRegion } from "../coast/CoastRegion";
import { PineTree } from "../forest/ForestTrees";
import { AncientTree } from "../landmarks/AncientTree";
import { MountainRegion } from "../mountain/MountainRegion";
import { RoadMesh } from "../roads/RoadMesh";
import { TerrainChunk } from "../terrain/TerrainChunk";
import { TownRegion } from "../town/TownRegion";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { getChunkBlueprint } from "./ChunkRegistry";
import type { ChunkData } from "./ChunkState";

export interface WorldChunkProps {
  data: ChunkData;
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * WorldChunk Component (Phase 5).
 *
 * Renders an individual streamed world chunk.
 * Manages:
 * - Dynamic collision enabling/disabling based on active radius
 * - Region-specific structures and landmarks
 * - Deterministic procedural foliage and boulders
 * - Clean unmount cleanup (meshes, colliders, and interactables automatically removed)
 */
export const WorldChunk = memo(function WorldChunk({ data, playerPosRef }: WorldChunkProps) {
  const { chunkX, chunkZ, size, hasCollision } = data;
  const blueprint = getChunkBlueprint(chunkX, chunkZ, size);

  // Automatically unregister interactables and NPCs tied to this chunk when unmounted
  useEffect(() => {
    return () => {
      interactionRegistry.unregisterByChunk(blueprint.key);
      npcManager.despawnByChunk(blueprint.key);
    };
  }, [blueprint.key]);

  const material = SHARED_MATERIALS[blueprint.terrain.materialKey] ?? SHARED_MATERIALS.meadowGrass;

  return (
    <group name={`world-chunk-${blueprint.key}`}>
      {/* 1. Chunk Terrain Foundation */}
      <TerrainChunk
        id={blueprint.key}
        position={[blueprint.worldCenterX, blueprint.terrain.elevation, blueprint.worldCenterZ]}
        size={[size, size]}
        material={material}
        thickness={blueprint.terrain.thickness}
        hasCollider={hasCollision}
      />

      {/* 2. Primary Region Implementations (Placed in their canonical chunks) */}
      {chunkX === 0 && chunkZ === 0 && <TownRegion playerPosRef={playerPosRef} />}
      {chunkX === -1 && chunkZ === -2 && <AncientTree />}
      {chunkX === 0 && (chunkZ === -3 || chunkZ === -4) && <MountainRegion />}
      {chunkX === 2 && chunkZ === -2 && <CityRegion />}
      {chunkX === 2 && chunkZ === 0 && <CoastRegion />}

      {/* 3. Connected Road Segments */}
      {blueprint.roadSegments.map((rd, idx) => (
        <RoadMesh
          key={`rd-${idx}`}
          position={rd.position}
          length={rd.length}
          width={rd.width}
          rotation={rd.rotation}
          hasCurbs={rd.hasCurbs ?? true}
        />
      ))}

      {/* 4. Procedural Trees (Instanced/reusable geometries) */}
      {blueprint.trees.map((t, idx) => (
        <PineTree key={`tr-${idx}`} position={t.position} scale={t.scale} />
      ))}

      {/* 5. Procedural Boulders */}
      {blueprint.boulders.map((b, idx) => {
        const radius = b.scale;
        return hasCollision ? (
          <RigidBody key={`bld-${idx}`} type="fixed" colliders={false} position={b.position}>
            <CuboidCollider args={[radius, radius * 0.7, radius]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
              <dodecahedronGeometry args={[radius, 1]} />
            </mesh>
          </RigidBody>
        ) : (
          <mesh
            key={`bld-${idx}`}
            position={b.position}
            castShadow
            receiveShadow
            material={SHARED_MATERIALS.cliffStone}
          >
            <dodecahedronGeometry args={[radius, 1]} />
          </mesh>
        );
      })}
    </group>
  );
});
