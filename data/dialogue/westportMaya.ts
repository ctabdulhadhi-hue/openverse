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
          id: "choice_mission_turnin_varanaya",
          text: "I made it back from the Royal Waterfront with the surveying shipment.",
          nextNodeId: "node_mission_turnin",
          conditions: [
            {
              type: "objectiveCompleted",
              missionId: "varanaya_small_favor",
              objectiveId: "collect_shipment",
            },
          ],
        },
        {
          id: "choice_mission_turnin",
          text: "I made it to the Westport Outpost—the western route is clear.",
          nextNodeId: "node_mission_turnin",
          conditions: [
            {
              type: "objectiveCompleted",
              missionId: "westport_first_delivery",
              objectiveId: "reach_outpost",
            },
          ],
        },
        {
          id: "choice_mission_reminder",
          text: "Could you remind me where I need to go for the shipment?",
          nextNodeId: "node_mission_reminder",
          conditions: [
            {
              type: "missionActive",
              missionId: "varanaya_small_favor",
            },
          ],
        },
        {
          id: "choice_maya_sanctuary_discovery",
          text: "I entered the sacred Garbhagriha inner sanctum of the Grand Sanctuary.",
          nextNodeId: "node_maya_sanctuary_discovery",
          conditions: [
            {
              type: "locationDiscovered",
              locationId: "grand-sanctuary",
            },
          ],
        },
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
        {
          id: "choice_mission_offer",
          text: "Could you use a hand with any projects around town?",
          nextNodeId: "node_mission_offer",
          conditions: [
            {
              type: "missionAvailable",
              missionId: "varanaya_small_favor",
            },
          ],
        },
        {
          id: "choice_mission_aftermath",
          text: "How are things holding up at the western outpost?",
          nextNodeId: "node_mission_aftermath",
          conditions: [
            {
              type: "missionCompleted",
              missionId: "varanaya_small_favor",
            },
          ],
        },
      ],
    },

    node_mission_offer: {
      id: "node_mission_offer",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Could you help me with a small favor? The master builder urgently needs an updated set of perimeter surveying blueprints and supplies from the Royal Waterfront.",
      type: "TEXT",
      choices: [
        {
          id: "choice_accept_favor",
          text: "Sure, what do you need? I'll deliver them right away.",
          nextNodeId: "node_mission_accepted",
          effects: [{ type: "startMission", missionId: "varanaya_small_favor" }],
        },
        {
          id: "choice_decline_favor",
          text: "Maybe later. I've got other business right now.",
          nextNodeId: "node_mission_declined",
          effects: [{ type: "declineMission", missionId: "varanaya_small_favor" }],
        },
      ],
    },

    node_mission_accepted: {
      id: "node_mission_accepted",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Thank you! Take the road west toward the outpost archway, or head down toward the Royal Waterfront. Check in with the checkpoint, then report back to me when you're done.",
      type: "END",
    },

    node_mission_declined: {
      id: "node_mission_declined",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Understood. The kingdom and waterfront will still be here whenever you're ready to lend a hand.",
      type: "END",
    },

    node_mission_reminder: {
      id: "node_mission_reminder",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Head East down toward the Royal Waterfront promenade. Speak with Harbor Master Samuel Drake by the docks, collect the surveying crate from the stall, and bring it back.",
      type: "END",
    },

    node_mission_turnin: {
      id: "node_mission_turnin",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Incredible timing! The surveying shipment and blueprints arrived safely. Here is your reward—Westport is safer thanks to your help.",
      type: "TEXT",
      choices: [
        {
          id: "choice_turnin_proud",
          text: "Happy to help. The waterfront was bustling, but I got the shipment through.",
          nextNodeId: "node_mission_reward_granted",
          effects: [
            { type: "completeMission", missionId: "varanaya_small_favor" },
            { type: "completeMission", missionId: "westport_first_delivery" },
            { type: "setFlag", flagKey: "varanaya_small_favor_complete", value: true },
            { type: "setFlag", flagKey: "westport_delivery_complete", value: true },
          ],
        },
        {
          id: "choice_turnin_modest",
          text: "Just doing my part for the kingdom.",
          nextNodeId: "node_mission_reward_granted",
          effects: [
            { type: "completeMission", missionId: "varanaya_small_favor" },
            { type: "completeMission", missionId: "westport_first_delivery" },
            { type: "setFlag", flagKey: "varanaya_small_favor_complete", value: true },
            { type: "setFlag", flagKey: "westport_delivery_complete", value: true },
          ],
        },
      ],
    },

    node_mission_reward_granted: {
      id: "node_mission_reward_granted",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Take this architect's survey map and gold with our deepest gratitude. You've made a real name for yourself in Varanaya.",
      type: "END",
    },

    node_mission_aftermath: {
      id: "node_mission_aftermath",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "Much better, thanks to your delivery! The western boundary and waterfront are mapped and reinforced.",
      type: "TEXT",
      nextNodeId: "node_farewell",
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

    node_maya_sanctuary_discovery: {
      id: "node_maya_sanctuary_discovery",
      speaker: "Maya Lin",
      speakerRole: "Town Architect",
      text: "You stepped inside the Garbhagriha? The acoustics in that sanctum were tuned to resonant sacred frequencies. The consecrated flame has burned undisturbed since our stonecutters laid the foundation plinth.",
      type: "TEXT",
      effects: [{ type: "setFlag", flagKey: "maya_acknowledged_sanctum", value: true }],
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
