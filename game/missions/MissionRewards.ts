import { dialogueFlagStore, type DialogueFlagStore } from "@/game/dialogue";

import type { MissionRewards } from "./MissionTypes";

export interface RewardApplicationResult {
  xpAwarded: number;
  flagsSet: Record<string, boolean | string | number>;
  currencyAwarded: number;
}

/**
 * Apply rewards granted upon completing a mission.
 */
export function applyMissionRewards(
  rewards: MissionRewards,
  flagStore: DialogueFlagStore = dialogueFlagStore,
): RewardApplicationResult {
  const result: RewardApplicationResult = {
    xpAwarded: rewards.xp ?? 0,
    flagsSet: {},
    currencyAwarded: rewards.currency ?? 0,
  };

  if (rewards.flags) {
    for (const [key, value] of Object.entries(rewards.flags)) {
      flagStore.setFlag(key, value);
      result.flagsSet[key] = value;
    }
  }

  return result;
}
