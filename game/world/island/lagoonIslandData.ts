/**
 * Canonical Location and Coordinate Registry for Lagoon Isle (Stage 2 Expansion).
 *
 * Single source of truth for:
 * - 3D world meshes, terrain boundaries, and Rapier colliders
 * - Player arrival, spawn, and travel endpoints
 * - World map markers and regional taxonomy
 * - NPC and mission target coordinates
 */

export interface IslandCoordinateDef {
  id: string;
  name: string;
  local: [number, number, number];
  global: [number, number, number];
  description: string;
  elevation: number;
}

/**
 * Global region anchor for Lagoon Isle.
 * Placed at [800, 0, 600], corresponding to chunk (4, 3) in the 200m world grid.
 * Geographically separated from Varanaya (chunk 0, 0) by ocean waters,
 * enabling clean streaming activation and unmounting of distant regions.
 */
export const LAGOON_ISLE_ORIGIN: [number, number, number] = [800, 0, 600];

/**
 * Canonical coordinates for Lagoon Isle landmarks.
 */
export const LAGOON_ISLE_COORDINATES = {
  // 1. Landing and transfer area
  arrival: {
    id: "lagoon-arrival",
    name: "Lagoon Isle Airstrip & Transfer",
    local: [0, 0.4, 0] as [number, number, number],
    global: [800, 1.2, 600] as [number, number, number],
    description: "Coral sand spit with passenger arrival shelter, windsock, and transfer apron.",
    elevation: 1.2,
  },
  // 2. Island village settlement
  village: {
    id: "lagoon-village",
    name: "Coral Bay Settlement",
    local: [35, 0.4, -20] as [number, number, number],
    global: [835, 1.2, 580] as [number, number, number],
    description:
      "Tropical island settlement with stilt houses, market stalls, and community pavilion.",
    elevation: 1.2,
  },
  // 3. Turquoise lagoon beach
  beach: {
    id: "lagoon-beach",
    name: "Turquoise Lagoon Beach",
    local: [-25, 0.2, 20] as [number, number, number],
    global: [775, 0.4, 620] as [number, number, number],
    description: "White sand beach with shallow coral lagoon, palm clusters, and sun loungers.",
    elevation: 0.4,
  },
  // 4. Palm forest
  forest: {
    id: "lagoon-forest",
    name: "Whispering Palm Grove",
    local: [-45, 0.3, -30] as [number, number, number],
    global: [755, 1.0, 570] as [number, number, number],
    description:
      "Dense coconut palm forest with winding sandy trails, tropical shrubs, and shaded paths.",
    elevation: 1.0,
  },
  // 5. Coastal elevated viewpoint
  viewpoint: {
    id: "lagoon-viewpoint",
    name: "Emerald Ridge Viewpoint",
    local: [50, 5.0, 35] as [number, number, number],
    global: [850, 6.2, 635] as [number, number, number],
    description: "Elevated rocky outcrop overlooking the azure ocean and turquoise lagoon.",
    elevation: 6.2,
  },
  // 6. Island harbor and fishing jetty
  harbor: {
    id: "lagoon-harbor",
    name: "Fisherman's Jetty & Harbor",
    local: [20, 0.3, 40] as [number, number, number],
    global: [820, 0.8, 640] as [number, number, number],
    description: "Wooden pier with moored outrigger boats, fishing equipment, and supply crates.",
    elevation: 0.8,
  },
  // 7. Central lagoon waters
  lagoonCenter: {
    id: "lagoon-center",
    name: "Sunken Lagoon Pool",
    local: [0, 0.05, -5] as [number, number, number],
    global: [800, 0.1, 595] as [number, number, number],
    description: "Shallow, translucent turquoise pool ringed by white sand and live coral fringes.",
    elevation: 0.1,
  },
} as const;

/**
 * Returns true if the given 3D world coordinates fall within the Lagoon Isle territory.
 */
export function isWithinLagoonIsleBounds(x: number, z: number, margin = 100): boolean {
  const [ox, , oz] = LAGOON_ISLE_ORIGIN;
  return Math.abs(x - ox) <= margin && Math.abs(z - oz) <= margin;
}
