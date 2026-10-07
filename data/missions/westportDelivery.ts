import type { MissionDefinition } from "@/game/missions/MissionTypes";

/**
 * First playable mission for OPENVERSE: "A Small Favor"
 *
 * Given by Maya Lin in Central Plaza.
 * Flow:
 * 1. Player accepts mission via dialogue with Maya.
 * 2. Player travels west to Westport Outpost (REACH objective at [-16, 0.5, 0]).
 * 3. Objective updates to Return to Maya Lin (TALK objective).
 * 4. Player returns to Maya, completes dialogue, receives XP & flags.
 */
export const WESTPORT_FIRST_DELIVERY: MissionDefinition = {
  id: "westport_first_delivery",
  title: "A Small Favor",
  subtitle: "Deliver supplies to the Western Outpost",
  description:
    "Maya Lin needs an architect's surveying toolkit delivered to the outpost stationed on the western perimeter of Westport.",
  shortDescription: "Deliver the surveying package to the western outpost and check in with Maya.",
  category: "SIDE",
  giverNpcId: "npc-maya",
  objectives: [
    {
      id: "reach_outpost",
      type: "REACH",
      title: "Reach Westport Outpost",
      description: "Travel west along the cobblestone path toward the perimeter outpost archway.",
      target: {
        position: [-16, 0.5, 0],
        radius: 6.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "return_to_maya",
      type: "TALK",
      title: "Return to Maya Lin",
      description: "Report back to Maya Lin in the Central Plaza with confirmation of delivery.",
      target: {
        npcId: "npc-maya",
        position: [-1.5, 0.1, 6.5],
        radius: 5.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  rewards: {
    xp: 150,
    currency: 75,
    flags: {
      westport_delivery_complete: true,
    },
  },
  metadata: {
    locationName: "Westport Plaza & Outpost",
    difficulty: "Easy",
  },
};
