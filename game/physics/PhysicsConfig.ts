export interface PlayerPhysicsConfig {
  mass: number;
  gravityScale: number;
  capsuleRadius: number;
  capsuleHalfHeight: number;
  jumpVelocity: number;
  maxFallSpeed: number;
  airControl: number;
  groundCheckDistance: number;
  linearDamping: number;
  respawnY: number;
  spawnPosition: [number, number, number];
}

/**
 * Centralized player physics configuration for OPENVERSE.
 * Capsule dimensions:
 *   radius: 0.35m
 *   halfHeight: 0.55m
 * Total humanoid height = 2 * halfHeight + 2 * radius = 1.10m + 0.70m = 1.80m.
 */
export const PLAYER_PHYSICS: PlayerPhysicsConfig = {
  mass: 70,
  gravityScale: 1,
  capsuleRadius: 0.35,
  capsuleHalfHeight: 0.55,
  jumpVelocity: 6.5, // Produces natural ~1.8m vertical leap
  maxFallSpeed: 25, // Terminal falling velocity (m/s)
  airControl: 0.35, // 35% horizontal movement authority while airborne
  groundCheckDistance: 0.25, // Raycast tolerance below capsule base (m)
  linearDamping: 0.2,
  respawnY: -20, // Void boundary triggering safe respawn
  spawnPosition: [0, 1.2, 8], // Spawn in Westport Town Square facing North
};

export interface WorldPhysicsConfig {
  gravity: [number, number, number];
  timeStep: number | "vary";
  interpolate: boolean;
  debug: boolean;
}

export const DEFAULT_PHYSICS_CONFIG: WorldPhysicsConfig = {
  gravity: [0, -9.81, 0],
  timeStep: 1 / 60,
  interpolate: true,
  debug: false,
};
