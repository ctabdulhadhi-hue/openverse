/**
 * World Streaming Configuration for OPENVERSE Phase 5.
 *
 * Defines chunk dimensions, streaming distance rings, and procedural seeds.
 *
 * Sizing rationale:
 * - Chunk size: 200m x 200m. Large enough to minimize React component overhead,
 *   small enough to stream smoothly without frame spikes.
 * - Active radius: 1 chunk (3x3 grid = 9 chunks = 600m x 600m with physics colliders).
 * - Load radius: 2 chunks (5x5 grid = 25 chunks = 1000m x 1000m visual render distance).
 * - Unload radius: 3 chunks (chunks at distance >= 3 are unmounted to free memory).
 */

export interface StreamingConfig {
  chunkSize: number; // meters per chunk edge
  activeRadius: number; // chunk distance for full physics collision (Chebyshev metric)
  loadRadius: number; // chunk distance for visual mounting
  unloadRadius: number; // chunk distance beyond which unmounting occurs
  worldSeed: number; // deterministic seed for procedural placement
  debugGrid: boolean; // visualization of chunk boundaries
}

export const DEFAULT_STREAMING_CONFIG: StreamingConfig = {
  chunkSize: 200,
  activeRadius: 1,
  loadRadius: 2,
  unloadRadius: 3,
  worldSeed: 1337,
  debugGrid: false,
};
