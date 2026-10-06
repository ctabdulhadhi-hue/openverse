/**
 * Simple seeded pseudo-random number generator for deterministic procedural placement
 * of trees, street furniture, and rocks across client runs.
 */
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Computes 2D Euclidean distance on the horizontal plane.
 */
export function horizontalDistance(
  posA: [number, number, number],
  posB: [number, number, number],
): number {
  return Math.hypot(posA[0] - posB[0], posA[2] - posB[2]);
}

/**
 * Deterministic integer coordinate hash combining a seed with 2D chunk coordinates.
 * Generates an avalanche-quality seed suitable for seededRandom per chunk.
 */
export function hashCoords(seed: number, x: number, z: number): number {
  let h = (seed ^ (x * 374761393) ^ (z * 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}
