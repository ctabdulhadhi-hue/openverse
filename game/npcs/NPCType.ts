/**
 * Core NPC Types and Enumerations for OPENVERSE (Phase 7).
 */

export type NPCType = "CIVILIAN" | "WORKER" | "TRAVELER" | "GUARD";

export type NPCBehavior = "IDLE" | "WANDER" | "PATROL" | "FOLLOW" | "FLEE";

export type NPCSimulationTier = "NEAR" | "MID" | "FAR" | "UNLOADED";

export interface NPCAppearance {
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  skinColor: string;
  hairColor: string;
  hasHat: boolean;
  hatColor?: string;
  hasBackpack: boolean;
  backpackColor?: string;
  heightScale: number;
  widthScale: number;
}
