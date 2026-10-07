import { arePrerequisitesMet } from "./MissionConditions";
import { missionEventBus, type MissionEventBus } from "./MissionEvents";
import { missionRegistry, type MissionRegistry } from "./MissionRegistry";
import { applyMissionRewards } from "./MissionRewards";
import { missionStore, type MissionStore } from "./MissionStore";
import type {
  MissionDefinition,
  MissionObjectiveRuntimeState,
  MissionRuntimeInstance,
} from "./MissionTypes";

/**
 * MissionManager.
 *
 * Central coordinator for mission registration, progression, event dispatching,
 * objective verification, and reward distribution.
 */
export class MissionManager {
  private registry: MissionRegistry;
  private store: MissionStore;
  private eventBus: MissionEventBus;

  constructor(
    registry: MissionRegistry = missionRegistry,
    store: MissionStore = missionStore,
    eventBus: MissionEventBus = missionEventBus,
  ) {
    this.registry = registry;
    this.store = store;
    this.eventBus = eventBus;
    this.store.setRegistry(registry);
  }

  public registerMission(definition: MissionDefinition): void {
    this.registry.register(definition);
    this.refreshAvailableMissions();
  }

  public getMission(id: string): MissionDefinition | undefined {
    return this.registry.get(id);
  }

  public getAllMissions(): MissionDefinition[] {
    return this.registry.getAll();
  }

  public isMissionActive(id: string): boolean {
    return this.store.isMissionActive(id);
  }

  public isMissionCompleted(id: string): boolean {
    return this.store.isMissionCompleted(id);
  }

  /**
   * Recalculates which registered missions satisfy prerequisites and are available to be offered.
   */
  public refreshAvailableMissions(): string[] {
    const all = this.registry.getAll();
    const completedSet = new Set(this.store.getCompletedMissions());
    const availableIds: string[] = [];

    for (const mission of all) {
      if (this.store.isMissionActive(mission.id) || completedSet.has(mission.id)) {
        continue;
      }
      if (arePrerequisitesMet(mission.prerequisites, completedSet)) {
        availableIds.push(mission.id);
      }
    }

    this.store.setAvailableMissions(availableIds);
    return availableIds;
  }

  public getAvailableMissions(): MissionDefinition[] {
    const ids = this.store.getAvailableMissions();
    return ids.map((id) => this.registry.get(id)!).filter(Boolean);
  }

  public getAvailableMissionsForNpc(npcId: string): MissionDefinition[] {
    const available = this.getAvailableMissions();
    return available.filter((m) => m.giverNpcId === npcId);
  }

  /**
   * Offers a mission to the player (e.g., when dialogue or prompt presents it).
   */
  public offerMission(missionId: string): boolean {
    const def = this.registry.get(missionId);
    if (!def) return false;
    if (this.store.isMissionActive(missionId) || this.store.isMissionCompleted(missionId)) {
      return false;
    }
    this.eventBus.createAndEmit("MISSION_OFFERED", missionId);
    return true;
  }

  /**
   * Starts a mission by ID.
   */
  public startMission(missionId: string): boolean {
    const def = this.registry.get(missionId);
    if (!def) {
      console.warn(`[MissionManager] Cannot start mission: "${missionId}" is not registered.`);
      return false;
    }

    if (this.store.isMissionActive(missionId)) {
      return false;
    }

    if (this.store.isMissionCompleted(missionId)) {
      return false;
    }

    const objectives: MissionObjectiveRuntimeState[] = def.objectives.map((obj) => ({
      id: obj.id,
      completed: false,
      currentCount: 0,
      requiredCount: obj.requiredCount ?? 1,
    }));

    const instance: MissionRuntimeInstance = {
      id: def.id,
      definition: def,
      state: "ACTIVE",
      currentObjectiveIndex: 0,
      objectives,
      startTime: Date.now(),
      tracked: this.store.getTrackedMissionId() === null,
    };

    this.store.addActiveMission(instance);

    this.eventBus.createAndEmit("MISSION_STARTED", missionId);
    if (def.objectives[0]) {
      this.eventBus.createAndEmit("OBJECTIVE_STARTED", missionId, def.objectives[0].id);
    }

    return true;
  }

  /**
   * Updates progress counter for a specific objective.
   */
  public updateObjective(missionId: string, objectiveId: string, progress: number): boolean {
    const instance = this.store.getInstance(missionId);
    if (!instance || instance.state !== "ACTIVE") return false;

    const currentIdx = instance.currentObjectiveIndex;
    const currentObjDef = instance.definition.objectives[currentIdx];
    const currentObjRuntime = instance.objectives[currentIdx];

    if (!currentObjDef || !currentObjRuntime || currentObjDef.id !== objectiveId) {
      return false;
    }

    currentObjRuntime.currentCount = Math.min(progress, currentObjRuntime.requiredCount);
    if (currentObjRuntime.currentCount >= currentObjRuntime.requiredCount) {
      return this.completeObjective(missionId, objectiveId);
    }

    this.store.updateActiveMission(instance);
    return true;
  }

