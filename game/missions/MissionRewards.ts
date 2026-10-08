import { dialogueFlagStore, type DialogueFlagStore } from "@/game/dialogue";

import type { MissionRewardItem, MissionRewards } from "./MissionTypes";

export interface RewardApplicationResult {
  xpAwarded: number;
  flagsSet: Record<string, boolean | string | number>;
  currencyAwarded: number;
  itemsAwarded: MissionRewardItem[];
  unlockedMissions: string[];
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
    itemsAwarded: rewards.items ?? [],
    unlockedMissions: rewards.unlockMissions ?? [],
  };

  if (rewards.flags) {
    for (const [key, value] of Object.entries(rewards.flags)) {
      flagStore.setFlag(key, value);
      result.flagsSet[key] = value;
    }
  }

  // Record item acquisition in flag store for future inventory/progression integration
  if (rewards.items) {
    for (const item of rewards.items) {
      flagStore.setFlag(`item_${item.id}_obtained`, true);
      flagStore.setFlag(`item_${item.id}_quantity`, item.quantity);
    }
  }

  // Record mission unlocks in flag store
  if (rewards.unlockMissions) {
    for (const unlockedId of rewards.unlockMissions) {
      flagStore.setFlag(`mission_${unlockedId}_unlocked`, true);
    }
  }

  return result;
}
