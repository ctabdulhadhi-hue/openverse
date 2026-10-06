import * as THREE from "three";

import type { InteractionTarget } from "./InteractionTypes";

/**
 * Normalizes an interaction target position into a THREE.Vector3.
 */
export function getTargetVector3(
  position: [number, number, number] | THREE.Vector3,
  out = new THREE.Vector3(),
): THREE.Vector3 {
  if (Array.isArray(position)) {
    return out.set(position[0], position[1], position[2]);
  }
  return out.copy(position);
}

/**
 * Computes the formatted prompt string (e.g. "READ SIGN", "OPEN DOOR").
 */
export function formatPromptLabel(target: InteractionTarget): string {
  if (target.promptLabel) {
    return target.promptLabel;
  }
  return `${target.type} ${target.name}`;
}

/**
 * Calculates horizontal distance (ignoring Y difference if small, or full 3D distance).
 */
export function calculateTargetDistance(
  playerPos: THREE.Vector3,
  targetPos: THREE.Vector3,
): number {
  return playerPos.distanceTo(targetPos);
}

/**
 * Calculates cosine of the angle between camera forward and the vector from player to target.
 */
export function calculateFacingCosine(
  playerPos: THREE.Vector3,
  targetPos: THREE.Vector3,
  forwardDir: THREE.Vector3,
): number {
  const toTarget = new THREE.Vector3().subVectors(targetPos, playerPos);
  // Flatten Y slightly so elevated signs are still in cone
  toTarget.y *= 0.5;
  const len = toTarget.length();
  if (len < 0.001) return 1.0;

  toTarget.divideScalar(len);
  return forwardDir.dot(toTarget);
}
