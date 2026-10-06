export interface WorldBoundary {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface RegionBounds {
  id: string;
  name: string;
  category: "TOWN" | "ROAD" | "FOREST" | "MOUNTAIN" | "CITY" | "COAST";
  bounds: WorldBoundary;
  center: [number, number, number];
  color: string;
}

/**
 * World dimension and coordinate configurations for OPENVERSE Phase 4.
 * Total continuous world extent spans approximately 2km x 2km.
 */
export const WORLD_CONFIG = {
  // World bounds in meters: [-1000, 1000] along X and Z
  dimensions: {
    width: 2000,
    depth: 2000,
    minX: -1000,
    maxX: 1000,
    minZ: -1000,
    maxZ: 1000,
  },
  // Default player spawn in Town Square plaza
  spawn: {
    position: [0, 1.2, 0] as [number, number, number],
    rotation: 0,
    regionId: "town_district",
    regionName: "Westport Town Square",
  },
  // Water surface elevation at coast
  waterLevel: 0.0,
};

export const WORLD_REGIONS: Record<string, RegionBounds> = {
  town: {
    id: "town",
    name: "Westport Town",
    category: "TOWN",
    bounds: { minX: -180, maxX: 180, minZ: -100, maxZ: 180 },
    center: [0, 1.2, 40],
    color: "#10b981", // Emerald
  },
  forest: {
    id: "forest",
    name: "Pine Crest Forest",
    category: "FOREST",
    bounds: { minX: -550, maxX: -100, minZ: -550, maxZ: -160 },
    center: [-300, 6, -350],
    color: "#16a34a", // Forest green
  },
  mountain: {
    id: "mountain",
    name: "Mount Aethel",
    category: "MOUNTAIN",
    bounds: { minX: -400, maxX: 350, minZ: -950, maxZ: -500 },
    center: [0, 30, -720],
    color: "#64748b", // Slate
  },
  city: {
    id: "city",
    name: "Central City",
    category: "CITY",
    bounds: { minX: 180, maxX: 600, minZ: -650, maxZ: -180 },
    center: [380, 5, -400],
    color: "#38bdf8", // Sky cyan
  },
  coast: {
    id: "coast",
    name: "Sunken Coast",
    category: "COAST",
    bounds: { minX: 180, maxX: 700, minZ: -180, maxZ: 350 },
    center: [420, 2, 80],
    color: "#0284c7", // Ocean blue
  },
  road: {
    id: "road",
    name: "Valley Thoroughfare",
    category: "ROAD",
    bounds: { minX: -100, maxX: 200, minZ: -250, maxZ: -100 },
    center: [0, 1.5, -170],
    color: "#f59e0b", // Amber
  },
};
