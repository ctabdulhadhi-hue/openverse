import type { MissionObjectiveDefinition, MissionObjectiveRuntimeState } from "./MissionTypes";

/**
 * Calculates Euclidean distance in horizontal (XZ) plane between two 3D positions.
 */
export function calculateHorizontalDistance(
  posA: [number, number, number],
  posB: [number, number, number],
): number {
  const dx = posA[0] - posB[0];
  const dz = posA[2] - posB[2];
  return Math.hypot(dx, dz);
}

/**
 * Formats a metric distance in meters or kilometers.
 */
export function formatObjectiveDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  const km = (Math.round(distanceMeters / 100) / 10).toFixed(1);
  return `${km} km`;
}

/**
 * Formats an objective line for HUD checklist.
 */
export function formatObjectiveChecklistText(
  def: MissionObjectiveDefinition,
  runtime?: MissionObjectiveRuntimeState,
): string {
  if (def.requiredCount && def.requiredCount > 1) {
    const current = runtime?.currentCount ?? 0;
    return `${def.title} (${current}/${def.requiredCount})`;
  }
  return def.title;
}
