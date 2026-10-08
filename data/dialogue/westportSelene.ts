import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

export const SELENE_DIALOGUE: DialogueConversation = {
  id: "conversation-westport-selene",
  npcId: "npc-selene",
  title: "Selene Voss — Civic Archivist",
  startNodeId: "node_greeting",
  nodes: {
    node_greeting: {
      id: "node_greeting",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Greetings, traveler. I curate the historical scrolls and architectural folios here in the Civic District. Are you seeking historical records of our settlement?",
      type: "TEXT",
      choices: [
        {
          id: "choice_selene_resolve_gardens",
          text: "I inspected the ancient lotus stele in the Palace Gardens.",
          nextNodeId: "node_selene_resolve_gardens",
          conditions: [
            {
              type: "missionActive",
              missionId: "varanaya_garden_whispers",
            },
          ],
        },
        {
          id: "choice_selene_offer_gardens",
          text: "You mentioned ancient carvings near the Palace Gardens earlier?",
          nextNodeId: "node_selene_offer_gardens",
          conditions: [
            {
              type: "missionAvailable",
              missionId: "varanaya_garden_whispers",
            },
          ],
        },
        {
          id: "choice_selene_post_gardens",
          text: "Have you cataloged the lotus stele rubbing yet?",
          nextNodeId: "node_selene_post_gardens",
          conditions: [
            {
              type: "missionCompleted",
              missionId: "varanaya_garden_whispers",
            },
          ],
        },
        {
          id: "choice_archive_history",
          text: "What history is preserved in the town archives?",
          nextNodeId: "node_archive_history",
        },
        {
          id: "choice_palace_architecture",
          text: "Who designed the monumental palaces and terraces of Varanaya?",
          nextNodeId: "node_palace_architecture",
        },
        {
          id: "choice_browse_selene",
          text: "I was simply exploring the Civic District.",
          nextNodeId: "node_farewell",
        },
      ],
    },

    node_selene_offer_gardens: {
      id: "node_selene_offer_gardens",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Indeed! In the Palace Gardens southwest of the promenade, an weathered stone stele stands beside the lotus fountain. Legends speak of early coastal masons carving hydrological secrets into its face. Would you inspect it and bring back an account?",
      type: "TEXT",
      choices: [
        {
          id: "choice_accept_garden_whispers",
          text: "I'll explore the gardens and inspect the ancient stele.",
          nextNodeId: "node_accept_gardens",
          effects: [{ type: "startMission", missionId: "varanaya_garden_whispers" }],
        },
        {
          id: "choice_decline_garden_whispers",
          text: "I cannot take on an archival investigation right now.",
          nextNodeId: "node_decline_gardens",
          effects: [{ type: "declineMission", missionId: "varanaya_garden_whispers" }],
        },
      ],
    },

    node_accept_gardens: {
      id: "node_accept_gardens",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Splendid! Walk down to the Palace Gardens courtyard, find the carved stele near the lotus fountain, and examine its relief engravings. I eagerly await your findings.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_decline_gardens: {
      id: "node_decline_gardens",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Very well. Antiquities have waited centuries; they can wait a little longer. Let me know if you change your mind.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_selene_resolve_gardens: {
      id: "node_selene_resolve_gardens",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Fascinating! The glyphs represent ancient water-harvesting aqueducts beneath the terraces. How should we proceed with this discovery?",
      type: "TEXT",
      choices: [
        {
          id: "choice_archive_rubbing",
          text: "Donate the rubbing to the public archives for open scholarship.",
          nextNodeId: "node_resolve_scholarship",
          effects: [
            { type: "setFlag", flagKey: "selene_choice_archive_rubbing", value: true },
            { type: "completeMission", missionId: "varanaya_garden_whispers" },
          ],
        },
        {
          id: "choice_keep_mystery",
          text: "Keep the botanical secret within garden lore to protect the heritage site.",
          nextNodeId: "node_resolve_preservation",
          effects: [
            { type: "setFlag", flagKey: "selene_choice_keep_mystery", value: true },
            { type: "completeMission", missionId: "varanaya_garden_whispers" },
          ],
        },
      ],
    },

    node_resolve_scholarship: {
      id: "node_resolve_scholarship",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Knowledge belongs to all scholars. I will index this rubbing in our royal archives so future generations may study it. Take this stipend for your scholarly contribution!",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_resolve_preservation: {
      id: "node_resolve_preservation",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Wisely cautioned. Overt tourism might damage the delicate sandstone carvings. We will preserve the record discretely. Accept this honorarium with my thanks.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_selene_post_gardens: {
      id: "node_selene_post_gardens",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Your documentation of the Palace Gardens stele remains one of the finest recent acquisitions in our civic collection. Thank you again!",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_archive_history: {
      id: "node_archive_history",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "We house chronicles dating back to the maritime expansion. The architectural treatises on coastal domes and water gates are our proudest treasures.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_palace_architecture: {
      id: "node_palace_architecture",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "Master artisans designed our havelis, chhatris, and grand sea gates to harmonize with the ocean swells. Stone, water, and sunlight exist here in perpetual balance.",
      type: "TEXT",
      nextNodeId: "node_farewell",
    },

    node_farewell: {
      id: "node_farewell",
      speaker: "Selene Voss",
      speakerRole: "Civic Archivist",
      text: "May your discoveries expand our understanding of this world. Walk in wisdom.",
      type: "END",
    },
  },
};
