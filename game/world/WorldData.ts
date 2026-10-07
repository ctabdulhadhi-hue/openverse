export interface LandmarkDefinition {
  id: string;
  name: string;
  regionId: string;
  position: [number, number, number];
  description: string;
  icon: string;
}

export const WORLD_LANDMARKS: LandmarkDefinition[] = [
  {
    id: "town_clock_tower",
    name: "Westport Clock Tower & Varanaya Grand Sanctuary",
    regionId: "town",
    position: [0, 0, 0],
    description: "Historic ceremonial pavilion and monumental sanctuary at the heart of Varanaya.",
    icon: "🏛",
  },
  {
    id: "varanaya_grand_sanctuary",
    name: "Grand Central Sanctuary of Varanaya",
    regionId: "town",
    position: [0, 0, -68],
    description:
      "Colossal 62-meter stepped Shikhara spire and ceremonial mandapa dominating the horizon.",
    icon: "🛕",
  },
  {
    id: "varanaya_sea_gate",
    name: "Grand Sea Gate",
    regionId: "town",
    position: [-26, 0, 2],
    description: "Monumental arched gateway and twin bastion towers guarding the royal esplanade.",
    icon: "🚪",
  },
  {
    id: "varanaya_grand_bridge",
    name: "Grand Causeway Bridge",
    regionId: "town",
    position: [44, 0, 16],
    description:
      "120-meter ceremonial ocean causeway spanning across the turquoise waters to the outer island.",
    icon: "🌉",
  },
  {
    id: "varanaya_waterfront_harbor",
    name: "Royal Waterfront Harbor & Ghats",
    regionId: "town",
    position: [28, 0, 4],
    description: "Maritime esplanade with sacred ghat steps, mooring piers, and sailing dhows.",
    icon: "⛵",
  },
  {
    id: "ancient_canopy_tree",
    name: "Ancient Hollow Cedar",
    regionId: "forest",
    position: [-280, 5, -380],
    description: "Centuries-old sentinel tree marking the heart of Pine Crest Forest.",
    icon: "🌲",
  },
  {
    id: "mountain_overlook",
    name: "Mount Aethel Overlook",
    regionId: "mountain",
    position: [0, 36, -720],
    description: "High elevation observation platform overlooking the valleys below.",
    icon: "⛰",
  },
  {
    id: "central_citadel",
    name: "Central Spire Tower",
    regionId: "city",
    position: [380, 0, -420],
    description: "Monumental architectural spire and civic plaza of Central City.",
    icon: "🏙",
  },
  {
    id: "coastal_lighthouse",
    name: "Azure Point Lighthouse",
    regionId: "coast",
    position: [460, 0, 80],
    description: "Guiding maritime beacon and wooden pier at the edge of the open sea.",
    icon: "⚓",
  },
];
