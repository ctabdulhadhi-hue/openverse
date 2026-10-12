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

  it("spawns the player in Varanaya Royal Promenade plaza facing North", () => {
    const { spawn } = WORLD_CONFIG;
    expect(spawn.position).toEqual([0, 1.2, 8]);
    expect(["royal-core", "town"]).toContain(spawn.regionId);
    expect(spawn.regionName).toContain("Varanaya");

    // Coordinates must reside inside Town / Royal Core region
    const spawnRegion = getRegionAt(spawn.position[0], spawn.position[2]);
    expect(spawnRegion.category).toBe("TOWN");
  });

  it("defines all core connected regions with centers and radii", () => {
    const requiredRegions = [
      "royal-core",
      "waterfront",
      "palace-district",
      "western-approach",
      "outer-sanctuary",
    ];
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
    // 1. Royal Promenade & Central Sanctuary (spawn area)
    expect(getRegionAt(0, 12).category).toBe("TOWN");
    expect(getRegionDisplayName(0, 12)).toBe("Royal Core");

    // 2. Waterfront & Harbor Quay
    expect(getRegionAt(40, 10).category).toBe("COAST");
    expect(getRegionDisplayName(40, 10)).toBe("Waterfront & Harbor");

    // 3. Western Approach & Grand Sea Gate
    expect(getRegionAt(-40, 0).category).toBe("TOWN");
    expect(getRegionDisplayName(-40, 0)).toBe("Western Approach");

    // 4. Northern Highlands & Terraces
    expect(getRegionAt(0, -200).category).toBe("MOUNTAIN");
    expect(getRegionDisplayName(0, -200)).toBe("Northern Highlands");

    // 5. Outer Island Sanctuary across bridge
    expect(getRegionAt(150, 20).category).toBe("COAST");
    expect(getRegionDisplayName(150, 20)).toBe("Outer Sanctuary");
  });

  it("defines recognizable landmarks for all major regions", () => {
    expect(WORLD_LANDMARKS.length).toBeGreaterThanOrEqual(5);

    const townLandmark = WORLD_LANDMARKS.find((l) => l.id === "town_clock_tower");
    expect(townLandmark).toBeDefined();
    expect(townLandmark?.name).toContain("Clock Tower");

    const sanctuaryLandmark = WORLD_LANDMARKS.find((l) => l.id === "varanaya_grand_sanctuary");
    expect(sanctuaryLandmark).toBeDefined();
    expect(sanctuaryLandmark?.name).toContain("Sanctuary");

    const gateLandmark = WORLD_LANDMARKS.find((l) => l.id === "varanaya_sea_gate");
    expect(gateLandmark).toBeDefined();
    expect(gateLandmark?.name).toContain("Gate");

    const bridgeLandmark = WORLD_LANDMARKS.find((l) => l.id === "varanaya_grand_bridge");
    expect(bridgeLandmark).toBeDefined();
    expect(bridgeLandmark?.name).toContain("Bridge");

    const harborLandmark = WORLD_LANDMARKS.find((l) => l.id === "varanaya_waterfront_harbor");
    expect(harborLandmark).toBeDefined();
    expect(harborLandmark?.name).toContain("Harbor");
  });
});
