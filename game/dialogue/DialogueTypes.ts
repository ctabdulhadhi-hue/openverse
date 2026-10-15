/**
 * Dialogue System Types and Data Structures for OPENVERSE (Phase 8).
 */

export type DialogueNodeType = "TEXT" | "CHOICE" | "END" | "CONDITION" | "EVENT" | "ACTION";

export type DialogueStatus =
  "INACTIVE" | "STARTING" | "ACTIVE" | "WAITING_FOR_CHOICE" | "ENDING" | "ENDED";

export type DialogueValue = boolean | string | number;

/**
 * Condition definition for branching prerequisites.
 */
export interface DialogueCondition {
  type:
    | "hasFlag"
    | "dialogueFlag"
    | "always"
    | "missionActive"
    | "missionCompleted"
    | "objectiveCompleted"
    | "objectiveActive"
    | "missionDeclined"
    | "missionFailed"
    | "missionAvailable"
    | "locationDiscovered";
  flagKey?: string;
  expectedValue?: DialogueValue;
  missionId?: string;
  objectiveId?: string;
  locationId?: string;
}

/**
 * Effect definition executed upon entering a node or selecting a choice.
 */
export type DialogueEffect =
  | {
      type: "setFlag";
      flagKey: string;
      value: DialogueValue;
    }
  | {
      type: "startMission";
      missionId: string;
    }
  | {
      type: "declineMission";
      missionId: string;
    }
  | {
      type: "completeMission";
      missionId: string;
    }
  | {
      type: "completeObjective";
      missionId: string;
      objectiveId?: string;
    };

/**
 * Interactive player response choice.
 */
export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string;
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
}

/**
 * Individual dialogue node in a conversation tree.
 */
export interface DialogueNode {
  id: string;
  speaker: string;
  speakerRole?: string;
  text: string;
  type: DialogueNodeType;
  nextNodeId?: string;
  choices?: DialogueChoice[];
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
}

/**
 * Complete data-driven dialogue conversation tree.
 */
export interface DialogueConversation {
  id: string;
  npcId: string;
  title?: string;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

/**
 * Runtime snapshot of the dialogue engine.
 */
export interface DialogueRuntimeSnapshot {
  status: DialogueStatus;
  conversationId: string | null;
  npcId: string | null;
  speakerName: string | null;
  speakerRole: string | null;
  currentNodeId: string | null;
  currentNode: DialogueNode | null;
  availableChoices: DialogueChoice[];
  selectedChoiceIndex: number;
  history: string[];
}
