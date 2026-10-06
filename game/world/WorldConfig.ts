/**
 * Scalable World and Region Coordinate Configurations for OPENVERSE.
 *
 * Designed as an expandable continuous multi-region open world.
 * Not bounded to a fixed 2km box: new regions, terrain chunks, settlements,
 * and wilderness sectors can be registered dynamically.
 */

export type RegionCategory =
  "TOWN" | "SUBURB" | "ROAD" | "FOREST" | "MOUNTAIN" | "CITY" | "COAST" | "WILDERNESS";

export interface TerrainChunkConfig {
  id: string;
  center: [number, number, number];
  size: [number, number]; // [width, depth] in meters
  height: number;
  materialKey: string;
}

export interface RegionDefinition {
  id: string;
  name: string;
  category: RegionCategory;
  center: [number, number, number];
  radius: number; // Influence radius for smooth region detection
  description: string;
  themeColor: string;
  terrainChunks?: TerrainChunkConfig[];
}

export const WORLD_CONFIG = {
  // Expandable world coordinate space
  worldType: "EXPANDABLE_CONTINUOUS_WORLD" as const,
  // Default player spawn point in Westport Town Square (facing the Clock Tower to the North)
  spawn: {
    position: [0, 1.2, 8] as [number, number, number],
    rotation: 0,
    regionId: "town",
    regionName: "Westport Town Square",
  },
  waterLevel: 0.0,
};

/**
 * Open, extensible registry of all geographic world regions.
 * Each region is a first-class citizen with its own coordinates, radius, and identity.
 */
export const WORLD_REGIONS: Record<string, RegionDefinition> = {
  town: {
    id: "town",
    name: "Westport Town",
    category: "TOWN",
    center: [0, 0.5, 0],
    radius: 160,
    description: "Historic coastal settlement with cobblestone plaza, shops, and community hall.",
    themeColor: "#10b981",
  },
  forest: {
    id: "forest",
    name: "Pine Crest Forest",
    category: "FOREST",
    center: [-280, 4.0, -220],
    radius: 260,
    description: "Dense evergreen pine wilderness, trails, and ancient landmark tree.",
    themeColor: "#16a34a",
  },
  mountain: {
    id: "mountain",
    name: "Mount Aethel",
    category: "MOUNTAIN",
    center: [0, 24.0, -560],
    radius: 340,
    description: "Elevated alpine massif with stratified rock cliffs and high summit overlook.",
    themeColor: "#64748b",
  },
  city: {
    id: "city",
    name: "Central City",
    category: "CITY",
    center: [320, 2.0, -260],
    radius: 220,
    description:
      "Thriving commercial and administrative district with civic spire and skyscrapers.",
    themeColor: "#38bdf8",
  },
  coast: {
    id: "coast",
    name: "Sunken Coast",
    category: "COAST",
    center: [420, 0.5, 100],
    radius: 260,
    description: "Golden shoreline, coastal bluffs, maritime pier, and Azure Point Lighthouse.",
    themeColor: "#0284c7",
  },
  road: {
    id: "road",
    name: "Valley Thoroughfare",
    category: "ROAD",
    center: [0, 1.0, -140],
    radius: 120,
    description: "Connected arterial highway linking town, wilderness, city, and coast.",
    themeColor: "#f59e0b",
  },
};
