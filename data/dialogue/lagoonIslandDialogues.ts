import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

/**
 * Dialogue trees for Lagoon Isle NPCs.
 */

export const MAYA_ISLAND_DIALOGUE: DialogueConversation = {
  id: "conversation-lagoon-maya",
  npcId: "npc-lagoon-maya",
  title: "Maya — Island Guide",
  startNodeId: "node_welcome",
  nodes: {
    node_welcome: {
      id: "node_welcome",
      speaker: "Maya",
      speakerRole: "Island Guide",
      text: "Welcome to Lagoon Isle! The flight from Agatti was smooth, yes? This atoll has been our island sanctuary for generations.",
      type: "TEXT",
      choices: [
        {
          id: "choice_what_to_see",
          text: "What places should I explore first?",
          nextNodeId: "node_landmarks",
        },
        {
          id: "choice_village_life",
          text: "Tell me about the settlement.",
          nextNodeId: "node_settlement",
        },
        {
          id: "choice_farewell",
          text: "Thank you, I'll take a look around.",
          nextNodeId: "node_bye",
        },
      ],
    },
    node_landmarks: {
      id: "node_landmarks",
      speaker: "Maya",
      speakerRole: "Island Guide",
      text: "Don't miss Turquoise Beach to the west, and hike up to Emerald Ridge Viewpoint to the southeast. You can see the entire barrier reef from there!",
      type: "TEXT",
      choices: [
        {
          id: "choice_return_flight",
          text: "How do I return to Agatti Airport?",
          nextNodeId: "node_return_info",
        },
        {
          id: "choice_explore",
          text: "I'll go check out the ridge now.",
          nextNodeId: "node_bye",
        },
      ],
    },
    node_settlement: {
      id: "node_settlement",
      speaker: "Maya",
      speakerRole: "Island Guide",
      text: "Coral Bay Settlement lies just ahead along the paved sand trail. Our stilt houses stay cool under the palms, and the fruit market has fresh coconuts daily.",
      type: "TEXT",
      nextNodeId: "node_bye",
    },
    node_return_info: {
      id: "node_return_info",
      speaker: "Maya",
      speakerRole: "Island Guide",
      text: "Whenever you're ready, head to the departure desk right here at the transfer shelter. Flight LA-103 returns to Agatti regularly.",
      type: "TEXT",
      nextNodeId: "node_bye",
    },
    node_bye: {
      id: "node_bye",
      speaker: "Maya",
      speakerRole: "Island Guide",
      text: "Enjoy your stay on Lagoon Isle. May the sea breeze guide your steps!",
      type: "TEXT",
    },
  },
};

export const KAELEN_DIALOGUE: DialogueConversation = {
  id: "conversation-lagoon-kaelen",
  npcId: "npc-lagoon-kaelen",
  title: "Kaelen — Master Fisherman",
  startNodeId: "node_greeting",
  nodes: {
    node_greeting: {
      id: "node_greeting",
      speaker: "Kaelen",
      speakerRole: "Harbor Fisherman",
      text: "Ah, a visitor from the mainland! The tide is calm today, but our fishing dhows brought in a rich haul of reef fish.",
      type: "TEXT",
      choices: [
        {
          id: "choice_need_help",
          text: "Do you need any assistance around the harbor?",
          nextNodeId: "node_salvage",
        },
        {
          id: "choice_canoes",
          text: "Those outrigger canoes are beautiful.",
          nextNodeId: "node_boats",
        },
        {
          id: "choice_bye",
          text: "Good luck with the catch!",
          nextNodeId: "node_bye",
        },
      ],
    },
    node_salvage: {
      id: "node_salvage",
      speaker: "Kaelen",
      speakerRole: "Harbor Fisherman",
      text: "Actually, yes! A drift crate with spare rope tackle washed onto Turquoise Beach when the swell rose earlier. If you spot it along the shoreline, it would help us immensely.",
      type: "TEXT",
      choices: [
        {
          id: "choice_accept_salvage",
          text: "I'll keep an eye out for it on the beach.",
          nextNodeId: "node_thanks",
        },
      ],
    },
    node_boats: {
      id: "node_boats",
      speaker: "Kaelen",
      speakerRole: "Harbor Fisherman",
      text: "Carved from island timber and balanced with coconut wood floats. They glide effortlessly over the coral reefs even during low tide.",
      type: "TEXT",
      nextNodeId: "node_bye",
    },
    node_thanks: {
      id: "node_thanks",
      speaker: "Kaelen",
      speakerRole: "Harbor Fisherman",
      text: "Appreciate it, traveler! You'll find it resting on the white sand near the beach loungers.",
      type: "TEXT",
    },
    node_bye: {
      id: "node_bye",
      speaker: "Kaelen",
      speakerRole: "Harbor Fisherman",
      text: "Smooth sailing and gentle seas to you!",
      type: "TEXT",
    },
  },
};

export const TARAN_DIALOGUE: DialogueConversation = {
  id: "conversation-lagoon-taran",
  npcId: "npc-lagoon-taran",
  title: "Taran — Viewpoint Caretaker",
  startNodeId: "node_crest",
  nodes: {
    node_crest: {
      id: "node_crest",
      speaker: "Taran",
      speakerRole: "Viewpoint Caretaker",
      text: "You made the climb to Emerald Ridge! Take a breath and look out. The view across the lagoon is unmatched in all the islands.",
      type: "TEXT",
      choices: [
        {
          id: "choice_about_view",
          text: "Can you see the mainland from here?",
          nextNodeId: "node_vista",
        },
        {
          id: "choice_binoculars",
          text: "What are those binoculars for?",
          nextNodeId: "node_optics",
        },
      ],
    },
    node_vista: {
      id: "node_vista",
      speaker: "Taran",
      speakerRole: "Viewpoint Caretaker",
      text: "On exceptionally clear mornings, you can spot the distant Shikhara spire of Varanaya rising like a golden beacon beyond the horizon.",
      type: "TEXT",
      nextNodeId: "node_bye",
    },
    node_optics: {
      id: "node_optics",
      speaker: "Taran",
      speakerRole: "Viewpoint Caretaker",
      text: "Brass navigation optics installed by royal cartographers. Step up and inspect them—they reveal the outer barrier reefs and sea turtle shoals.",
      type: "TEXT",
      nextNodeId: "node_bye",
    },
    node_bye: {
      id: "node_bye",
      speaker: "Taran",
      speakerRole: "Viewpoint Caretaker",
      text: "Take your time soaking in the view. There is no rush on Lagoon Isle.",
      type: "TEXT",
    },
  },
};

export const LAGOON_DIALOGUES = [MAYA_ISLAND_DIALOGUE, KAELEN_DIALOGUE, TARAN_DIALOGUE];
