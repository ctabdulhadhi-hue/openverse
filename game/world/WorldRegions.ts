import { type RegionDefinition, WORLD_REGIONS } from "./WorldConfig";

/**
 * Determines which geographic region contains the given world coordinates.
 * Operates over the expandable open-world region registry.
 */
export function getRegionAt(x: number, z: number): RegionDefinition {
  // 1. Mount Aethel (High alpine massif to the North)
  if (z < -380 && Math.abs(x) < 360) {
    return WORLD_REGIONS.mountain!;
  }

  // 2. Pine Crest Forest (Woodland expanse to the West/Northwest)
  if (x < -80 && z < 60) {
    return WORLD_REGIONS.forest!;
  }

  // 3. Central City (Urban plateau to the Northeast)
  if (x > 140 && z < -60) {
    return WORLD_REGIONS.city!;
  }

  // 4. Sunken Coast (Maritime shoreline and bluffs to the East/Southeast)
  if (x > 140 && z >= -60) {
    return WORLD_REGIONS.coast!;
  }

  // 5. Westport Town (Central settlement basin)
  if (Math.abs(x) <= 140 && z >= -70 && z <= 150) {
    return WORLD_REGIONS.town!;
  }

  // 6. Connecting arterial road network / Valley corridor
  return WORLD_REGIONS.road!;
}

/**
 * Returns formatted display text for the current region given player position.
 */
export function getRegionDisplayName(x: number, z: number): string {
  return getRegionAt(x, z).name;
}
