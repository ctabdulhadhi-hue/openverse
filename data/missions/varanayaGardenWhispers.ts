import type { MissionDefinition } from "@/game/missions/MissionTypes";

/**
 * Phase 10 Mission 4: "Garden of Whispers"
 * "Stories Begin in Varanaya"
 *
 * Theme: Palace Gardens / mystery with ancient stele inspection.
 * Given by Selene Voss (npc-selene) at Civic District border [22.0, 0.1, -36.0].
 *
 * Flow:
 * 1. Discover strange archaeological rumors from Selene Voss.
 * 2. Explore the Palace Gardens lotus courtyard [-12.0, 0.5, 18.0].
 * 3. Inspect ancient lotus stele inscription (stele-garden-whispers).
 * 4. Return to Selene Voss and decide archive publication versus preservation.
 */
export const VARANAYA_GARDEN_WHISPERS: MissionDefinition = {
  id: "varanaya_garden_whispers",
  title: "Garden of Whispers",
  subtitle: "Secrets of the Royal Terraces",
  description:
    "Civic Archivist Selene Voss has noted ancient floral glyphs near the Palace Gardens lotus fountain basin. Investigate the terrace garden, inspect the carved stone stele, and consult Selene on how to preserve the discovery.",
  shortDescription:
    "Explore the Palace Gardens, inspect the lotus stele, and report back to Selene Voss.",
  category: "SIDE",
  giverNpcId: "npc-selene",
  objectives: [
    {
      id: "explore_palace_gardens",
      type: "GO_TO_LOCATION",
      title: "Explore the Palace Gardens",
      description: "Travel to the terrace garden courtyard southwest of the royal promenade.",
      target: {
        position: [-12.0, 0.5, 18.0],
        radius: 8.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "inspect_lotus_stele",
      type: "INTERACT",
      title: "Inspect the ancient lotus stele",
      description:
        "Examine the weathered sandstone stele engraved with floral glyphs near the fountain.",
      target: {
        interactableId: "stele-garden-whispers",
        itemId: "stele-garden-whispers",
        position: [-12.0, 0.5, 13.5],
        radius: 4.5,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "consult_with_selene",
      type: "CHOICE",
      title: "Report findings to Selene Voss",
      description:
        "Return to Selene Voss in the Civic District and decide whether to publish the archival transcription.",
      target: {
        npcId: "npc-selene",
        position: [22.0, 0.1, -36.0],
        radius: 6.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  requires: [],
  unlocks: ["varanaya_sanctuary_scholars"],
  rewards: {
    xp: 320,
    currency: 140,
    items: [
      {
        id: "lotus_stele_rubbing",
        name: "Lotus Stele Charcoal Rubbing",
        quantity: 1,
      },
    ],
    flags: {
      varanaya_garden_whispers_complete: true,
    },
  },
  metadata: {
    district: "Palace Gardens & Civic District",
    difficulty: "Intermediate",
  },
};
