import { type RegionDefinition, WORLD_REGIONS } from "./WorldConfig";

/**
 * Determines which geographic region contains the given world coordinates.
 * Operates over the expandable open-world region registry.
 */
export function getRegionAt(x: number, z: number): RegionDefinition {
  // 1. Northern Highlands (Alpine mountain ridges overlooking the sanctuary basin)
  if (z < -95) {
    return WORLD_REGIONS.northernHighlands!;
  }

  // 2. Outer Sanctuary (Grand Causeway Bridge and Outer Island Sanctuary to the East)
  if (x > 55) {
    return WORLD_REGIONS.outerSanctuary!;
  }

  // 3. Waterfront & Harbor (Maritime quay, ghat steps, spice markets, harbor watchtower)
  if (x >= 15 && z >= -40 && z <= 50) {
    return WORLD_REGIONS.waterfront!;
  }

  // 4. Western Approach (Beyond the monumental Grand Sea Gate to the West)
  if (x < -35) {
    return WORLD_REGIONS.westernApproach!;
  }

  // 5. Palace District (Sandstone havelis, colonnades, and terrace lotus gardens)
  if (x < -12 && z >= -95 && z <= 35) {
    return WORLD_REGIONS.palaceDistrict!;
  }

  // 6. Southern Palm Dunes (Tropical groves and coastal dunes south of the promenade)
  if (z > 50) {
    return WORLD_REGIONS.southernDunes!;
  }

  // 7. Royal Core (Central sandstone promenade, Sacred Monument District, Grand Sanctuary)
  return WORLD_REGIONS.royalCore!;
}

/**
 * Returns formatted display text for the current region given player position.
 */
export function getRegionDisplayName(x: number, z: number): string {
  return getRegionAt(x, z).name;
}
