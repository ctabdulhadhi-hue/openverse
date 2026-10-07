/**
 * NPC State Machine Types and Definitions for OPENVERSE (Phase 7).
 */

export type NPCStateType =
  | "SPAWNING"
  | "IDLE"
  | "WALKING"
  | "WAITING"
  | "DESPAWNING"
  // Future-ready AI states
  | "TALKING"
  | "FLEEING"
  | "FOLLOWING"
  | "WORKING"
  | "PATROLLING";

export interface NPCStateSnapshot {
  state: NPCStateType;
  timeInState: number;
  stateDuration: number;
  isAcknowledgingPlayer: boolean;
}
