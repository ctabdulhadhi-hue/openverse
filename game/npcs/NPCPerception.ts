import { getShortestAngleDelta, rotateTowards } from "./NPCMovement";

export interface PerceptionResult {
  isPlayerNearby: boolean;
  playerDistance: number;
  angleToPlayer: number;
  relativeLookAngle: number;
}

/**
 * Evaluate NPC perception of player presence.
 */
export function evaluatePlayerPerception(
  npcPos: [number, number, number],
  npcYaw: number,
  playerPos: [number, number, number] | null,
  awarenessRadius: number,
  maxLookAtAngle: number,
): PerceptionResult {
  if (!playerPos) {
    return {
      isPlayerNearby: false,
      playerDistance: Infinity,
      angleToPlayer: npcYaw,
      relativeLookAngle: 0,
    };
  }

  const dx = playerPos[0] - npcPos[0];
  const dz = playerPos[2] - npcPos[2];
  const distance = Math.hypot(dx, dz);

  if (distance > awarenessRadius) {
    return {
      isPlayerNearby: false,
      playerDistance: distance,
      angleToPlayer: npcYaw,
      relativeLookAngle: 0,
    };
  }

  // Angle from NPC to player in world space
  const angleToPlayer = Math.atan2(dx, dz);
  // Relative angle compared to current body yaw
  const relAngle = getShortestAngleDelta(npcYaw, angleToPlayer);

  // Can only turn head if within plausible field of view
  const canLookAt = Math.abs(relAngle) <= maxLookAtAngle;

  return {
    isPlayerNearby: true,
    playerDistance: distance,
    angleToPlayer,
    relativeLookAngle: canLookAt ? relAngle : 0,
  };
}

/**
 * Step head look-at angle smoothly towards desired target.
 */
export function stepLookAtAngle(
  currentHeadAngle: number,
  targetHeadAngle: number,
  headTurnSpeed: number,
  dt: number,
): number {
  return rotateTowards(currentHeadAngle, targetHeadAngle, headTurnSpeed * dt);
}
