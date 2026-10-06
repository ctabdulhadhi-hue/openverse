import { describe, expect, it } from "vitest";

import {
  DEFAULT_STREAMING_CONFIG,
  chunkToWorldCenter,
  getChunkBounds,
  getChunkBlueprint,
  getChunkChebyshevDistance,
  getChunkKey,
  getChunksInRadius,
  parseChunkKey,
  streamingStore,
  worldToChunkCoord,
} from "@/game/world/streaming";

describe("Phase 5 — World Streaming & Chunk System", () => {
  it("converts world coordinates to chunk coordinates accurately", () => {
    const size = 200;

    // Spawn at [0, 8] -> chunk (0, 0)
    expect(worldToChunkCoord(0, 8, size)).toEqual({ chunkX: 0, chunkZ: 0 });

    // Positive East/South
    expect(worldToChunkCoord(250, 300, size)).toEqual({ chunkX: 1, chunkZ: 2 });

    // Negative West/North (-250m is chunk -1, -350m is chunk -2)
    expect(worldToChunkCoord(-250, -350, size)).toEqual({ chunkX: -1, chunkZ: -2 });

    // Exact boundary at x = 100 is border between chunk 0 and 1
    expect(worldToChunkCoord(99, 99, size)).toEqual({ chunkX: 0, chunkZ: 0 });
    expect(worldToChunkCoord(101, 101, size)).toEqual({ chunkX: 1, chunkZ: 1 });
  });

  it("formats and parses chunk keys correctly", () => {
    expect(getChunkKey(3, -4)).toBe("3,-4");
    expect(parseChunkKey("3,-4")).toEqual({ chunkX: 3, chunkZ: -4 });
    expect(parseChunkKey("0,0")).toEqual({ chunkX: 0, chunkZ: 0 });
  });

  it("calculates chunk world centers and bounds", () => {
    const size = 200;
    expect(chunkToWorldCenter(0, 0, size)).toEqual([0, 0, 0]);
    expect(chunkToWorldCenter(1, -2, size)).toEqual([200, 0, -400]);

    const bounds = getChunkBounds(0, 0, size);
    expect(bounds).toEqual({ minX: -100, maxX: 100, minZ: -100, maxZ: 100 });
  });

  it("computes Chebyshev distance between chunks", () => {
    expect(getChunkChebyshevDistance({ chunkX: 0, chunkZ: 0 }, { chunkX: 1, chunkZ: 1 })).toBe(1);
    expect(getChunkChebyshevDistance({ chunkX: 0, chunkZ: 0 }, { chunkX: 2, chunkZ: -1 })).toBe(2);
    expect(getChunkChebyshevDistance({ chunkX: -3, chunkZ: 2 }, { chunkX: 1, chunkZ: -1 })).toBe(4);
  });

  it("returns the exact set of chunks for load and active radii", () => {
    const center = { chunkX: 0, chunkZ: 0 };

    // Active radius = 1 chunk -> (2*1 + 1)^2 = 9 chunks (3x3 grid)
    const activeRing = getChunksInRadius(center, DEFAULT_STREAMING_CONFIG.activeRadius);
    expect(activeRing.length).toBe(9);

    // Load radius = 2 chunks -> (2*2 + 1)^2 = 25 chunks (5x5 grid)
    const loadRing = getChunksInRadius(center, DEFAULT_STREAMING_CONFIG.loadRadius);
    expect(loadRing.length).toBe(25);
  });

  it("generates deterministic chunk blueprints for any chunk", () => {
    const bp1 = getChunkBlueprint(0, 0);
    const bp2 = getChunkBlueprint(0, 0);

    expect(bp1.key).toBe(bp2.key);
    expect(bp1.biome).toBe("TOWN");
    expect(bp1.hasPlaza).toBe(true);
    expect(bp1.terrain.materialKey).toBe(bp2.terrain.materialKey);

    // Forest chunk with Ancient Tree
    const forestBp = getChunkBlueprint(-1, -2);
    expect(forestBp.biome).toBe("FOREST");
    expect(forestBp.landmarkId).toBe("ancient_canopy_tree");

    // Mountain chunk with Overlook (Z = -720m falls in chunk (0, -4))
    const mountainBp = getChunkBlueprint(0, -4);
    expect(mountainBp.biome).toBe("MOUNTAIN");
    expect(mountainBp.landmarkId).toBe("mountain_overlook");

    // City chunk with Central Spire (position [380, 0, -420] falls in chunk (2, -2))
    const cityBp = getChunkBlueprint(2, -2);
    expect(cityBp.biome).toBe("CITY");
    expect(cityBp.landmarkId).toBe("central_citadel");

    // Coast chunk with Lighthouse (position [460, 0, 80] falls in chunk (2, 0))
    const coastBp = getChunkBlueprint(2, 0);
    expect(coastBp.biome).toBe("COAST");
    expect(coastBp.landmarkId).toBe("coastal_lighthouse");
  });

  it("updates and broadcasts streamingStore statistics to subscribers", () => {
    let capturedStats = streamingStore.getStats();
    const unsub = streamingStore.subscribe((stats) => {
      capturedStats = stats;
    });

    streamingStore.updateStats({
      currentChunkX: 2,
      currentChunkZ: -1,
      loadedCount: 25,
      activeCount: 9,
      currentRegion: "Central City",
    });

    expect(capturedStats.currentChunkX).toBe(2);
    expect(capturedStats.currentChunkZ).toBe(-1);
    expect(capturedStats.loadedCount).toBe(25);
    expect(capturedStats.activeCount).toBe(9);
    expect(capturedStats.currentRegion).toBe("Central City");

    unsub();
  });
});
