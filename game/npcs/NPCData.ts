import type { NPCAppearance, NPCBehavior, NPCType } from "./NPCType";

/**
 * Axis-aligned bounding box for obstacle and forbidden building zones.
 */
export interface ObstacleBox {
  min: [number, number, number];
  max: [number, number, number];
}

/**
 * Spawn zone definition for geographic placement and wandering constraint.
 */
export interface NPCSpawnZone {
  id: string;
  name: string;
  center: [number, number, number];
  radius: number;
  allowedTypes: NPCType[];
  forbiddenBoxes?: ObstacleBox[];
}

/**
 * Complete definition for a deterministic NPC entity.
 */
export interface NPCDefinition {
  id: string;
  type: NPCType;
  name: string;
  title?: string;
  spawnZoneId: string;
  basePosition: [number, number, number];
  baseRotation: number;
  behavior: NPCBehavior;
  walkSpeed: number;
  seed: number;
  dialogueText: string;
  appearance: NPCAppearance;
  chunkKey: string;
}
