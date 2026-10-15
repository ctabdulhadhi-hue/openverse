import { discoveryStore } from "@/game/discovery";
import { missionStore } from "@/game/missions/MissionStore";

import type { DialogueFlagStore } from "./DialogueFlags";
import type { DialogueChoice, DialogueCondition } from "./DialogueTypes";

/**
 * Evaluate if a single dialogue condition is met.
 */
export function evaluateDialogueCondition(
  condition: DialogueCondition,
  flagStore: DialogueFlagStore,
): boolean {
  switch (condition.type) {
    case "always":
      return true;

    case "locationDiscovered":
      if (!condition.locationId) return false;
      return discoveryStore.isDiscovered(condition.locationId);

    case "hasFlag":
    case "dialogueFlag":
      if (!condition.flagKey) return true;
      return flagStore.hasFlag(condition.flagKey, condition.expectedValue);

    case "missionActive":
      if (!condition.missionId) return false;
      return missionStore.isMissionActive(condition.missionId);

    case "missionCompleted":
      if (!condition.missionId) return false;
      return missionStore.isMissionCompleted(condition.missionId);

    case "missionFailed": {
      if (!condition.missionId) return false;
      const snapshot = missionStore.getSnapshot();
      return snapshot.failedMissions.includes(condition.missionId);
    }

    case "missionAvailable": {
      if (!condition.missionId) return false;
      const available = missionStore.getAvailableMissions();
      return (
        available.includes(condition.missionId) &&
        !missionStore.isMissionActive(condition.missionId) &&
        !missionStore.isMissionCompleted(condition.missionId)
      );
    }

    case "objectiveCompleted": {
      if (!condition.missionId || !condition.objectiveId) return false;
      const instance = missionStore.getInstance(condition.missionId);
      if (!instance) {
        return missionStore.isMissionCompleted(condition.missionId);
      }
      const objState = instance.objectives.find((o) => o.id === condition.objectiveId);
      return objState?.completed ?? false;
    }

    case "objectiveActive": {
      if (!condition.missionId || !condition.objectiveId) return false;
      const instance = missionStore.getInstance(condition.missionId);
      if (!instance || instance.state !== "ACTIVE") return false;
      const currentObj = instance.definition.objectives[instance.currentObjectiveIndex];
      return currentObj?.id === condition.objectiveId;
    }

    case "missionDeclined": {
      if (!condition.missionId) return false;
      return missionStore.isMissionDeclined(condition.missionId);
    }

    default:
      return true;
  }
}

/**
 * Filter an array of choices to only those whose conditions are satisfied.
 */
export function filterAvailableChoices(
  choices: DialogueChoice[] | undefined,
  flagStore: DialogueFlagStore,
): DialogueChoice[] {
  if (!choices || choices.length === 0) return [];

  return choices.filter((choice) => {
    if (!choice.conditions || choice.conditions.length === 0) {
      return true;
    }
    return choice.conditions.every((cond) => evaluateDialogueCondition(cond, flagStore));
  });
}
