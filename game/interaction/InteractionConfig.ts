import * as THREE from "three";

export interface InteractionConfig {
  /** Maximum distance in meters beyond which candidates are not evaluated */
  maxDetectionDistance: number;

  /** Default interaction range when not specified by target */
  defaultInteractionRange: number;

  /** Half-angle of the forward-facing detection cone in degrees */
  detectionAngleDeg: number;

  /** Cosine of the half-angle threshold (cached for fast vector dot products) */
  detectionAngleCos: number;

  /** Height offset for player raycast origin (approximate chest/eye level) */
  playerRaycastHeight: number;

  /** Height offset for target center evaluation */
  targetRaycastHeight: number;

  /** Primary keyboard key code to trigger interaction */
  interactionKeyCode: string;

  /** Cooldown in milliseconds between successive interaction triggers */
  cooldownMs: number;
}

export const DEFAULT_INTERACTION_CONFIG: InteractionConfig = {
  maxDetectionDistance: 7.0,
  defaultInteractionRange: 3.5,
  detectionAngleDeg: 65,
  detectionAngleCos: Math.cos(THREE.MathUtils.degToRad(65)),
  playerRaycastHeight: 1.2,
  targetRaycastHeight: 0.8,
  interactionKeyCode: "KeyE",
  cooldownMs: 250,
};
