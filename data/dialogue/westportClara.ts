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
