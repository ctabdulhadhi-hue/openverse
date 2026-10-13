import type { MissionDefinition } from "@/game/missions/MissionTypes";
import { LAGOON_ISLE_COORDINATES } from "@/game/world/island/lagoonIslandData";

/**
 * Stage 2 Island Missions: Lagoon Isle.
 * Original missions designed for the tropical island destination.
 */

export const LAGOON_ISLE_EXPLORATION: MissionDefinition = {
  id: "lagoon_isle_exploration",
  title: "Wonders of Lagoon Isle",
  subtitle: "Explore the Coral Atoll",
  description:
    "Explore the tropical archipelago of Lagoon Isle. Visit the arrival airstrip, wander through Coral Bay Settlement, and ascend the Emerald Ridge Viewpoint overlooking the central turquoise lagoon.",
  shortDescription: "Visit the airstrip, explore the village, and ascend to Emerald Ridge.",
  category: "SIDE",
  giverNpcId: "npc-lagoon-maya",
  objectives: [
    {
      id: "visit_arrival",
      type: "GO_TO_LOCATION",
      title: "Arrive at Lagoon Isle",
      description: "Step off the regional flight at the coral airstrip transfer area.",
      target: {
        position: LAGOON_ISLE_COORDINATES.arrival.global,
        radius: 8.0,
        chunkKey: "4,3",
      },
      requiredCount: 1,
    },
    {
      id: "visit_village",
      type: "GO_TO_LOCATION",
      title: "Explore Coral Bay Settlement",
      description: "Walk east along the sandy trail to the stilt cottages and market plaza.",
      target: {
        position: LAGOON_ISLE_COORDINATES.village.global,
        radius: 8.0,
        chunkKey: "4,3",
      },
      requiredCount: 1,
    },
    {
      id: "reach_viewpoint",
      type: "GO_TO_LOCATION",
      title: "Ascend the Emerald Ridge Viewpoint",
      description: "Climb the rocky promontory trail to the summit observation deck.",
      target: {
        position: LAGOON_ISLE_COORDINATES.viewpoint.global,
        radius: 8.0,
        chunkKey: "4,3",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  rewards: {
    xp: 400,
    currency: 200,
    flags: {
      lagoon_exploration_complete: true,
    },
  },
  metadata: {
    locationName: "Lagoon Isle",
    difficulty: "Novice",
  },
};

export const LAGOON_HARBOR_SALVAGE: MissionDefinition = {
  id: "lagoon_harbor_salvage",
  title: "Harbor Salvage",
  subtitle: "Recover Lost Drift Supplies",
  description:
    "Fisherman Kaelen lost a crate of shipping tackle when the tide turned. Search the Turquoise Beach shoreline and recover the drift crate.",
  shortDescription: "Speak with Kaelen at the jetty and recover the drift crate on the beach.",
  category: "SIDE",
  giverNpcId: "npc-lagoon-kaelen",
  objectives: [
    {
      id: "visit_harbor",
      type: "GO_TO_LOCATION",
      title: "Visit Fisherman's Jetty",
      description: "Head south to the wooden pier and check in with Fisherman Kaelen.",
      target: {
        position: LAGOON_ISLE_COORDINATES.harbor.global,
        radius: 8.0,
        chunkKey: "4,3",
      },
      requiredCount: 1,
    },
    {
      id: "collect_drift_crate",
      type: "COLLECT",
      title: "Recover Drift Crate",
      description: "Retrieve the lost drift crate resting near the beach sun loungers.",
      target: {
        interactableId: "lagoon-drift-crate",
        itemId: "lagoon_drift_tackle",
        position: LAGOON_ISLE_COORDINATES.beach.global,
        radius: 6.0,
        chunkKey: "4,3",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  rewards: {
    xp: 300,
    currency: 150,
    flags: {
      lagoon_harbor_salvage_complete: true,
    },
  },
  metadata: {
    locationName: "Fisherman's Jetty & Beach",
    difficulty: "Novice",
  },
};

export const LAGOON_VIEWPOINT_CHALLENGE: MissionDefinition = {
  id: "lagoon_viewpoint_challenge",
  title: "Crest of Emerald Ridge",
  subtitle: "Panoramic Atoll Survey",
  description:
    "Hike up to the highest point of Lagoon Isle and survey the surrounding coral barrier reef through the observation binoculars.",
  shortDescription: "Inspect the summit observation binoculars atop Emerald Ridge.",
  category: "SIDE",
  giverNpcId: "npc-lagoon-taran",
  objectives: [
    {
      id: "survey_ridge",
      type: "OBSERVE",
      title: "Survey the Atoll Panorama",
      description: "Inspect the summit binoculars overlooking the turquoise lagoon.",
      target: {
        interactableId: "lagoon-viewpoint-plaque",
        position: LAGOON_ISLE_COORDINATES.viewpoint.global,
        radius: 5.0,
        chunkKey: "4,3",
      },
      requiredCount: 1,
    },
  ],
  prerequisites: [],
  rewards: {
    xp: 250,
    currency: 100,
    flags: {
      lagoon_viewpoint_survey_complete: true,
    },
  },
  metadata: {
    locationName: "Emerald Ridge Viewpoint",
    difficulty: "Novice",
  },
};

export const LAGOON_MISSIONS = [
  LAGOON_ISLE_EXPLORATION,
  LAGOON_HARBOR_SALVAGE,
  LAGOON_VIEWPOINT_CHALLENGE,
];
