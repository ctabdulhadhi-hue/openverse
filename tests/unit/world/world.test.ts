import { describe, expect, it } from "vitest";

import {
  WORLD_CONFIG,
  WORLD_LANDMARKS,
  WORLD_REGIONS,
  getRegionAt,
  getRegionDisplayName,
} from "@/game/world";

describe("Phase 4 — Expandable Continuous Open World Architecture", () => {
  it("configures expandable continuous world architecture without fixed 2km limit", () => {
    expect(WORLD_CONFIG.worldType).toBe("EXPANDABLE_CONTINUOUS_WORLD");
    expect(WORLD_CONFIG.waterLevel).toBe(0.0);
  });

  it("spawns the player in Westport Town Square plaza facing North", () => {
    const { spawn } = WORLD_CONFIG;
    expect(spawn.position).toEqual([0, 1.2, 8]);
    expect(spawn.regionId).toBe("town");
    expect(spawn.regionName).toContain("Westport");

    // Coordinates must reside inside Town region
    const spawnRegion = getRegionAt(spawn.position[0], spawn.position[2]);
    expect(spawnRegion.category).toBe("TOWN");
  });

  it("defines all core connected regions with centers and radii", () => {
    const requiredRegions = ["town", "forest", "mountain", "city", "coast", "road"];
    requiredRegions.forEach((regionId) => {
      const region = WORLD_REGIONS[regionId];
      expect(region).toBeDefined();
      if (!region) return;
      expect(region.id).toBe(regionId);
      expect(region.name.length).toBeGreaterThan(0);
      expect(region.center.length).toBe(3);
      expect(region.radius).toBeGreaterThan(0);
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
    expect(getRegionAt(0, -600).category).toBe("MOUNTAIN");
    expect(getRegionDisplayName(0, -600)).toBe("Mount Aethel");

    // 4. Central City District
    expect(getRegionAt(320, -260).category).toBe("CITY");
    expect(getRegionDisplayName(320, -260)).toBe("Central City");

    // 5. Sunken Coast Shoreline
    expect(getRegionAt(420, 80).category).toBe("COAST");
    expect(getRegionDisplayName(420, 80)).toBe("Sunken Coast");

    // 6. Connecting Highway / Valley Road
    expect(getRegionAt(0, -180).category).toBe("ROAD");
    expect(getRegionDisplayName(0, -180)).toBe("Valley Thoroughfare");
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
});
