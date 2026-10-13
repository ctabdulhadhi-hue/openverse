/**
 * Varanaya World & Map Coordinate Systems.
 *
 * Defines the single source of truth for converting 3D world meters (X, Y, Z)
 * into normalized 2D map percentage coordinates (x: 0..100%, y: 0..100%).
 *
 * Orientation:
 * - World X: West (-) to East (+)
 * - World Z: North (-) to South (+)
 * - Map X: 0% (West) to 100% (East)
 * - Map Y: 0% (North) to 100% (South)
 */

export interface MapBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Canonical bounding box for the playable Varanaya coastal kingdom.
 * Covers the western wilderness gate, central promenade, northern sanctuary,
 * eastern waterfront ghats, turquoise bay, causeway bridge, and outer island.
 */
export const VARANAYA_MAP_BOUNDS: MapBounds = {
  minX: -100, // West (Western Approach / Wilderness)
  maxX: 200, // East (Outer Island Sanctuary terminus)
  minZ: -110, // North (Grand Sanctuary Shikhara & Mountain Backdrop)
  maxZ: 90, // South (South Gatehouse Havelis & Garden Approach)
};

/**
 * Converts 3D world coordinates [x, y, z] to 2D map percentage coordinates { x, y } in [0..100].
 */
export function worldToMapCoordinates(
  worldX: number,
  worldZ: number,
  bounds: MapBounds = VARANAYA_MAP_BOUNDS,
): { x: number; y: number } {
  // Special projection for Lagoon Isle offshore archipelago
  if (worldX >= 650 && worldZ >= 450) {
    const rawX = 88.0 + ((worldX - 800) / 120) * 8.0;
    const rawY = 82.0 + ((worldZ - 600) / 120) * 8.0;
    return {
      x: Number(Math.max(76, Math.min(98, rawX)).toFixed(2)),
      y: Number(Math.max(70, Math.min(96, rawY)).toFixed(2)),
    };
  }

  const rangeX = bounds.maxX - bounds.minX;
  const rangeZ = bounds.maxZ - bounds.minZ;

  const rawX = ((worldX - bounds.minX) / rangeX) * 100;
  const rawY = ((worldZ - bounds.minZ) / rangeZ) * 100;

  const clampedX = Math.max(0, Math.min(100, rawX));
  const clampedY = Math.max(0, Math.min(100, rawY));

  return {
    x: Number(clampedX.toFixed(2)),
    y: Number(clampedY.toFixed(2)),
  };
}

/**
 * Converts 2D map percentage coordinates { x, y } back to 3D world coordinates [x, 0, z].
 */
export function mapToWorldCoordinates(
  mapX: number,
  mapY: number,
  bounds: MapBounds = VARANAYA_MAP_BOUNDS,
): [number, number, number] {
  const rangeX = bounds.maxX - bounds.minX;
  const rangeZ = bounds.maxZ - bounds.minZ;

  const worldX = bounds.minX + (mapX / 100) * rangeX;
  const worldZ = bounds.minZ + (mapY / 100) * rangeZ;

  return [Number(worldX.toFixed(2)), 0, Number(worldZ.toFixed(2))];
}

/**
 * Checks whether the given world coordinates fall within the canonical map bounds.
 */
export function isWithinMapBounds(
  worldX: number,
  worldZ: number,
  bounds: MapBounds = VARANAYA_MAP_BOUNDS,
): boolean {
  return (
    worldX >= bounds.minX && worldX <= bounds.maxX && worldZ >= bounds.minZ && worldZ <= bounds.maxZ
  );
}

/**
 * Calculates straight-line distance in world meters between two 3D positions.
 */
export function distanceInWorldMeters(
  posA: [number, number, number],
  posB: [number, number, number],
): number {
  const dx = posA[0] - posB[0];
  const dy = posA[1] - posB[1];
  const dz = posA[2] - posB[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
