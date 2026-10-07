/**
 * NPC Movement Utilities for OPENVERSE (Phase 7).
 */

/**
 * Normalize an angle in radians to [-PI, PI].
 */
export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Compute the shortest angular delta from current to target angle in radians.
 */
export function getShortestAngleDelta(current: number, target: number): number {
  return normalizeAngle(target - current);
}

/**
 * Smoothly step an angle towards target using maximum angular speed.
 */
export function rotateTowards(current: number, target: number, maxRadiansDelta: number): number {
  const delta = getShortestAngleDelta(current, target);
  if (Math.abs(delta) <= maxRadiansDelta) {
    return normalizeAngle(target);
  }
  return normalizeAngle(current + Math.sign(delta) * maxRadiansDelta);
}

export interface MovementUpdateResult {
  newPosition: [number, number, number];
  newYaw: number;
  hasArrived: boolean;
  actualSpeed: number;
}

/**
 * Step NPC movement towards a destination waypoint.
 */
export function stepMovement(
  currentPos: [number, number, number],
  targetPos: [number, number, number],
  currentYaw: number,
  targetSpeed: number,
  turnSpeed: number,
  arrivalThreshold: number,
  dt: number,
): MovementUpdateResult {
  const dx = targetPos[0] - currentPos[0];
  const dz = targetPos[2] - currentPos[2];
  const distance = Math.hypot(dx, dz);

  if (distance <= arrivalThreshold) {
    return {
      newPosition: [currentPos[0], targetPos[1], currentPos[2]],
      newYaw: currentYaw,
      hasArrived: true,
      actualSpeed: 0,
    };
  }

  // Calculate target facing angle (Three.js convention: facing -Z is yaw=0, +X is yaw = -PI/2 or Math.atan2(dx, dz))
  const targetYaw = Math.atan2(dx, dz);
  const newYaw = rotateTowards(currentYaw, targetYaw, turnSpeed * dt);

  // Slow down slightly if facing away from target direction for natural turning
  const angleDiff = Math.abs(getShortestAngleDelta(newYaw, targetYaw));
  const turnPenalty = Math.max(0.2, Math.cos(angleDiff));

  // Also decelerate when approaching destination within 1.5m
  const arrivalFactor = Math.min(1.0, distance / 1.5);
  const effectiveSpeed = targetSpeed * turnPenalty * arrivalFactor;

  const moveDist = Math.min(distance, effectiveSpeed * dt);
  const moveRatio = moveDist / distance;

  const newX = currentPos[0] + dx * moveRatio;
  const newZ = currentPos[2] + dz * moveRatio;
  const newY = currentPos[1] + (targetPos[1] - currentPos[1]) * moveRatio;

  return {
    newPosition: [newX, newY, newZ],
    newYaw,
    hasArrived: moveDist >= distance,
    actualSpeed: effectiveSpeed,
  };
}
