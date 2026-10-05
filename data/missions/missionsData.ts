export type MissionCategory = "MAIN" | "SIDE" | "ACTIVITIES" | "COMPLETED";

export interface MissionObjective {
  id: string;
  text: string;
  completed: boolean;
}

export interface MissionDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: MissionCategory;
  distance: string;
  description: string;
  objectives: MissionObjective[];
  rewards: {
    xp: number;
    currency: number;
  };
  tracked?: boolean;
}

export const MISSIONS: MissionDefinition[] = [
  {
    id: "explore-openverse",
    title: "Explore OPENVERSE",
    subtitle: "Discover your first district",
    category: "MAIN",
    distance: "420 m",
    description:
      "Your journey begins. Explore the surrounding area and get familiar with the living world. There are no forced boundaries—take your time.",
    objectives: [
      { id: "explore-area", text: "Explore the area", completed: true },
      { id: "visit-central", text: "Visit the central district", completed: true },
      { id: "discover-location", text: "Discover your first location", completed: false },
    ],
    rewards: {
      xp: 500,
      currency: 250,
    },
    tracked: true,
  },
  {
    id: "the-missing-package",
    title: "The Missing Package",
    subtitle: "Find the lost delivery",
    category: "MAIN",
    distance: "1.2 km",
    description:
      "A merchant courier lost an unmarked parcel somewhere along Sarner Road near the bridge. Search the path and return it.",
    objectives: [
      { id: "reach-bridge", text: "Inspect the stone river bridge", completed: false },
      { id: "retrieve-satchel", text: "Recover the merchant's parcel", completed: false },
    ],
    rewards: {
      xp: 350,
      currency: 180,
    },
  },
  {
    id: "a-strange-signal",
    title: "A Strange Signal",
    subtitle: "Investigate the radio signal",
    category: "SIDE",
    distance: "2.4 km",
    description:
      "An unexpected radio transmission echoes through the alpine pass above Pine Crest Ridge. Trace the source of the beacon.",
    objectives: [
      { id: "find-antenna", text: "Locate the repeater antenna tower", completed: false },
    ],
    rewards: {
      xp: 600,
      currency: 300,
    },
  },
  {
    id: "photography-challenge",
    title: "Photography Challenge",
    subtitle: "Capture landmark locations",
    category: "ACTIVITIES",
    distance: "1.1 km",
    description:
      "A traveling cartographer seeks scenic photographs of landmark viewpoints across town and forest.",
    objectives: [
      { id: "snap-harbor", text: "Photograph Westport harbor from the clifftop", completed: false },
    ],
    rewards: {
      xp: 400,
      currency: 150,
    },
  },
  {
    id: "street-race",
    title: "Street Race",
    subtitle: "Beat the local time",
    category: "ACTIVITIES",
    distance: "3.0 km",
    description:
      "Test your speed on the winding hillside tarmac circuit. Finish under 2 minutes 15 seconds.",
    objectives: [
      { id: "reach-start", text: "Report to the starting line on Stone Road", completed: false },
    ],
    rewards: {
      xp: 750,
      currency: 500,
    },
  },
  {
    id: "treasure-hunt",
    title: "Treasure Hunt",
    subtitle: "Find hidden rewards",
    category: "ACTIVITIES",
    distance: "2.8 km",
    description:
      "Follow the enigmatic riddles scribbled on the parchment found in the coastal watchtower.",
    objectives: [
      { id: "find-cove-chest", text: "Locate the hidden cache in Sunken Cove", completed: false },
    ],
    rewards: {
      xp: 800,
      currency: 650,
    },
  },
];
