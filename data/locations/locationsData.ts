export interface LocationDefinition {
  id: string;
  name: string;
  region: "TOWN" | "CITY" | "FOREST" | "MOUNTAINS" | "COAST" | "INDUSTRIAL" | "LAKES";
  tagline: string;
  description: string;
  coordinates: { x: number; y: number };
  discovered: boolean;
  fastTravelAvailable: boolean;
}

export const LOCATIONS: LocationDefinition[] = [
  {
    id: "central-district",
    name: "Central District",
    region: "CITY",
    tagline: "The beating cultural heart of OPENVERSE",
    description:
      "A vibrant district with modern architecture, paved promenades, and rich culture. There's always something new to discover around every corner.",
    coordinates: { x: 74, y: 52 },
    discovered: true,
    fastTravelAvailable: true,
  },
  {
    id: "westport-harbor",
    name: "Westport Harbor",
    region: "TOWN",
    tagline: "Historic maritime port and coastal community",
    description:
      "Lively wooden docks, fishing vessels, and seaside taverns. The gateway between sea trade and inland overland travel.",
    coordinates: { x: 24, y: 62 },
    discovered: true,
    fastTravelAvailable: true,
  },
  {
    id: "pine-crest-ridge",
    name: "Pine Crest Ridge",
    region: "FOREST",
    tagline: "Ancient woodland trail leading into the canopy",
    description:
      "Towering cedar and pine trees shelter secluded trails, ancient stone shrines, and undiscovered wildlife clearings.",
    coordinates: { x: 36, y: 38 },
    discovered: true,
    fastTravelAvailable: false,
  },
  {
    id: "aethel-mountain-peak",
    name: "Mount Aethel Peak",
    region: "MOUNTAINS",
    tagline: "Snow-crowned summits overlooking the entire continent",
    description:
      "Perilous mountain passes and alpine wind viewports with sweeping vistas across all five regions.",
    coordinates: { x: 55, y: 22 },
    discovered: false,
    fastTravelAvailable: false,
  },
  {
    id: "sunken-cove",
    name: "Sunken Cove",
    region: "COAST",
    tagline: "Hidden turquoise waters and sea caves",
    description:
      "Pristine coastal shoreline nestled beneath chalk cliffs, holding century-old smuggler shipwrecks.",
    coordinates: { x: 44, y: 84 },
    discovered: false,
    fastTravelAvailable: false,
  },
];
