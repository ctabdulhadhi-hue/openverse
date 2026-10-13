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
  // Default player spawn point in Royal Promenade Plaza
  spawn: {
    position: [0, 1.2, 8] as [number, number, number],
    rotation: 0,
    regionId: "royal-core",
    regionName: "Royal Promenade, Varanaya",
  },
  waterLevel: 0.0,
};

/**
 * Open, extensible registry of all geographic world regions in Varanaya.
 * Each region is a first-class citizen with its own coordinates, radius, and identity.
 */
export const WORLD_REGIONS: Record<string, RegionDefinition> = {
  royalCore: {
    id: "royal-core",
    name: "Royal Core",
    category: "TOWN",
    center: [0, 0.5, -25],
    radius: 70,
    description:
      "Ceremonial heart of Varanaya, royal sandstone promenade, and monumental sanctuary.",
    themeColor: "#f59e0b",
  },
  waterfront: {
    id: "waterfront",
    name: "Waterfront & Harbor",
    category: "COAST",
    center: [30, 1.0, 10],
    radius: 50,
    description: "Vibrant maritime quay, sacred ghat steps, spice markets, and beacon watchtower.",
    themeColor: "#0ea5e9",
  },
  palaceDistrict: {
    id: "palace-district",
    name: "Palace District",
    category: "TOWN",
    center: [-28, 0.5, -30],
    radius: 55,
    description:
      "Sandstone havelis with carved jali lattice balconies and tranquil courtyard lotus gardens.",
    themeColor: "#10b981",
  },
  westernApproach: {
    id: "western-approach",
    name: "Western Approach",
    category: "TOWN",
    center: [-60, 0.5, 0],
    radius: 65,
    description:
      "Monumental twin-bastion Grand Sea Gate and rugged coastal terrain extending inland.",
    themeColor: "#8b5cf6",
  },
  outerSanctuary: {
    id: "outer-sanctuary",
    name: "Outer Sanctuary",
    category: "COAST",
    center: [100, 1.5, 16],
    radius: 80,
    description:
      "120m ceremonial ocean causeway spanning across turquoise waves to the outer island.",
    themeColor: "#06b6d4",
  },
  northernHighlands: {
    id: "northern-highlands",
    name: "Northern Highlands",
    category: "MOUNTAIN",
    center: [0, 18.0, -220],
    radius: 180,
    description: "Elevated coastal mountain ridges and cliffs guarding the sanctuary basin.",
    themeColor: "#64748b",
  },
  southernDunes: {
    id: "southern-dunes",
    name: "Southern Palm Dunes",
    category: "COAST",
    center: [0, 0.5, 160],
    radius: 160,
    description:
      "Golden coastal dunes and tropical coconut groves along the royal southern avenue.",
    themeColor: "#16a34a",
  },
  islandAirport: {
    id: "island-airport",
    name: "Agatti Island Aerodrome",
    category: "COAST",
    center: [140, 1.2, 55],
    radius: 75,
    description: "Coastal coral airstrip, regional passenger terminal, and island hopper flights.",
    themeColor: "#0284c7",
  },
  lagoonIsland: {
    id: "lagoon-island",
    name: "Lagoon Isle",
    category: "COAST",
    center: [800, 1.2, 600],
    radius: 95,
    description:
      "Tropical island paradise with a turquoise lagoon, coral beaches, palm forest, and fishing settlement.",
    themeColor: "#06b6d4",
  },
  // Kebab-case exact id aliases
  "lagoon-island": {
    id: "lagoon-island",
    name: "Lagoon Isle",
    category: "COAST",
    center: [800, 1.2, 600],
    radius: 95,
    description:
      "Tropical island paradise with a turquoise lagoon, coral beaches, palm forest, and fishing settlement.",
    themeColor: "#06b6d4",
  },
  "island-airport": {
    id: "island-airport",
    name: "Agatti Island Aerodrome",
    category: "COAST",
    center: [140, 1.2, 55],
    radius: 75,
    description: "Coastal coral airstrip, regional passenger terminal, and island hopper flights.",
    themeColor: "#0284c7",
  },
  "royal-core": {
    id: "royal-core",
    name: "Royal Core",
    category: "TOWN",
    center: [0, 0.5, -25],
    radius: 70,
    description:
      "Ceremonial heart of Varanaya, royal sandstone promenade, and monumental sanctuary.",
    themeColor: "#f59e0b",
  },
  "palace-district": {
    id: "palace-district",
    name: "Palace District",
    category: "TOWN",
    center: [-28, 0.5, -30],
    radius: 55,
    description:
      "Sandstone havelis with carved jali lattice balconies and tranquil courtyard lotus gardens.",
    themeColor: "#10b981",
  },
  "western-approach": {
    id: "western-approach",
    name: "Western Approach",
    category: "TOWN",
    center: [-60, 0.5, 0],
    radius: 65,
    description:
      "Monumental twin-bastion Grand Sea Gate and rugged coastal terrain extending inland.",
    themeColor: "#8b5cf6",
  },
  "outer-sanctuary": {
    id: "outer-sanctuary",
    name: "Outer Sanctuary",
    category: "COAST",
    center: [100, 1.5, 16],
    radius: 80,
    description:
      "120m ceremonial ocean causeway spanning across turquoise waves to the outer island.",
    themeColor: "#06b6d4",
  },
  "northern-highlands": {
    id: "northern-highlands",
    name: "Northern Highlands",
    category: "MOUNTAIN",
    center: [0, 18.0, -220],
    radius: 180,
    description: "Elevated coastal mountain ridges and cliffs guarding the sanctuary basin.",
    themeColor: "#64748b",
  },
  "southern-dunes": {
    id: "southern-dunes",
    name: "Southern Palm Dunes",
    category: "COAST",
    center: [0, 0.5, 160],
    radius: 160,
    description:
      "Golden coastal dunes and tropical coconut groves along the royal southern avenue.",
    themeColor: "#16a34a",
  },
  // Backward compatibility aliases
  town: {
    id: "royal-core",
    name: "Royal Core",
    category: "TOWN",
    center: [0, 0.5, -25],
    radius: 70,
    description:
      "Ceremonial heart of Varanaya, royal sandstone promenade, and monumental sanctuary.",
    themeColor: "#f59e0b",
  },
  forest: {
    id: "western-approach",
    name: "Western Approach",
    category: "TOWN",
    center: [-60, 0.5, 0],
    radius: 65,
    description:
      "Monumental twin-bastion Grand Sea Gate and rugged coastal terrain extending inland.",
    themeColor: "#8b5cf6",
  },
  mountain: {
    id: "northern-highlands",
    name: "Northern Highlands",
    category: "MOUNTAIN",
    center: [0, 18.0, -220],
    radius: 180,
    description: "Elevated coastal mountain ridges and cliffs guarding the sanctuary basin.",
    themeColor: "#64748b",
  },
  city: {
    id: "palace-district",
    name: "Palace District",
    category: "TOWN",
    center: [-28, 0.5, -30],
    radius: 55,
    description:
      "Sandstone havelis with carved jali lattice balconies and tranquil courtyard lotus gardens.",
    themeColor: "#10b981",
  },
  coast: {
    id: "waterfront",
    name: "Waterfront & Harbor",
    category: "COAST",
    center: [30, 1.0, 10],
    radius: 50,
    description: "Vibrant maritime quay, sacred ghat steps, spice markets, and beacon watchtower.",
    themeColor: "#0ea5e9",
  },
  road: {
    id: "royal-core",
    name: "Royal Core",
    category: "TOWN",
    center: [0, 0.5, 0],
    radius: 40,
    description: "Connecting ceremonial avenues of Varanaya.",
    themeColor: "#f59e0b",
  },
};
