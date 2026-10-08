import type { MissionDefinition } from "@/game/missions/MissionTypes";

/**
 * Phase 9 First Playable Mission: "A Small Favor"
 * "Stories Begin in Varanaya"
 *
 * Given by Maya Lin on the Royal Promenade Plaza.
 * Flow:
 * 1. Player accepts mission via dialogue with Maya.
 * 2. Player physically travels to Royal Waterfront (GO_TO_LOCATION at [26, 1.4, 4]).
 * 3. Player speaks with Harbor Master Samuel Drake (TALK_TO_NPC at [26, 0.1, 16]).
 * 4. Player collects the surveying shipment crate at the market stall (COLLECT at [25.5, 1.4, 10]).
 * 5. Player returns to Maya on the Royal Promenade (GO_TO_LOCATION / TALK at [-1.5, 0.1, 6.5]).
 * 6. Player concludes dialogue with Maya with dialogue choice and receives rewards.
 */
export const VARANAYA_SMALL_FAVOR: MissionDefinition = {
  id: "varanaya_small_favor",
  title: "A Small Favor",
  subtitle: "Supplies from the Royal Waterfront",
  description:
    "Maya Lin needs an architect's surveying shipment from the Royal Waterfront Harbor. Travel to the waterfront, speak with Harbor Master Samuel, collect the shipment crate from the market stall, and return to Maya.",
  shortDescription:
    "Visit the waterfront, speak with Harbor Master Samuel, collect the shipment, and return to Maya.",
  category: "SIDE",
  giverNpcId: "npc-maya",
  objectives: [
    {
      id: "visit_waterfront",
      type: "GO_TO_LOCATION",
      title: "Visit the Royal Waterfront",
      description: "Travel east down from the Royal Promenade to the Royal Waterfront quay.",
      target: {
        position: [26, 1.4, 4],
        radius: 8.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "speak_harbor_master",
      type: "TALK_TO_NPC",
      title: "Speak with the Harbor Master",
      description: "Locate Harbor Master Samuel Drake stationed near the waterfront docks.",
      target: {
        npcId: "npc-samuel",
        position: [26.0, 0.1, 16.0],
        radius: 6.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "collect_shipment",
      type: "COLLECT",
      title: "Collect the requested item",
      description: "Retrieve the surveying shipment crate from the waterfront market stall.",
      target: {
        interactableId: "crate-waterfront-supplies",
        itemId: "crate-waterfront-supplies",
        position: [25.5, 1.4, 10.0],
        radius: 4.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "return_to_maya",
      type: "GO_TO_LOCATION",
      title: "Return to Maya",
      description: "Head back to the Royal Promenade Plaza and report to Maya Lin.",
      target: {
        npcId: "npc-maya",
        position: [-1.5, 0.1, 6.5],
        radius: 5.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "conclude_favor",
      type: "CHOICE",
      title: "Deliver the supplies to Maya",
      description: "Speak with Maya to hand over the supplies and conclude your report.",
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
    xp: 250,
    currency: 100,
    items: [
      {
        id: "architect_survey_map",
        name: "Architect's Survey Map",
        quantity: 1,
      },
    ],
    flags: {
      varanaya_small_favor_complete: true,
      westport_delivery_complete: true,
    },
  },
  metadata: {
    locationName: "Royal Promenade & Royal Waterfront",
    difficulty: "Novice",
  },
};
