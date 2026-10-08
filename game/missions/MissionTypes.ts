/**
 * Mission System Types and Data Structures for OPENVERSE (Phase 9).
 * "Stories Begin in Varanaya"
 */

export type MissionState =
  | "LOCKED"
  | "AVAILABLE"
  | "OFFERED"
  | "ACCEPTED"
  | "ACTIVE"
  | "PAUSED"
  | "OBJECTIVE_COMPLETE"
  | "COMPLETED"
  | "FAILED"
  | "DECLINED"
  | "ABANDONED";

export type MissionCategory = "MAIN" | "SIDE" | "ACTIVITIES" | "FACTION";

export type ObjectiveType =
  | "TALK_TO_NPC"
  | "INTERACT"
  | "GO_TO_LOCATION"
  | "COLLECT"
  | "DELIVER"
  | "ESCORT"
  | "WAIT"
  | "CHOICE"
  | "COMPLETE"
  | "TALK" // Backwards compatible alias for TALK_TO_NPC
  | "REACH" // Backwards compatible alias for GO_TO_LOCATION
  | "OBSERVE";

export type ObjectiveState = "LOCKED" | "AVAILABLE" | "ACTIVE" | "COMPLETED" | "FAILED";

export interface MissionChoice {
  id: string;
  text: string;
  nextNodeId?: string;
  outcome?: Record<string, unknown>;
}

export interface MissionCondition {
  type:
    | "FLAG"
    | "MISSION_COMPLETED"
    | "MISSION_ACTIVE"
    | "MISSION_FAILED"
    | "DIALOGUE_FLAG"
    | "INTERACTION_COMPLETED"
    | "LOCATION_REACHED"
    | "ITEM_EXISTS"
    | "LEVEL";
  key: string;
  expectedValue?: boolean | string | number;
}

export type MissionPrerequisite = MissionCondition;

export interface MissionRewardItem {
  id: string;
  name: string;
  quantity: number;
  icon?: string;
}

export interface MissionRewards {
  xp: number;
  currency?: number;
  items?: MissionRewardItem[];
  flags?: Record<string, boolean | string | number>;
  unlockMissions?: string[];
  metadata?: Record<string, unknown>;
}

export interface MissionObjectiveTarget {
  /** Target world coordinates [x, y, z] for GO_TO_LOCATION / REACH objectives */
  position?: [number, number, number];
  /** Interaction / proximity radius threshold in meters (default ~4.0m) */
  radius?: number;
  /** Target NPC ID for TALK_TO_NPC / TALK objectives (e.g. 'npc-maya', 'npc-samuel') */
  npcId?: string;
  /** Target interactable ID for INTERACT / COLLECT objectives (e.g. 'crate-waterfront-supplies') */
  interactableId?: string;
  /** Target item ID for COLLECT / DELIVER objectives */
  itemId?: string;
  /** Target location identifier */
  locationId?: string;
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
  choices?: MissionChoice[];
  metadata?: Record<string, unknown>;
}

export interface MissionObjectiveRuntimeState {
  id: string;
  state: ObjectiveState;
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
  | "MISSION_ACCEPTED"
  | "MISSION_DECLINED"
  | "MISSION_STARTED"
  | "MISSION_PAUSED"
  | "MISSION_RESUMED"
  | "OBJECTIVE_STARTED"
  | "OBJECTIVE_COMPLETED"
  | "MISSION_COMPLETED"
  | "MISSION_FAILED"
  | "MISSION_ABANDONED"
  | "MISSION_TRACKED"
  | "MISSION_REWARD_GRANTED"
  | "MISSION_UNLOCKED";

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
  declinedMissions: string[];
  trackedMissionId: string | null;
  lastEvent: MissionEvent | null;
}