  /**
   * Completes a specific objective in an active mission.
   */
  public completeObjective(missionId: string, objectiveId?: string): boolean {
    const instance = this.store.getInstance(missionId);
    if (!instance || instance.state !== "ACTIVE") return false;

    const currentIdx = instance.currentObjectiveIndex;
    const currentObjDef = instance.definition.objectives[currentIdx];
    const currentObjRuntime = instance.objectives[currentIdx];

    if (!currentObjDef || !currentObjRuntime) return false;

    // If objectiveId is passed, verify it matches the active objective
    if (objectiveId && currentObjDef.id !== objectiveId) {
      return false;
    }

    // Mark current objective complete
    currentObjRuntime.completed = true;
    currentObjRuntime.currentCount = currentObjRuntime.requiredCount;

    this.eventBus.createAndEmit("OBJECTIVE_COMPLETED", missionId, currentObjDef.id);

    // Check if more objectives remain
    const nextIdx = currentIdx + 1;
    if (nextIdx < instance.definition.objectives.length) {
      instance.currentObjectiveIndex = nextIdx;
      this.store.updateActiveMission(instance);
      const nextObjDef = instance.definition.objectives[nextIdx];
      if (nextObjDef) {
        this.eventBus.createAndEmit("OBJECTIVE_STARTED", missionId, nextObjDef.id);
      }
      return true;
    }

    // All objectives completed -> Finish the mission
    instance.state = "OBJECTIVE_COMPLETE";
    return this.completeMission(missionId);
  }

  /**
   * Completes an active mission, awards rewards, and updates registry.
   */
  public completeMission(missionId: string): boolean {
    const instance = this.store.getInstance(missionId);
    if (!instance) return false;

    // Apply rewards
    applyMissionRewards(instance.definition.rewards);

    // Update store
    this.store.markMissionCompleted(missionId);

    // Emit event
    this.eventBus.createAndEmit("MISSION_COMPLETED", missionId, undefined, {
      rewards: instance.definition.rewards,
    });

    // Refresh other missions that might have this as a prerequisite
    this.refreshAvailableMissions();

    return true;
  }

  /**
   * Fails an active mission.
   */
  public failMission(missionId: string, reason = "failed"): boolean {
    const instance = this.store.getInstance(missionId);
    if (!instance) return false;

    this.store.markMissionFailed(missionId);
    this.eventBus.createAndEmit("MISSION_FAILED", missionId, undefined, { reason });
    return true;
  }

  /**
   * Abandons an active mission, returning it to available status.
   */
  public abandonMission(missionId: string): boolean {
    const instance = this.store.getInstance(missionId);
    if (!instance) return false;

    this.store.markMissionAbandoned(missionId, instance.definition);
    this.eventBus.createAndEmit("MISSION_ABANDONED", missionId);
    return true;
  }

  /**
   * Tracks a mission for HUD and compass display.
   */
  public trackMission(missionId: string): void {
    if (this.store.isMissionActive(missionId)) {
      this.store.setTrackedMissionId(missionId);
      this.eventBus.createAndEmit("MISSION_TRACKED", missionId);
    }
  }

  // --- Real Gameplay Event Listeners ---

  /**
   * Checks player distance against all active REACH objectives.
   * Invoked per frame / on player movement.
   */
  public checkReachObjectives(playerPos: [number, number, number]): void {
    const activeMissions = this.store.getActiveMissions();
    if (activeMissions.length === 0) return;

    for (const mission of activeMissions) {
      const currentObj = mission.definition.objectives[mission.currentObjectiveIndex];
      if (!currentObj || currentObj.type !== "REACH" || !currentObj.target?.position) {
        continue;
      }

      const targetPos = currentObj.target.position;
      const radius = currentObj.target.radius ?? 5.0;

      const dx = playerPos[0] - targetPos[0];
      const dz = playerPos[2] - targetPos[2];
      const dist = Math.hypot(dx, dz);

      if (dist <= radius) {
        this.completeObjective(mission.id, currentObj.id);
      }
    }
  }

  /**
   * Reacts to Phase 6 Interaction events for INTERACT objectives.
   */
  public handleInteraction(targetId: string): void {
    const activeMissions = this.store.getActiveMissions();
    for (const mission of activeMissions) {
      const currentObj = mission.definition.objectives[mission.currentObjectiveIndex];
      if (!currentObj || currentObj.type !== "INTERACT") continue;

      if (
        currentObj.target?.interactableId === targetId ||
        targetId.includes(currentObj.target?.interactableId ?? "___")
      ) {
        this.completeObjective(mission.id, currentObj.id);
      }
    }
  }

  /**
   * Reacts to Phase 8 Dialogue events for TALK objectives.
   */
  public handleDialogueCompleted(npcId: string): void {
    const activeMissions = this.store.getActiveMissions();
    for (const mission of activeMissions) {
      const currentObj = mission.definition.objectives[mission.currentObjectiveIndex];
      if (!currentObj || currentObj.type !== "TALK") continue;

      if (currentObj.target?.npcId === npcId || mission.definition.giverNpcId === npcId) {
        this.completeObjective(mission.id, currentObj.id);
      }
    }
  }

  public reset(): void {
    this.registry.clear();
    this.store.reset();
    this.eventBus.clear();
  }
}

export const missionManager = new MissionManager();
