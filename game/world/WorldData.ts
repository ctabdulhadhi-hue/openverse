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
    name: "Westport Clock Tower",
    regionId: "town",
    position: [0, 0, 0],
    description: "Historic stone clock tower in the center of Westport Town Square.",
    icon: "🏛",
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
