import type { MissionDefinition } from "@/game/missions/MissionTypes";

/**
 * Phase 10 Mission 2: "The Missing Ledger"
 * "Stories Begin in Varanaya"
 *
 * Theme: Market Street investigation with branching resolution.
 * Given by Clara Hayes (npc-clara) at Market Street East [32.0, 0.1, 24.0].
 *
 * Flow:
 * 1. Discover missing ledger via dialogue with Clara Hayes.
 * 2. Investigate Market Street stall [25.0, 1.4, 26.0].
 * 3. Inspect market clue pouch (clue-missing-ledger).
 * 4. Question Harbor Master Samuel Drake regarding cargo registries.
 * 5. Return to Clara Hayes and make a branching resolution choice.
 */
export const VARANAYA_MISSING_LEDGER: MissionDefinition = {
  id: "varanaya_missing_ledger",
  title: "The Missing Ledger",
  subtitle: "Auditing Market Street",
  description:
    "Clara Hayes has misplaced her primary trade ledger containing seasonal merchant tariffs. Search the market stalls, question Harbor Master Samuel Drake about recent manifest deliveries, and help Clara resolve the discrepancies.",
  shortDescription:
    "Investigate the market stalls, question Samuel Drake, and help Clara recover her trade records.",
  category: "SIDE",
  giverNpcId: "npc-clara",
  objectives: [
    {
      id: "investigate_market_street",
      type: "GO_TO_LOCATION",
      title: "Investigate Market Street",
      description:
        "Search around the market stalls east of the grand promenade for trade record traces.",
      target: {
        position: [25.0, 1.4, 26.0],
        radius: 7.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "inspect_market_clue",
      type: "INTERACT",
      title: "Inspect the misplaced ledger pouch",
      description: "Examine the leather pouch tucked behind the waterfront market stall.",
      target: {
        interactableId: "clue-missing-ledger",
        itemId: "clue-missing-ledger",
        position: [25.0, 1.4, 26.0],
        radius: 4.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "question_samuel",
      type: "TALK_TO_NPC",
      title: "Question Harbor Master Samuel",
      description:
        "Speak with Samuel Drake to cross-reference cargo entries from the dock manifest.",
      target: {
        npcId: "npc-samuel",
        position: [26.0, 0.1, 16.0],
        radius: 6.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
    {
      id: "resolve_with_clara",
      type: "CHOICE",
      title: "Resolve the ledger with Clara",
      description:
        "Return to Clara Hayes at her market stall and choose how to conclude the audit.",
      target: {
        npcId: "npc-clara",
        position: [32.0, 0.1, 24.0],
        radius: 6.0,
        chunkKey: "0,0",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  requires: [],
  unlocks: ["varanaya_merchants_trust"],
  rewards: {
    xp: 300,
    currency: 150,
    items: [
      {
        id: "merchant_ledger_copy",
        name: "Audited Ledger Copy",
        quantity: 1,
      },
    ],
    flags: {
      varanaya_missing_ledger_complete: true,
    },
  },
  metadata: {
    district: "Market Street East",
    difficulty: "Intermediate",
  },
};
