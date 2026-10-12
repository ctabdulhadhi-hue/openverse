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
    name: "Royal Sun Pavilion & Clock Tower Sundial",
    regionId: "royal-core",
    position: [0, 0, 0],
    description:
      "Historic ceremonial sundial and sandstone pavilion at the heart of the Royal Promenade.",
    icon: "🏛",
  },
  {
    id: "varanaya_grand_sanctuary",
    name: "Grand Central Sanctuary of Varanaya",
    regionId: "royal-core",
    position: [0, 0, -68],
    description:
      "Colossal 62-meter stepped Shikhara spire and ceremonial mandapa dominating the horizon.",
    icon: "🛕",
  },
  {
    id: "varanaya_sea_gate",
    name: "Grand Sea Gate",
    regionId: "western-approach",
    position: [-26, 0, 2],
    description: "Monumental arched gateway and twin bastion towers guarding the western approach.",
    icon: "🚪",
  },
  {
    id: "varanaya_grand_bridge",
    name: "Grand Causeway Bridge",
    regionId: "outer-sanctuary",
    position: [44, 0, 16],
    description:
      "120-meter ceremonial ocean causeway spanning across the turquoise waters to the outer island.",
    icon: "🌉",
  },
  {
    id: "varanaya_waterfront_harbor",
    name: "Royal Waterfront Harbor & Ghats",
    regionId: "waterfront",
    position: [28, 0, 4],
    description: "Maritime esplanade with sacred ghat steps, mooring piers, and sailing dhows.",
    icon: "⛵",
  },
  {
    id: "varanaya_spice_market",
    name: "Harbor & Spice Market",
    regionId: "waterfront",
    position: [26, 0.1, 14],
    description:
      "Vibrant market stalls draped in saffron canopies offering fragrant spices and trade cargo.",
    icon: "🏺",
  },
  {
    id: "varanaya_watchtower",
    name: "Harbor Watchtower Beacon",
    regionId: "waterfront",
    position: [40, 1.4, 25],
    description: "Tall stone lookout tower guiding sailing dhows through the bay entrance.",
    icon: "🗼",
  },
  {
    id: "varanaya_palace_gardens",
    name: "Royal Palace Gardens",
    regionId: "palace-district",
    position: [-12, 0, 18],
    description:
      "Lush courtyard terrace featuring lotus fountains, peacocks, and flowering marigolds.",
    icon: "🪷",
  },
  {
    id: "varanaya_outer_island",
    name: "Outer Island Sanctuary",
    regionId: "outer-sanctuary",
    position: [156, 2.2, 16],
    description: "Isolated sacred islet with a marble chhatri pavilion overlooking the open ocean.",
    icon: "🏝",
  },
  {
    id: "ancient_canopy_tree",
    name: "Ancient Hollow Cedar",
    regionId: "forest",
    position: [-280, 0, -380],
    description:
      "Centuries-old colossal cedar with a hollow trunk standing secluded in the forest clearing.",
    icon: "🌲",
  },
  {
    id: "mountain_overlook",
    name: "Mount Aethel Overlook",
    regionId: "mountain",
    position: [0, 0, -720],
    description:
      "Panoramic timber observation deck positioned at the sheer precipice of Mount Aethel.",
    icon: "⛰",
  },
  {
    id: "central_citadel",
    name: "Grand Citadel Spire",
    regionId: "city",
    position: [380, 0, -420],
    description: "Towering civic citadel and central obelisk overlooking the northern territory.",
    icon: "🏙",
  },
  {
    id: "coastal_lighthouse",
    name: "Azure Point Lighthouse",
    regionId: "coast",
    position: [460, 0, 80],
    description: "Historic coastal lighthouse standing guard over the eastern maritime approaches.",
    icon: "🏮",
  },
];
