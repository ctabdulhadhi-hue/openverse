"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";

import { getRegionAt } from "../WorldRegions";
import {
  chunkToWorldCenter,
  getChunkChebyshevDistance,
  getChunksInRadius,
  worldToChunkCoord,
} from "./ChunkCoordinates";
import type { ChunkData } from "./ChunkState";
import { DEFAULT_STREAMING_CONFIG, type StreamingConfig } from "./StreamingConfig";
import { streamingStore } from "./StreamingStore";
import { WorldChunk } from "./WorldChunk";

export interface WorldStreamerProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
  config?: StreamingConfig;
}

/**
 * WorldStreamer (Phase 5).
 *
 * Player-centered world streaming engine.
 * Responsibilities:
 * 1. Tracks player chunk coordinates without frame-by-frame React re-renders.
 * 2. Mounts required chunks within loadRadius (5x5 grid = 25 chunks = 1000m x 1000m).
 * 3. Activates physics collision only for chunks within activeRadius (3x3 grid = 9 chunks).
 * 4. Unmounts distant chunks outside unloadRadius, freeing GPU and physics memory.
 * 5. Telemeters real-time statistics to StreamingStore for the F3 debug panel.
 */
export function WorldStreamer({
  playerPosRef,
  config = DEFAULT_STREAMING_CONFIG,
}: WorldStreamerProps) {
  const { chunkSize, activeRadius, loadRadius } = config;

  // Stored current player chunk coordinates
  const lastChunkCoordsRef = useRef<{ chunkX: number; chunkZ: number }>({
    chunkX: 0,
    chunkZ: 0,
  });

  // Helper to compute chunk list for given coordinates
  const computeChunks = useCallback(
    (center: { chunkX: number; chunkZ: number }): ChunkData[] => {
      const candidates = getChunksInRadius(center, loadRadius);
      const list: ChunkData[] = [];

      for (const c of candidates) {
        const dist = getChunkChebyshevDistance(center, c);
        const isActive = dist <= activeRadius;
        const [wcX, , wcZ] = chunkToWorldCenter(c.chunkX, c.chunkZ, chunkSize);
        const region = getRegionAt(wcX, wcZ);

        list.push({
          key: c.key,
          chunkX: c.chunkX,
          chunkZ: c.chunkZ,
          worldCenterX: wcX,
          worldCenterZ: wcZ,
          size: chunkSize,
          regionId: region.id,
          regionName: region.name,
          state: isActive ? "ACTIVE" : "LOADED",
          hasCollision: isActive,
        });
      }

      return list;
    },
    [activeRadius, chunkSize, loadRadius],
  );

  // Initial loaded chunks around spawn (0, 0)
  const [loadedChunks, setLoadedChunks] = useState<ChunkData[]>(() =>
    computeChunks({ chunkX: 0, chunkZ: 0 }),
  );

  // Frame check: evaluate if player crossed a chunk boundary
  useFrame(() => {
    const playerPos = playerPosRef?.current;
    if (!playerPos) return;

    const currentCoords = worldToChunkCoord(playerPos.x, playerPos.z, chunkSize);
    const lastCoords = lastChunkCoordsRef.current;

    if (currentCoords.chunkX !== lastCoords.chunkX || currentCoords.chunkZ !== lastCoords.chunkZ) {
      lastChunkCoordsRef.current = currentCoords;
      const updatedChunks = computeChunks(currentCoords);
      setLoadedChunks(updatedChunks);

      // Update streaming telemetry store
      const activeCount = updatedChunks.filter((c) => c.hasCollision).length;
      const region = getRegionAt(playerPos.x, playerPos.z);

      streamingStore.updateStats({
        currentChunkX: currentCoords.chunkX,
        currentChunkZ: currentCoords.chunkZ,
        loadedCount: updatedChunks.length,
        activeCount,
        loadingCount: 0,
        unloadingCount: 0,
        currentRegion: region.name,
        // Approximate physics bodies (each active chunk hosts ~4-12 static bodies)
        activePhysicsBodies: activeCount * 6 + 12,
      });
    }
  });

  return (
    <group name="openverse-world-streamer">
      {loadedChunks.map((chunk) => (
        <WorldChunk key={chunk.key} data={chunk} />
      ))}

      {/* Optional Debug Chunk Outlines */}
      {config.debugGrid && (
        <group name="debug-chunk-grid">
          {loadedChunks.map((chunk) => {
            return (
              <lineSegments
                key={`dbg-${chunk.key}`}
                position={[chunk.worldCenterX, 0.2, chunk.worldCenterZ]}
              >
                <edgesGeometry args={[new THREE.BoxGeometry(chunkSize, 0.5, chunkSize)]} />
                <lineBasicMaterial
                  color={chunk.hasCollision ? "#10b981" : "#0284c7"}
                  linewidth={2}
                />
              </lineSegments>
            );
          })}
        </group>
      )}
    </group>
  );
}
