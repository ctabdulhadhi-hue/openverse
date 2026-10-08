import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

export const CLARA_DIALOGUE: DialogueConversation = {
  id: "conversation-westport-clara",
  npcId: "npc-clara",
  title: "Clara Hayes — Market Merchant",
  startNodeId: "node_greeting",
  nodes: {
    node_greeting: {
      id: "node_greeting",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Welcome to Market Street! Fresh coastal provisions, dried trail fruits, and mountain gear. What brings you to my stall today?",
      type: "TEXT",
      choices: [
        {
          id: "choice_clara_resolve_ledger",
          text: "I found your ledger pouch and cross-referenced Samuel's manifests.",
          nextNodeId: "node_clara_resolve_ledger",
          conditions: [
            {
              type: "missionActive",
              missionId: "varanaya_missing_ledger",
            },
          ],
        },
        {
          id: "choice_clara_offer_ledger",
          text: "You seem troubled, Clara. Is everything alright with your trade records?",
          nextNodeId: "node_clara_offer_ledger",
          conditions: [
            {
              type: "missionAvailable",
              missionId: "varanaya_missing_ledger",
            },
          ],
        },
        {
          id: "choice_clara_post_ledger",
          text: "How have the market records been since the audit?",
          nextNodeId: "node_clara_post_ledger",
          conditions: [
            {
              type: "missionCompleted",
              missionId: "varanaya_missing_ledger",
            },
          ],
        },
        {
          id: "choice_market_goods",
          text: "What can I find in the market?",
          nextNodeId: "node_market_goods",
        },
        {
          id: "choice_traveler_destinations",
          text: "Where do travelers usually head from here?",
          nextNodeId: "node_traveler_destinations",
        },
        {
          id: "choice_town_rumors",
          text: "What's happening around town lately?",
          nextNodeId: "node_town_rumors",
        },
        {
          id: "choice_browse_clara",
          text: "Just browsing the stalls for now.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_clara_offer_ledger: {
      id: "node_clara_offer_ledger",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "My primary trade ledger has vanished from the counter! Without it, I cannot calculate seasonal dock tariffs or balance payments with the guild. Would you help me investigate the stalls and verify dock entries with Samuel Drake?",
      type: "TEXT",
      choices: [
        {
          id: "choice_accept_missing_ledger",
          text: "I'll search Market Street and question Samuel Drake for you.",
          nextNodeId: "node_accept_ledger",
          effects: [{ type: "startMission", missionId: "varanaya_missing_ledger" }],
        },
        {
          id: "choice_decline_missing_ledger",
          text: "I cannot take this on right now, Clara.",
          nextNodeId: "node_decline_ledger",
          effects: [{ type: "declineMission", missionId: "varanaya_missing_ledger" }],
        },
      ],
    },

    node_accept_ledger: {
      id: "node_accept_ledger",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Bless you! Check the lower stall counters eastward, then question Harbor Master Samuel Drake down by the waterfront. His cargo logs should clarify what was delivered.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_decline_ledger: {
      id: "node_decline_ledger",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "I understand. I will keep checking the counters myself. If you find time later, please come by.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_clara_resolve_ledger: {
      id: "node_clara_resolve_ledger",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "You found the ledger! And looking at Samuel's manifests, it seems an apprentice scribe made duplicate tax entries. How do you advise we handle this?",
      type: "TEXT",
      choices: [
        {
          id: "choice_guild_report",
          text: "Report the errant apprentice formally to the Merchant Guild.",
          nextNodeId: "node_resolve_guild",
          effects: [
            { type: "setFlag", flagKey: "clara_choice_guild_report", value: true },
            { type: "completeMission", missionId: "varanaya_missing_ledger" },
          ],
        },
        {
          id: "choice_discreet_settle",
          text: "Settle the tariffs discreetly to keep peace in the market.",
          nextNodeId: "node_resolve_discreet",
          effects: [
            { type: "setFlag", flagKey: "clara_choice_discreet_settle", value: true },
            { type: "completeMission", missionId: "varanaya_missing_ledger" },
          ],
        },
      ],
    },

    node_resolve_guild: {
      id: "node_resolve_guild",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Transparency is paramount for merchant trust. I will file the formal guild report. Thank you for your diligence and honesty!",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_resolve_discreet: {
      id: "node_resolve_discreet",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "A merciful choice. We can correct the numbers without ruining the apprentice's career. Here is your reward for your discretion and effort.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_clara_post_ledger: {
      id: "node_clara_post_ledger",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Trade is moving smoothly again, thanks to your investigation. The market stalls are operating with full confidence!",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_market_goods: {
      id: "node_market_goods",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "We trade in hearty trail rations, canvas tarps for highland rain, and salt-preserved fish from the eastern docks. When caravans from Central City arrive, we get exotic spices too.",
      type: "TEXT",
      choices: [
        {
          id: "choice_rations_advice",
          text: "Any recommendations for long-distance exploration?",
          nextNodeId: "node_rations_advice",
        },
        {
          id: "choice_back_to_questions",
          text: "Understood. Let me ask about something else.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_rations_advice: {
      id: "node_rations_advice",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Always pack more water and salt rations than you anticipate needing. If you get caught in high pine mist or mountain passes, you'll be glad you did.",
      type: "TEXT",
      effects: [{ type: "setFlag", flagKey: "heard_merchant_advice", value: true }],
      nextNodeId: "node_farewell",
    },

    node_traveler_destinations: {
      id: "node_traveler_destinations",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Most head North past the Great Clock Tower into Pine Crest Forest. Hardier adventurers continue all the way to Mount Aethel's foothill passes.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_town_rumors: {
      id: "node_town_rumors",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "Samuel Drake down at the loading bays says coastal fog held up the freight convoys. Maya Lin has also been reviewing architectural surveys for the northern road expansion.",
      type: "TEXT",
      effects: [{ type: "setFlag", flagKey: "asked_about_town", value: true }],
      nextNodeId: "node_farewell",
    },

    node_farewell: {
      id: "node_farewell",
      speaker: "Clara Hayes",
      speakerRole: "Market Merchant",
      text: "May the sea winds favor your journey, explorer. Come back anytime!",
      type: "END",
    },
  },
};
