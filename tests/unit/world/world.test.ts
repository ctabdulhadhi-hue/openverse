import { describe, expect, it } from "vitest";

import {
  WORLD_CONFIG,
  WORLD_LANDMARKS,
  WORLD_REGIONS,
  getRegionAt,
  getRegionDisplayName,
} from "@/game/world";

describe("Phase 4 — Continuous Open World Architecture", () => {
  it("configures ~2km x 2km continuous world boundaries", () => {
    const { dimensions } = WORLD_CONFIG;
    expect(dimensions.width).toBe(2000);
    expect(dimensions.depth).toBe(2000);
    expect(dimensions.minX).toBe(-1000);
    expect(dimensions.maxX).toBe(1000);
    expect(dimensions.minZ).toBe(-1000);
    expect(dimensions.maxZ).toBe(1000);
  });

  it("spawns the player in Westport Town Square plaza", () => {
    const { spawn } = WORLD_CONFIG;
    expect(spawn.position).toEqual([0, 1.2, 0]);
    expect(spawn.regionId).toBe("town_district");
    expect(spawn.regionName).toContain("Westport");

    // Coordinates must reside inside Town region bounds
    const spawnRegion = getRegionAt(spawn.position[0], spawn.position[2]);
    expect(spawnRegion.category).toBe("TOWN");
  });

  it("defines all six core connected regions", () => {
    const requiredRegions = ["town", "forest", "mountain", "city", "coast", "road"];
    requiredRegions.forEach((regionId) => {
      const region = WORLD_REGIONS[regionId];
      expect(region).toBeDefined();
      if (!region) return;
      expect(region.id).toBe(regionId);
      expect(region.name.length).toBeGreaterThan(0);
      expect(region.center.length).toBe(3);
      expect(region.bounds.minX).toBeLessThan(region.bounds.maxX);
      expect(region.bounds.minZ).toBeLessThan(region.bounds.maxZ);
    });
  });

  it("detects regions dynamically from world coordinates", () => {
    // 1. Town Square & Outskirts
    expect(getRegionAt(0, 12).category).toBe("TOWN");
    expect(getRegionDisplayName(0, 12)).toBe("Westport Town");

    // 2. Pine Crest Forest
    expect(getRegionAt(-280, -350).category).toBe("FOREST");
    expect(getRegionDisplayName(-280, -350)).toBe("Pine Crest Forest");

    // 3. Mount Aethel Summit / Ridge
    expect(getRegionAt(0, -700).category).toBe("MOUNTAIN");
    expect(getRegionDisplayName(0, -700)).toBe("Mount Aethel");

    // 4. Central City District
    expect(getRegionAt(380, -400).category).toBe("CITY");
    expect(getRegionDisplayName(380, -400)).toBe("Central City");

    // 5. Sunken Coast Shoreline
    expect(getRegionAt(450, 80).category).toBe("COAST");
    expect(getRegionDisplayName(450, 80)).toBe("Sunken Coast");

    // 6. Connecting Highway / Valley Road
    expect(getRegionAt(0, -150).category).toBe("ROAD");
    expect(getRegionDisplayName(0, -150)).toBe("Valley Thoroughfare");
  });

  it("defines recognizable landmarks for all major regions", () => {
    expect(WORLD_LANDMARKS.length).toBeGreaterThanOrEqual(5);

    const townLandmark = WORLD_LANDMARKS.find((l) => l.id === "town_clock_tower");
    expect(townLandmark).toBeDefined();
    expect(townLandmark?.name).toContain("Clock Tower");

    const forestLandmark = WORLD_LANDMARKS.find((l) => l.id === "ancient_canopy_tree");
    expect(forestLandmark).toBeDefined();
    expect(forestLandmark?.name).toContain("Cedar");

    const mountainLandmark = WORLD_LANDMARKS.find((l) => l.id === "mountain_overlook");
    expect(mountainLandmark).toBeDefined();
    expect(mountainLandmark?.name).toContain("Overlook");

    const cityLandmark = WORLD_LANDMARKS.find((l) => l.id === "central_citadel");
    expect(cityLandmark).toBeDefined();
    expect(cityLandmark?.name).toContain("Spire");

    const coastLandmark = WORLD_LANDMARKS.find((l) => l.id === "coastal_lighthouse");
    expect(coastLandmark).toBeDefined();
    expect(coastLandmark?.name).toContain("Lighthouse");
  });

  it("verifies world landmarks are positioned within valid map coordinates", () => {
    WORLD_LANDMARKS.forEach((lm) => {
      const [x, , z] = lm.position;
      expect(x).toBeGreaterThanOrEqual(WORLD_CONFIG.dimensions.minX);
      expect(x).toBeLessThanOrEqual(WORLD_CONFIG.dimensions.maxX);
      expect(z).toBeGreaterThanOrEqual(WORLD_CONFIG.dimensions.minZ);
      expect(z).toBeLessThanOrEqual(WORLD_CONFIG.dimensions.maxZ);
    });
  });
});
