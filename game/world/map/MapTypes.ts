/**
 * Varanaya Map Types & Regional Taxonomy.
 */

export type VaranayaRegionId =
  | "ROYAL_CORE"
  | "WATERFRONT"
  | "PALACE_DISTRICT"
  | "WESTERN_APPROACH"
  | "OUTER_SANCTUARY"
  | "ISLAND_AIRPORT"
  | "LAGOON_ISLE";

export type LocationType =
  | "DISTRICT"
  | "SANCTUARY"
  | "HARBOR"
  | "MARKET"
  | "LANDMARK"
  | "GARDEN"
  | "GATE"
  | "BRIDGE"
  | "AIRPORT"
  | "VILLAGE"
  | "BEACH"
  | "VIEWPOINT";

export interface RegionMetadata {
  id: VaranayaRegionId;
  name: string;
  themeColor: string;
  accentColor: string;
  description: string;
}

export const VARANAYA_MAP_REGIONS: Record<VaranayaRegionId, RegionMetadata> = {
  ROYAL_CORE: {
    id: "ROYAL_CORE",
    name: "Royal Core",
    themeColor: "#f59e0b",
    accentColor: "rgba(245, 158, 11, 0.2)",
    description:
      "Ceremonial heart of Varanaya, royal sandstone promenade, and monumental sanctuary.",
  },
  WATERFRONT: {
    id: "WATERFRONT",
    name: "Waterfront & Harbor",
    themeColor: "#0ea5e9",
    accentColor: "rgba(14, 165, 233, 0.2)",
    description: "Vibrant maritime quay, sacred ghat steps, spice markets, and beacon watchtower.",
  },
  PALACE_DISTRICT: {
    id: "PALACE_DISTRICT",
    name: "Palace District",
    themeColor: "#10b981",
    accentColor: "rgba(16, 185, 129, 0.2)",
    description:
      "Sandstone havelis with carved jali lattice balconies and tranquil courtyard lotus gardens.",
  },
  WESTERN_APPROACH: {
    id: "WESTERN_APPROACH",
    name: "Western Approach",
    themeColor: "#8b5cf6",
    accentColor: "rgba(139, 92, 246, 0.2)",
    description: "Monumental twin-bastion Grand Sea Gate and rugged wilderness extending inland.",
  },
  OUTER_SANCTUARY: {
    id: "OUTER_SANCTUARY",
    name: "Outer Sanctuary",
    themeColor: "#06b6d4",
    accentColor: "rgba(6, 182, 212, 0.2)",
    description:
      "120m ceremonial ocean causeway spanning across turquoise waves to the outer island.",
  },
  ISLAND_AIRPORT: {
    id: "ISLAND_AIRPORT",
    name: "Agatti Island Aerodrome",
    themeColor: "#0284c7",
    accentColor: "rgba(2, 132, 199, 0.2)",
    description: "Coastal coral airstrip, passenger terminal, and regional island hopper flights.",
  },
  LAGOON_ISLE: {
    id: "LAGOON_ISLE",
    name: "Lagoon Isle",
    themeColor: "#06b6d4",
    accentColor: "rgba(6, 182, 212, 0.2)",
    description:
      "Tropical island paradise with turquoise lagoon, coral beaches, palm forest, and fishing settlement.",
  },
};

export interface WorldLocation {
  id: string;
  name: string;
  type: LocationType;
  regionId: VaranayaRegionId;
  regionName: string;
  position: [number, number, number];
  coordinates: { x: number; y: number };
  tagline: string;
  description: string;
  discovered: boolean;
  fastTravelAvailable: boolean;
  icon: string;
}

export type MapMarkerCategory =
  | "PLAYER"
  | "MAIN_MISSION"
  | "SIDE_MISSION"
  | "ACTIVITY"
  | "NPC"
  | "LANDMARK"
  | "SANCTUARY"
  | "GARDEN"
  | "SHOP"
  | "HARBOR"
  | "AIRPORT"
  | "FAST_TRAVEL"
  | "DISCOVERED"
  | "UNDISCOVERED";

export interface MapLegendItem {
  category: MapMarkerCategory;
  label: string;
  icon: string;
  color: string;
}
