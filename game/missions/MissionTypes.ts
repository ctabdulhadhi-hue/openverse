/**
 * Mission System Types and Data Structures for OPENVERSE (Phase 9).
 */

export type MissionState =
  "AVAILABLE" | "OFFERED" | "ACTIVE" | "OBJECTIVE_COMPLETE" | "COMPLETED" | "FAILED" | "ABANDONED";

export type MissionCategory = "MAIN" | "SIDE" | "ACTIVITIES" | "FACTION";

export type ObjectiveType = "TALK" | "REACH" | "INTERACT" | "OBSERVE";

export interface MissionPrerequisite {
  type: "FLAG" | "MISSION_COMPLETED" | "LEVEL";
  key: string;
  expectedValue?: boolean | string | number;
}

export interface MissionRewards {
  xp: number;
  flags?: Record<string, boolean | string | number>;
  currency?: number;
  metadata?: Record<string, unknown>;
}

export interface MissionObjectiveTarget {
  /** Target world coordinates [x, y, z] for REACH objectives */
  position?: [number, number, number];
  /** Interaction radius threshold in meters (default ~4.0m) */
  radius?: number;
  /** Target NPC ID for TALK objectives (e.g. 'npc-maya') */
  npcId?: string;
  /** Target interactable ID for INTERACT objectives (e.g. 'door-westport-outpost') */
  interactableId?: string;
  /** Optional chunk key where target is located (for streaming awareness) */
  chunkKey?: string;
}

export interface MissionObjectiveDefinition {
  id: string;
  type: ObjectiveType;
  title: string;
  description: string;
  target?: MissionObjectiveTarget;
  requiredCount?: number;
  optional?: boolean;
  metadata?: Record<string, unknown>;
}

export interface MissionObjectiveRuntimeState {
  id: string;
  completed: boolean;
  currentCount: number;
  requiredCount: number;
}

export interface MissionDefinition {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  category: MissionCategory;
  giverNpcId: string;
  objectives: MissionObjectiveDefinition[];
  prerequisites?: MissionPrerequisite[];
  rewards: MissionRewards;
  metadata?: Record<string, unknown>;
}

export interface MissionRuntimeInstance {
  id: string;
  definition: MissionDefinition;
  state: MissionState;
  currentObjectiveIndex: number;
  objectives: MissionObjectiveRuntimeState[];
  startTime?: number;
  endTime?: number;
  tracked: boolean;
}

export type MissionEventType =
  | "MISSION_OFFERED"
  | "MISSION_STARTED"
  | "OBJECTIVE_STARTED"
  | "OBJECTIVE_COMPLETED"
  | "MISSION_COMPLETED"
  | "MISSION_FAILED"
  | "MISSION_ABANDONED"
  | "MISSION_TRACKED";

export interface MissionEvent {
  type: MissionEventType;
  missionId: string;
  objectiveId?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface MissionSnapshot {
  activeMissions: MissionRuntimeInstance[];
  completedMissions: string[];
  failedMissions: string[];
  availableMissions: string[];
  trackedMissionId: string | null;
  lastEvent: MissionEvent | null;
}
