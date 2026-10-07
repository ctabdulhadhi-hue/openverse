import { registerAllMissions } from "@/data/missions";
import { dialogueEventBus } from "@/game/dialogue/DialogueEvents";
import { interactionEventBus } from "@/game/interaction/InteractionEvents";

import { missionEventBus } from "./MissionEvents";
import { missionManager } from "./MissionManager";
import { missionStore } from "./MissionStore";
import type { MissionEvent } from "./MissionTypes";

export type MissionNotificationHandler = (notification: {
  title: string;
  subtitle: string;
  type: "mission";
}) => void;

let isInitialized = false;
let notificationHandler: MissionNotificationHandler | null = null;
const unsubscribers: (() => void)[] = [];

/**
 * Initializes the mission system, registers data-driven missions,
 * and links dialogue & interaction event listeners.
 */
export function initMissionSystem(onNotification?: MissionNotificationHandler): void {
  if (onNotification) {
    notificationHandler = onNotification;
  }

  if (isInitialized) return;
  isInitialized = true;

  // 1. Register all game missions
  registerAllMissions();

  if (typeof window !== "undefined") {
    (
      window as unknown as { __OPENVERSE_MISSION_MANAGER__: typeof missionManager }
    ).__OPENVERSE_MISSION_MANAGER__ = missionManager;
    (
      window as unknown as { __OPENVERSE_MISSION_STORE__: typeof missionStore }
    ).__OPENVERSE_MISSION_STORE__ = missionStore;
  }

  // 2. Listen to dialogue events (TALK objective completion)
  const unsubDialogue = dialogueEventBus.subscribe((event) => {
    if (event.type === "dialogue_ended" && event.npcId) {
      missionManager.handleDialogueCompleted(event.npcId);
    }
  });
  unsubscribers.push(unsubDialogue);

  // 3. Listen to interaction events (INTERACT objective completion)
  const unsubInteract = interactionEventBus.subscribe((event) => {
    if (event.type === "interaction_completed" && event.target?.id) {
      missionManager.handleInteraction(event.target.id);
    }
  });
  unsubscribers.push(unsubInteract);

  // 4. Listen to mission lifecycle events for notifications
  const unsubMission = missionEventBus.subscribe((event: MissionEvent) => {
    if (!notificationHandler) return;

    if (event.type === "MISSION_STARTED") {
      const def = missionManager.getMission(event.missionId);
      notificationHandler({
        title: "MISSION STARTED",
        subtitle: def?.title ?? "New Mission",
        type: "mission",
      });
    } else if (event.type === "OBJECTIVE_COMPLETED") {
      const def = missionManager.getMission(event.missionId);
      const objDef = def?.objectives.find((o) => o.id === event.objectiveId);
      notificationHandler({
        title: "OBJECTIVE COMPLETED",
        subtitle: objDef?.title ?? "Objective Complete",
        type: "mission",
      });
    } else if (event.type === "MISSION_COMPLETED") {
      const def = missionManager.getMission(event.missionId);
      notificationHandler({
        title: "MISSION COMPLETED",
        subtitle: `${def?.title ?? "Mission"} · +${def?.rewards.xp ?? 100} XP`,
        type: "mission",
      });
    }
  });
  unsubscribers.push(unsubMission);
}

/**
 * Cleanup / reset listeners for hot-reloading or unit testing.
 */
export function cleanupMissionSystem(): void {
  for (const unsub of unsubscribers) {
    unsub();
  }
  unsubscribers.length = 0;
  isInitialized = false;
  notificationHandler = null;
}
