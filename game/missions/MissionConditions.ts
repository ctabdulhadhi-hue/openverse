import { dialogueFlagStore, type DialogueFlagStore } from "@/game/dialogue";

import type { MissionPrerequisite } from "./MissionTypes";

/**
 * Checks if a set of prerequisites are met given current game state.
 */
export function arePrerequisitesMet(
  prerequisites: MissionPrerequisite[] | undefined,
  completedMissions: Set<string>,
  flagStore: DialogueFlagStore = dialogueFlagStore,
): boolean {
  if (!prerequisites || prerequisites.length === 0) {
    return true;
  }

  for (const prereq of prerequisites) {
    switch (prereq.type) {
      case "FLAG": {
        const flagVal = flagStore.getFlag(prereq.key);
        if (prereq.expectedValue !== undefined) {
          if (flagVal !== prereq.expectedValue) return false;
        } else {
          // Defaults to truthy check
          if (!flagVal) return false;
        }
        break;
      }

      case "MISSION_COMPLETED": {
        if (!completedMissions.has(prereq.key)) {
          return false;
        }
        break;
      }

      case "LEVEL": {
        // Reserved for Phase 21 Progression
        break;
      }
    }
  }

  return true;
}
