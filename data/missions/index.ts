import { missionManager } from "@/game/missions/MissionManager";

import { VARANAYA_SMALL_FAVOR } from "./varanayaSmallFavor";
import { WESTPORT_FIRST_DELIVERY } from "./westportDelivery";

export * from "./varanayaSmallFavor";
export * from "./westportDelivery";

export const INITIAL_MISSIONS = [VARANAYA_SMALL_FAVOR, WESTPORT_FIRST_DELIVERY];

/**
 * Registers all default data-driven missions into the central MissionManager.
 */
export function registerAllMissions(): void {
  for (const mission of INITIAL_MISSIONS) {
    // Only register if not already registered
    if (!missionManager.getMission(mission.id)) {
      missionManager.registerMission(mission);
    }
  }
}
