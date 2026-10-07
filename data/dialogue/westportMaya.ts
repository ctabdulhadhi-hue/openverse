import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

export const MAYA_DIALOGUE: DialogueConversation = {
  id: "conversation-westport-maya",
  npcId: "npc-maya",
  title: "Maya Lin — Westport Development",
  startNodeId: "node_greeting",
  nodes: {
    node_greeting: {
      id: "node_greeting",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "You're new to Westport, aren't you? The road dust hasn't even settled on your boots.",
      type: "TEXT",
      choices: [
        {
          id: "choice_exploring",
          text: "I'm exploring the frontier.",
          nextNodeId: "node_exploring",
          effects: [{ type: "setFlag", flagKey: "heard_about_north_road", value: true }],
        },
        {
          id: "choice_work",
          text: "I'm looking for work around here.",
          nextNodeId: "node_work",
          effects: [{ type: "setFlag", flagKey: "asked_about_work", value: true }],
        },
        {
          id: "choice_passing_through",
          text: "Just passing through.",
          nextNodeId: "node_passing_through",
        },
      ],
    },

    node_exploring: {
      id: "node_exploring",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Then keep your eyes open. Westport is only the gateway. To the North lies Pine Crest Forest and Mount Aethel. Follow the eastern highway, and you'll reach the ocean cliffs.",
      type: "TEXT",
      choices: [
        {
          id: "choice_north_road",
          text: "How do I reach the northern road?",
          nextNodeId: "node_north_road",
        },
        {
          id: "choice_plaza_inlay",
          text: "Tell me about this compass inlay in the plaza floor.",
          nextNodeId: "node_plaza_inlay",
        },
      ],
    },

    node_north_road: {
      id: "node_north_road",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Head North past the historic Great Clock Tower and follow the cobblestone road. Keep your bearings; the pine ridges can be disorienting in mist.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_plaza_inlay: {
      id: "node_plaza_inlay",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "I drafted the blueprints for that azure ring myself. It points toward true open-world coordinates. No matter how far you wander, it guides you back home.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_work: {
      id: "node_work",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Check with Samuel Drake down along Market Street. He's managing convoy cargo from Central City and always needs capable hands.",
      type: "TEXT",
      choices: [
        {
          id: "choice_where_samuel",
          text: "Where can I find Samuel?",
          nextNodeId: "node_where_samuel",
        },
        {
          id: "choice_thanks_work",
          text: "Thanks, I'll head over there now.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_where_samuel: {
      id: "node_where_samuel",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Head East toward the market stalls. You can't miss him—he's usually wearing a high-visibility work vest and clipboard.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_passing_through: {
      id: "node_passing_through",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Fair enough. Enjoy the crisp sea breeze while you rest. The wild continent beyond town won't be as gentle.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_farewell: {
      id: "node_farewell",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Safe travels across OPENVERSE. Check the bulletin kiosk if you need local news.",
      type: "END",
    },
  },
};
