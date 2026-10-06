import { DEFAULT_STREAMING_CONFIG } from "./StreamingConfig";

export interface ChunkCoord {
  chunkX: number;
  chunkZ: number;
}

export interface ChunkBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Converts world coordinates (X, Z) into integer chunk coordinates.
 * Uses a centered grid where chunk (0, 0) covers [-chunkSize/2, chunkSize/2].
 */
export function worldToChunkCoord(
  worldX: number,
  worldZ: number,
  chunkSize = DEFAULT_STREAMING_CONFIG.chunkSize,
): ChunkCoord {
  return {
    chunkX: Math.floor((worldX + chunkSize / 2) / chunkSize),
    chunkZ: Math.floor((worldZ + chunkSize / 2) / chunkSize),
  };
}

/**
 * Returns a unique string key for a chunk coordinate.
 */
export function getChunkKey(chunkX: number, chunkZ: number): string {
  return `${chunkX},${chunkZ}`;
}

/**
 * Parses a chunk key back into integer coordinates.
 */
export function parseChunkKey(key: string): ChunkCoord {
  const parts = key.split(",");
  return {
    chunkX: parseInt(parts[0] ?? "0", 10),
    chunkZ: parseInt(parts[1] ?? "0", 10),
  };
}

/**
 * Computes world-space center [X, Y, Z] of a chunk.
 */
export function chunkToWorldCenter(
  chunkX: number,
  chunkZ: number,
  chunkSize = DEFAULT_STREAMING_CONFIG.chunkSize,
): [number, number, number] {
  return [chunkX * chunkSize, 0, chunkZ * chunkSize];
}

/**
 * Returns the axis-aligned world bounds of a chunk.
 */
export function getChunkBounds(
  chunkX: number,
  chunkZ: number,
  chunkSize = DEFAULT_STREAMING_CONFIG.chunkSize,
): ChunkBounds {
  const centerX = chunkX * chunkSize;
  const centerZ = chunkZ * chunkSize;
  const half = chunkSize / 2;
  return {
    minX: centerX - half,
    maxX: centerX + half,
    minZ: centerZ - half,
    maxZ: centerZ + half,
  };
}

/**
 * Chebyshev distance (maximum coordinate difference) between two chunks.
 */
export function getChunkChebyshevDistance(a: ChunkCoord, b: ChunkCoord): number {
  return Math.max(Math.abs(a.chunkX - b.chunkX), Math.abs(a.chunkZ - b.chunkZ));
}

/**
 * Returns all chunk coordinates within a given Chebyshev radius around a center chunk.
 */
export function getChunksInRadius(
  center: ChunkCoord,
  radius: number,
): Array<ChunkCoord & { key: string }> {
  const result: Array<ChunkCoord & { key: string }> = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const chunkX = center.chunkX + dx;
      const chunkZ = center.chunkZ + dz;
      result.push({
        chunkX,
        chunkZ,
        key: getChunkKey(chunkX, chunkZ),
      });
    }
  }
  return result;
}
