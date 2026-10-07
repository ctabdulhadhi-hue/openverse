import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

export const ELIAS_DIALOGUE: DialogueConversation = {
  id: "conversation-westport-elias",
  npcId: "npc-elias",
  title: "Elias Vance — Clocktower Lore",
  startNodeId: "node_greeting",
  nodes: {
    node_greeting: {
      id: "node_greeting",
      speaker: "Elias Vance",
      speakerRole: "Clocktower Historian",
      text: "Listen closely... The Great Clock Tower chimes on the hour, synchronized to the ocean tides. Have you come to hear its history?",
      type: "TEXT",
      choices: [
        {
          id: "choice_clocktower_age",
          text: "How old is this clocktower?",
          nextNodeId: "node_history",
        },
        {
          id: "choice_mountain_lore",
          text: "What lies beyond the northern ridge?",
          nextNodeId: "node_mountain",
        },
        {
          id: "choice_leave_elias",
          text: "Just admiring the stone masonry.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_history: {
      id: "node_history",
      speaker: "Elias Vance",
      speakerRole: "Clocktower Historian",
      text: "It was the very first stone monument raised when pioneers reached Westport Harbor. Its gear mechanism has never failed once.",
      type: "TEXT",
      choices: [
        {
          id: "choice_who_built_it",
          text: "Who engineered the gears?",
          nextNodeId: "node_gears",
        },
        {
          id: "choice_thats_impressive",
          text: "That is impressive engineering.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_gears: {
      id: "node_gears",
      speaker: "Elias Vance",
      speakerRole: "Clocktower Historian",
      text: "Master artisans from Central City. They carved the escapement from solid cliff stone to resist salt weathering.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_mountain: {
      id: "node_mountain",
      speaker: "Elias Vance",
      speakerRole: "Clocktower Historian",
      text: "Mount Aethel stands watch over the continent. Its summit is crowned with eternal snow, and ancient ruins lie nestled among the pines.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_farewell: {
      id: "node_farewell",
      speaker: "Elias Vance",
      speakerRole: "Clocktower Historian",
      text: "May your journey be as steadfast as our tower, explorer.",
      type: "END",
    },
  },
};
