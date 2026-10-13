import { missionManager } from "@/game/missions/MissionManager";

import { LAGOON_MISSIONS } from "./lagoonIslandMissions";
import { VARANAYA_GARDEN_WHISPERS } from "./varanayaGardenWhispers";
import { VARANAYA_HARBOR_LIGHTS } from "./varanayaHarborLights";
import { VARANAYA_MISSING_LEDGER } from "./varanayaMissingLedger";
import { VARANAYA_SMALL_FAVOR } from "./varanayaSmallFavor";
import { WESTPORT_FIRST_DELIVERY } from "./westportDelivery";

export * from "./lagoonIslandMissions";
export * from "./varanayaGardenWhispers";
export * from "./varanayaHarborLights";
export * from "./varanayaMissingLedger";
export * from "./varanayaSmallFavor";
export * from "./westportDelivery";

export const INITIAL_MISSIONS = [
  VARANAYA_SMALL_FAVOR,
  VARANAYA_MISSING_LEDGER,
  VARANAYA_HARBOR_LIGHTS,
  VARANAYA_GARDEN_WHISPERS,
  WESTPORT_FIRST_DELIVERY,
  ...LAGOON_MISSIONS,
];

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
