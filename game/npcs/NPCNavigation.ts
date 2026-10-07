import type { NPCSpawnZone, ObstacleBox } from "./NPCData";

/**
 * Deterministic PRNG using Mulberry32 algorithm.
 * Generates pseudo-random floats in [0, 1) based on a 32-bit integer seed.
 */
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Check if a 2D/3D position falls inside an axis-aligned obstacle box.
 */
export function isInsideObstacle(
  x: number,
  z: number,
  obstacles?: ObstacleBox[],
  margin = 0.8,
): boolean {
  if (!obstacles || obstacles.length === 0) return false;

  for (const box of obstacles) {
    if (
      x >= box.min[0] - margin &&
      x <= box.max[0] + margin &&
      z >= box.min[2] - margin &&
      z <= box.max[2] + margin
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Sample a deterministic, valid waypoint destination within a spawn zone.
 * Rejects destinations that fall inside forbidden building boxes or outside zone radius.
 */
export function sampleZoneDestination(
  zone: NPCSpawnZone,
  seed: number,
  stepIndex: number,
  currentPos: [number, number, number],
  minTravelDistance = 2.5,
): [number, number, number] {
  // Combine base seed and step index deterministically
  const combinedSeed = (seed * 1664525 + stepIndex * 1013904223) | 0;
  const rng = mulberry32(combinedSeed);

  const maxAttempts = 12;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Sample angle uniformly in [0, 2*PI)
    const angle = rng() * Math.PI * 2;
    // Sample radius with square root distribution for uniform circular disk coverage
    const r = Math.sqrt(rng()) * zone.radius;

    const candX = zone.center[0] + Math.cos(angle) * r;
    const candZ = zone.center[2] + Math.sin(angle) * r;
    const candY = zone.center[1];

    // Check distance from current position
    const dx = candX - currentPos[0];
    const dz = candZ - currentPos[2];
    const dist = Math.hypot(dx, dz);

    if (dist < minTravelDistance) {
      continue;
    }

    // Check obstacle boundaries
    if (isInsideObstacle(candX, candZ, zone.forbiddenBoxes)) {
      continue;
    }

    return [candX, candY, candZ];
  }

  // Fallback: slight deterministic offset from zone center if all attempts rejected
  const fallbackAngle = (stepIndex * 1.37) % (Math.PI * 2);
  const fallbackR = Math.min(zone.radius * 0.4, 4.0);
  return [
    zone.center[0] + Math.cos(fallbackAngle) * fallbackR,
    zone.center[1],
    zone.center[2] + Math.sin(fallbackAngle) * fallbackR,
  ];
}
