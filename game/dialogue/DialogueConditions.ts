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

    case "hasFlag":
      if (!condition.flagKey) return true;
      return flagStore.hasFlag(condition.flagKey, condition.expectedValue);

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
