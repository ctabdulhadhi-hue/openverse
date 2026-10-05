export type ItemCategory = "ITEMS" | "TOOLS" | "CONSUMABLES" | "COLLECTIBLES" | "SPECIAL";
export type ItemRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  description: string;
  quantity: number;
  image?: string;
  iconName?: string;
}

export const ITEMS: ItemDefinition[] = [
  {
    id: "camera",
    name: "Camera",
    category: "ITEMS",
    rarity: "COMMON",
    description: "A basic camera for capturing memorable moments in your journey.",
    quantity: 1,
    image: "/images/item_camera.jpg",
  },
  {
    id: "notebook",
    name: "Field Notebook",
    category: "ITEMS",
    rarity: "COMMON",
    description:
      "A durable bound journal documenting regional lore, flora sketches, and traveler observations.",
    quantity: 1,
  },
  {
    id: "traveler-satchel",
    name: "Canvas Pack",
    category: "ITEMS",
    rarity: "UNCOMMON",
    description: "Reinforced canvas backpack with utility carabiners and weather-resistant lining.",
    quantity: 1,
  },
  {
    id: "spring-water",
    name: "Spring Water",
    category: "CONSUMABLES",
    rarity: "COMMON",
    description:
      "Pure bottled mountain spring water. Refreshing and restorative after strenuous trail climbs.",
    quantity: 3,
  },
  {
    id: "flashlight",
    name: "Utility Torch",
    category: "TOOLS",
    rarity: "UNCOMMON",
    description:
      "Sturdy brushed-aluminum tactical flashlight with broad floodlight and focused beam modes.",
    quantity: 1,
  },
  {
    id: "ancient-key",
    name: "Mystery Key",
    category: "SPECIAL",
    rarity: "RARE",
    description: "A heavy hand-forged iron skeleton key bearing an unfamiliar celestial crest.",
    quantity: 1,
  },
  {
    id: "brass-compass",
    name: "Surveyor Compass",
    category: "TOOLS",
    rarity: "COMMON",
    description: "Damped magnetic compass with sapphire bearing and luminescent dial markings.",
    quantity: 1,
  },
  {
    id: "portable-radio",
    name: "Band Receiver",
    category: "TOOLS",
    rarity: "UNCOMMON",
    description: "Compact shortwave receiver capable of picking up coastal beacon frequencies.",
    quantity: 1,
  },
  {
    id: "puzzle-box",
    name: "Carved Casket",
    category: "COLLECTIBLES",
    rarity: "RARE",
    description:
      "An intricately carved cedar keepsake box from the old town archive. Its lock seems delicate.",
    quantity: 1,
  },
];
