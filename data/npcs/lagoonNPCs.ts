import type { NPCDefinition, NPCSpawnZone } from "@/game/npcs/NPCData";
import { LAGOON_ISLE_COORDINATES } from "@/game/world/island/lagoonIslandData";

/**
 * Lagoon Isle Spawn Zones.
 */
export const LAGOON_SPAWN_ZONES: NPCSpawnZone[] = [
  {
    id: "zone-lagoon-arrival",
    name: "Lagoon Arrival Zone",
    center: LAGOON_ISLE_COORDINATES.arrival.global,
    radius: 10,
    allowedTypes: ["TRAVELER", "CIVILIAN"],
  },
  {
    id: "zone-lagoon-harbor",
    name: "Fisherman's Harbor Zone",
    center: LAGOON_ISLE_COORDINATES.harbor.global,
    radius: 8,
    allowedTypes: ["WORKER", "CIVILIAN"],
  },
  {
    id: "zone-lagoon-viewpoint",
    name: "Emerald Ridge Summit Zone",
    center: LAGOON_ISLE_COORDINATES.viewpoint.global,
    radius: 6,
    allowedTypes: ["CIVILIAN", "TRAVELER"],
  },
];

/**
 * Lagoon Isle NPCs.
 */
export const LAGOON_ISLE_NPCS: NPCDefinition[] = [
  {
    id: "npc-lagoon-maya",
    type: "TRAVELER",
    name: "Maya",
    title: "Island Guide",
    spawnZoneId: "zone-lagoon-arrival",
    basePosition: [804.0, 0.45, 598.0],
    baseRotation: Math.PI * 0.9,
    behavior: "IDLE",
    walkSpeed: 1.2,
    seed: 201,
    dialogueText:
      "Welcome to Lagoon Isle! The turquoise waters and white beaches have welcomed travelers for generations.",
    chunkKey: "4,3",
    appearance: {
      shirtColor: "#06b6d4",
      pantsColor: "#f8fafc",
      shoesColor: "#78350f",
      skinColor: "#d4a373",
      hairColor: "#1c1917",
      hasHat: true,
      hatColor: "#fef3c7",
      hasBackpack: false,
      heightScale: 1.0,
      widthScale: 0.98,
    },
  },
  {
    id: "npc-lagoon-kaelen",
    type: "WORKER",
    name: "Kaelen",
    title: "Harbor Fisherman",
    spawnZoneId: "zone-lagoon-harbor",
    basePosition: [820.0, 0.8, 638.0],
    baseRotation: -0.4,
    behavior: "IDLE",
    walkSpeed: 1.2,
    seed: 202,
    dialogueText:
      "The coral reef provides for all of us. If you're heading toward the beach, look out for my lost drift crate!",
    chunkKey: "4,3",
    appearance: {
      shirtColor: "#0284c7",
      pantsColor: "#334155",
      shoesColor: "#1e293b",
      skinColor: "#b45309",
      hairColor: "#292524",
      hasHat: false,
      hasBackpack: true,
      backpackColor: "#78350f",
      heightScale: 1.06,
      widthScale: 1.04,
    },
  },
  {
    id: "npc-lagoon-taran",
    type: "CIVILIAN",
    name: "Taran",
    title: "Viewpoint Caretaker",
    spawnZoneId: "zone-lagoon-viewpoint",
    basePosition: [848.5, 6.2, 633.0],
    baseRotation: Math.PI * 0.7,
    behavior: "IDLE",
    walkSpeed: 1.1,
    seed: 203,
    dialogueText:
      "Emerald Ridge offers the finest panoramic survey of the turquoise lagoon and outer barrier reefs.",
    chunkKey: "4,3",
    appearance: {
      shirtColor: "#eab308",
      pantsColor: "#4b5563",
      shoesColor: "#1c1917",
      skinColor: "#e0ac69",
      hairColor: "#57534e",
      hasHat: true,
      hatColor: "#ea580c",
      hasBackpack: false,
      heightScale: 1.02,
      widthScale: 0.96,
    },
  },
];
