/**
 * NPC Configuration and Tuning Parameters for OPENVERSE (Phase 7).
 */

export interface NPCSystemConfig {
  /** Default walking speed in m/s (~1.4 - 1.8 m/s for natural human pace) */
  defaultWalkSpeed: number;
  /** Turn rate in radians per second for smooth orientation changes */
  turnSpeed: number;
  /** Head turn rate in radians per second when acknowledging player */
  headTurnSpeed: number;
  /** Idle duration range [min, max] in seconds before choosing a new destination */
  idleDurationRange: [number, number];
  /** Waiting duration range [min, max] in seconds after reaching a waypoint */
  waitDurationRange: [number, number];
  /** Player awareness radius in meters to initiate look-at / acknowledgment */
  playerAwarenessRadius: number;
  /** Max look-at angle from forward heading in radians (~80 degrees) */
  playerLookAtMaxAngle: number;
  /** Interaction range in meters for [E] TALK prompt registration */
  interactionRange: number;
  /** Simulation LOD distances (meters from player) */
  simulationTiers: {
    nearDistance: number;
    midDistance: number;
    farDistance: number;
    unloadedDistance: number;
  };
  /** Arrival threshold in meters to consider destination reached */
  arrivalThreshold: number;
}

export const DEFAULT_NPC_CONFIG: NPCSystemConfig = {
  defaultWalkSpeed: 1.6,
  turnSpeed: 3.5,
  headTurnSpeed: 5.0,
  idleDurationRange: [2.5, 5.0],
  waitDurationRange: [2.0, 4.5],
  playerAwarenessRadius: 7.0,
  playerLookAtMaxAngle: Math.PI * 0.45,
  interactionRange: 3.2,
  simulationTiers: {
    nearDistance: 25,
    midDistance: 60,
    farDistance: 120,
    unloadedDistance: 150,
  },
  arrivalThreshold: 0.35,
};
