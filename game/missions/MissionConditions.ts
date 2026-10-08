import { dialogueFlagStore, type DialogueFlagStore } from "@/game/dialogue";

import type { MissionCondition } from "./MissionTypes";

/**
 * Evaluates whether a single mission condition is met against current game state.
 */
export function evaluateMissionCondition(
  condition: MissionCondition,
  completedMissions: Set<string>,
  activeMissions: Set<string> = new Set(),
  flagStore: DialogueFlagStore = dialogueFlagStore,
): boolean {
  switch (condition.type) {
    case "FLAG":
    case "DIALOGUE_FLAG": {
      const flagVal = flagStore.getFlag(condition.key);
      if (condition.expectedValue !== undefined) {
        return flagVal === condition.expectedValue;
      }
      return Boolean(flagVal);
    }

    case "MISSION_COMPLETED": {
      return completedMissions.has(condition.key);
    }

    case "MISSION_ACTIVE": {
      return activeMissions.has(condition.key);
    }

    case "MISSION_FAILED": {
      return false;
    }

    case "INTERACTION_COMPLETED": {
      return (
        flagStore.getFlag(`interaction_${condition.key}_completed`) === true ||
        flagStore.getFlag(`interact_${condition.key}`) === true ||
        flagStore.getFlag(condition.key) === true
      );
    }

    case "LOCATION_REACHED": {
      return (
        flagStore.getFlag(`location_${condition.key}_discovered`) === true ||
        flagStore.getFlag(`location_${condition.key}`) === true ||
        flagStore.getFlag(condition.key) === true
      );
    }

    case "ITEM_EXISTS": {
      return (
        flagStore.getFlag(`item_${condition.key}_obtained`) === true ||
        flagStore.getFlag(`item_${condition.key}`) === true ||
        flagStore.getFlag(condition.key) === true
      );
    }

    case "LEVEL": {
      // Reserved for Phase 21 Progression
      return true;
    }

    default:
      return true;
  }
}

/**
 * Checks if a set of prerequisites/conditions are met given current game state.
 */
export function arePrerequisitesMet(
  prerequisites: MissionCondition[] | undefined,
  completedMissions: Set<string>,
  flagStore: DialogueFlagStore = dialogueFlagStore,
  activeMissions: Set<string> = new Set(),
): boolean {
  if (!prerequisites || prerequisites.length === 0) {
    return true;
  }

  return prerequisites.every((cond) =>
    evaluateMissionCondition(cond, completedMissions, activeMissions, flagStore),
  );
}
