import type { MissionDefinition } from "@/game/missions/MissionTypes";

/**
 * Phase 10 Mission 3: "Harbor Lights"
 * "Stories Begin in Varanaya"
 *
 * Theme: Waterfront / harbor navigation lanterns with fuel priority choice.
 * Given by Harbor Master Samuel Drake (npc-samuel) at [26.0, 0.1, 16.0].
 *
 * Flow:
 * 1. Discover harbor lighting problem via dialogue with Samuel Drake.
 * 2. Inspect Waterfront Beacon Pier [34.0, 1.4, -22.0].
 * 3. Interact with the harbor beacon lantern mechanism (beacon-harbor-light).
 * 4. Return to Samuel Drake and make a resource allocation choice.
 */
export const VARANAYA_HARBOR_LIGHTS: MissionDefinition = {
  id: "varanaya_harbor_lights",
  title: "Harbor Lights",
  subtitle: "Guiding Coastal Dhows",
  description:
    "Dense coastal fog is threatening inbound dhows at the Grand Sea Gate. Inspect the waterfront beacon lantern on the northern pier, verify its ignition mechanism, and confer with Harbor Master Samuel on harbor fuel priorities.",
  shortDescription:
    "Inspect the waterfront beacon pier, check the mechanism, and consult with Samuel Drake.",
  category: "SIDE",
  giverNpcId: "npc-samuel",
  objectives: [
    {
      id: "inspect_waterfront_pier",
      type: "GO_TO_LOCATION",
      title: "Inspect the Waterfront Beacon Pier",
      description: "Travel to the northern harbor pier near the watchtower beacon.",
      target: {
        position: [34.0, 1.4, -22.0],
        radius: 8.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "examine_beacon_lantern",
      type: "INTERACT",
      title: "Examine the harbor beacon lantern",
      description: "Inspect the brass lantern housing and lens mechanism at the pier beacon.",
      target: {
        interactableId: "beacon-harbor-light",
        itemId: "beacon-harbor-light",
        position: [34.0, 1.4, -22.0],
        radius: 4.5,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "report_beacon_to_samuel",
      type: "CHOICE",
      title: "Decide fuel allocation with Samuel",
      description:
        "Return to Harbor Master Samuel Drake and choose your recommendation for lantern fuel distribution.",
      target: {
        npcId: "npc-samuel",
        position: [26.0, 0.1, 16.0],
        radius: 6.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  requires: [],
  unlocks: ["varanaya_coastal_navigator"],
  rewards: {
    xp: 275,
    currency: 120,
    items: [
      {
        id: "harbor_lantern_oil",
        name: "Purified Lantern Oil",
        quantity: 1,
      },
    ],
    flags: {
      varanaya_harbor_lights_complete: true,
    },
  },
  metadata: {
    district: "Royal Waterfront Harbor",
    difficulty: "Novice",
  },
};
