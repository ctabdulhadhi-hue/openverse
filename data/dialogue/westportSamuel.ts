import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

export const SAMUEL_DIALOGUE: DialogueConversation = {
  id: "conversation-westport-samuel",
  npcId: "npc-samuel",
  title: "Samuel Drake — Supply & Trade",
  startNodeId: "node_greeting",
  nodes: {
    node_greeting: {
      id: "node_greeting",
      speaker: "Samuel Drake",
      speakerRole: "Logistics Master",
      text: "Watch your step around these cargo skids! Supply convoys from Central City are backed up across the highway.",
      type: "TEXT",
      choices: [
        {
          id: "choice_samuel_mission_shipment",
          text: "Maya Lin sent me regarding the royal surveying shipment.",
          nextNodeId: "node_samuel_mission_shipment",
          conditions: [
            {
              type: "missionActive",
              missionId: "varanaya_small_favor",
            },
          ],
        },
        {
          id: "choice_cargo_trouble",
          text: "What's causing the shipping delay?",
          nextNodeId: "node_delays",
        },
        {
          id: "choice_work_samuel",
          text: "Maya said you might have work for an able explorer.",
          nextNodeId: "node_work_offer",
        },
        {
          id: "choice_passing_samuel",
          text: "I'll let you get back to your inventory.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_samuel_mission_shipment: {
      id: "node_samuel_mission_shipment",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Ah, Maya's surveying shipment from the coastal dhow! I set the crate over by the market stall near the waterfront steps. Go ahead and collect it—it's marked and ready for her.",
      type: "TEXT",
      effects: [
        {
          type: "completeObjective",
          missionId: "varanaya_small_favor",
          objectiveId: "speak_harbor_master",
        },
        { type: "setFlag", flagKey: "spoke_to_harbor_master", value: true },
      ],
      nextNodeId: "node_farewell",
    },

    node_delays: {
      id: "node_delays",
      speaker: "Samuel Drake",
      speakerRole: "Logistics Master",
      text: "Dense coastal fog rolled through the eastern gap yesterday. Drivers had to drop to crawler speeds to avoid the rocky drops.",
      type: "TEXT",
      choices: [
        {
          id: "choice_clear_fog",
          text: "Is the road safe to travel on foot?",
          nextNodeId: "node_road_safety",
        },
        {
          id: "choice_good_to_know",
          text: "Good to know. Thanks for the heads up.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_road_safety: {
      id: "node_road_safety",
      speaker: "Samuel Drake",
      speakerRole: "Logistics Master",
      text: "On foot? Sure, as long as you stick to the pavement curbstones. Just don't wander off the shoulders near the marshland.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_work_offer: {
      id: "node_work_offer",
      speaker: "Samuel Drake",
      speakerRole: "Logistics Master",
      text: "Did she now? Well, once the next heavy freight arrives, I'll need couriers to run manifests to the Civic District. Check back soon.",
      type: "TEXT",
      effects: [{ type: "setFlag", flagKey: "met_samuel", value: true }],
      nextNodeId: "node_farewell",
    },

    node_farewell: {
      id: "node_farewell",
      speaker: "Samuel Drake",
      speakerRole: "Logistics Master",
      text: "Keep clear of the loading cranes and watch your back out on the road.",
      type: "END",
    },
  },
};
