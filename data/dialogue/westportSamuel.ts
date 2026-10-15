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
          id: "choice_samuel_missing_ledger",
          text: "Clara sent me to cross-reference dock manifests for the market audit.",
          nextNodeId: "node_samuel_ledger_answer",
          conditions: [
            {
              type: "missionActive",
              missionId: "varanaya_missing_ledger",
            },
          ],
        },
        {
          id: "choice_samuel_resolve_lights",
          text: "I inspected the waterfront pier beacon mechanism.",
          nextNodeId: "node_samuel_resolve_lights",
          conditions: [
            {
              type: "missionActive",
              missionId: "varanaya_harbor_lights",
            },
          ],
        },
        {
          id: "choice_samuel_offer_lights",
          text: "How are the approach lights holding up in the coastal fog?",
          nextNodeId: "node_samuel_offer_lights",
          conditions: [
            {
              type: "missionAvailable",
              missionId: "varanaya_harbor_lights",
            },
          ],
        },
        {
          id: "choice_samuel_post_lights",
          text: "How are the harbor approaches tonight, Harbor Master?",
          nextNodeId: "node_samuel_post_lights",
          conditions: [
            {
              type: "missionCompleted",
              missionId: "varanaya_harbor_lights",
            },
          ],
        },
        {
          id: "choice_samuel_causeway_discovery",
          text: "I made the journey across the Grand Causeway to the Outer Island Sanctuary.",
          nextNodeId: "node_samuel_causeway_discovery",
          conditions: [
            {
              type: "locationDiscovered",
              locationId: "outer-island-sanctuary",
            },
          ],
        },
        {
          id: "choice_samuel_harbor_lore",
          text: "Tell me about the traditional outrigger catamarans moored at the docks.",
          nextNodeId: "node_samuel_harbor_lore",
        },
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

    node_samuel_ledger_answer: {
      id: "node_samuel_ledger_answer",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Ah, Clara's ledger! Yes, I checked my dock manifest. The second coastal dhow logged duplicate tariffs under an apprentice scribe's stamp. Clara's original numbers were completely sound. Let her know she can close the books safely.",
      type: "TEXT",
      effects: [
        {
          type: "completeObjective",
          missionId: "varanaya_missing_ledger",
          objectiveId: "question_samuel",
        },
        { type: "setFlag", flagKey: "samuel_confirmed_ledger", value: true },
      ],
      nextNodeId: "node_farewell",
    },

    node_samuel_offer_lights: {
      id: "node_samuel_offer_lights",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "The fog off the Grand Sea Gate is thick as chowder. The northern pier beacon needs someone to inspect its brass mechanism and verify the oil lens. Would you walk out along the quay and inspect it?",
      type: "TEXT",
      choices: [
        {
          id: "choice_accept_harbor_lights",
          text: "I'll inspect the pier beacon mechanism for you.",
          nextNodeId: "node_accept_lights",
          effects: [{ type: "startMission", missionId: "varanaya_harbor_lights" }],
        },
        {
          id: "choice_decline_harbor_lights",
          text: "I cannot inspect the beacon right now, Samuel.",
          nextNodeId: "node_decline_lights",
          effects: [{ type: "declineMission", missionId: "varanaya_harbor_lights" }],
        },
      ],
    },

    node_accept_lights: {
      id: "node_accept_lights",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Appreciate it! Follow the northern waterfront pier out toward the watchtower. Check the beacon housing, then return and let me know how we should manage the fuel oil.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_decline_lights: {
      id: "node_decline_lights",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Understood. The dockhands will keep watch, but return if you find a free moment.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_samuel_resolve_lights: {
      id: "node_samuel_resolve_lights",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Good to see you back. The pier beacon is verified. We only have three barrels of purified whale oil left in reserve this week. How should we allocate it?",
      type: "TEXT",
      choices: [
        {
          id: "choice_night_navigation",
          text: "Prioritize night navigation beacons for inbound ocean vessels.",
          nextNodeId: "node_resolve_navigation",
          effects: [
            { type: "setFlag", flagKey: "samuel_choice_night_navigation", value: true },
            { type: "completeMission", missionId: "varanaya_harbor_lights" },
          ],
        },
        {
          id: "choice_conserve_fuel",
          text: "Conserve lantern fuel reserves in case storm surges delay convoys.",
          nextNodeId: "node_resolve_conserve",
          effects: [
            { type: "setFlag", flagKey: "samuel_choice_conserve_fuel", value: true },
            { type: "completeMission", missionId: "varanaya_harbor_lights" },
          ],
        },
      ],
    },

    node_resolve_navigation: {
      id: "node_resolve_navigation",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Full brightness it is! The incoming captains will see the Grand Sea Gate clearly from miles out. Fine work, traveler.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_resolve_conserve: {
      id: "node_resolve_conserve",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "A prudent strategy. We will keep the wick trimmed to half until the storm front clears. Take this payment for your help on the docks.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_samuel_post_lights: {
      id: "node_samuel_post_lights",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "The harbor approaches are well guarded tonight thanks to your inspection. Ships are mooring safely at every slipway.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_samuel_causeway_discovery: {
      id: "node_samuel_causeway_discovery",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "You walked the entire hundred-and-twenty-meter stone span out to the Outer Island? Incredible! Few travelers dare venture past the mid-span belvedere when the trade winds blow. That ivory sanctuary has guarded our waters since the royal founding.",
      type: "TEXT",
      effects: [{ type: "setFlag", flagKey: "samuel_praised_outer_voyage", value: true }],
      nextNodeId: "node_farewell",
    },

    node_samuel_harbor_lore: {
      id: "node_samuel_harbor_lore",
      speaker: "Samuel Drake",
      speakerRole: "Harbor Logistics Master",
      text: "Those are Malabar kettu-maram outriggers. Lashed together with coir fiber and treated with boiled fish resin, they can cut right through the coastal reef surf without taking on water. Our fishermen have sailed them for centuries.",
      type: "TEXT",
      effects: [{ type: "setFlag", flagKey: "heard_catamaran_lore", value: true }],
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
