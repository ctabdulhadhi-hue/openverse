import { type RegionBounds, WORLD_REGIONS } from "./WorldConfig";

/**
 * Determines which geographic region contains the given 3D coordinates.
 * Evaluates priority boundaries (Mountain, Forest, City, Coast, Town) and falls
 * back to connecting thoroughfares.
 */
export function getRegionAt(x: number, z: number): RegionBounds {
  // 1. Mountain Peak & High Ridge (North: z < -500)
  if (z < -500 && x >= -400 && x <= 350) {
    return WORLD_REGIONS.mountain!;
  }

  // 2. Pine Crest Forest (Northwest: x < -100, -550 <= z <= -160)
  if (x < -100 && z >= -550 && z <= -160) {
    return WORLD_REGIONS.forest!;
  }

  // 3. Central City (Northeast: x > 180, -650 <= z <= -180)
  if (x > 180 && z >= -650 && z <= -180) {
    return WORLD_REGIONS.city!;
  }

  // 4. Sunken Coast & Maritime Pier (East/Southeast: x > 180, -180 < z <= 350)
  if (x > 180 && z > -180 && z <= 350) {
    return WORLD_REGIONS.coast!;
  }

  // 5. Westport Town & Surrounding Hamlet (South/Center: -180 <= x <= 180, -100 <= z <= 180)
  if (x >= -180 && x <= 180 && z >= -100 && z <= 180) {
    return WORLD_REGIONS.town!;
  }

  // 6. Connecting Highway / Valley Road
  return WORLD_REGIONS.road!;
}

/**
 * Returns formatted display text for the current region given player position.
 */
export function getRegionDisplayName(x: number, z: number): string {
  return getRegionAt(x, z).name;
}
