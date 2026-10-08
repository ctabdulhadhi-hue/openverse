import { missionRegistry, type MissionRegistry } from "./MissionRegistry";
import type {
  MissionDefinition,
  MissionMapMarker,
  MissionObjectiveDefinition,
  MissionObjectiveRuntimeState,
  MissionRuntimeInstance,
  MissionSerializedState,
  MissionSnapshot,
  MissionState,
} from "./MissionTypes";

export type MissionStoreListener = (snapshot: MissionSnapshot) => void;

/**
 * MissionStore.
 *
 * Observable, reactive store holding real-time mission states.
 * Dispatches updates to HUD widgets, the Missions journal, world markers, and F3 telemetry.
 */
export class MissionStore {
  private registry?: MissionRegistry;
  private activeMissions = new Map<string, MissionRuntimeInstance>();
  private completedMissions = new Set<string>();
  private failedMissions = new Set<string>();
  private availableMissions = new Set<string>();
  private declinedMissions = new Set<string>();
  private trackedMissionId: string | null = null;
  private listeners = new Set<MissionStoreListener>();

  constructor(registry?: MissionRegistry) {
    this.registry = registry;
  }

  public setRegistry(registry: MissionRegistry): void {
    this.registry = registry;
  }

  public getSnapshot(): MissionSnapshot {
    return {
      activeMissions: Array.from(this.activeMissions.values()),
      completedMissions: Array.from(this.completedMissions),
      failedMissions: Array.from(this.failedMissions),
      availableMissions: Array.from(this.availableMissions),
      declinedMissions: Array.from(this.declinedMissions),
      trackedMissionId: this.trackedMissionId,
      lastEvent: null,
    };
  }

  public getActiveMissions(): MissionRuntimeInstance[] {
    return Array.from(this.activeMissions.values());
  }

  public getCompletedMissions(): string[] {
    return Array.from(this.completedMissions);
  }

  public getAvailableMissions(): string[] {
    return Array.from(this.availableMissions);
  }

  public getDeclinedMissions(): string[] {
    return Array.from(this.declinedMissions);
  }

  public isMissionDeclined(id: string): boolean {
    return this.declinedMissions.has(id);
  }

  public getTrackedMission(): MissionRuntimeInstance | null {
    if (!this.trackedMissionId) {
      return null;
    }
    return this.activeMissions.get(this.trackedMissionId) ?? null;
  }

  public getTrackedMissionId(): string | null {
    return this.trackedMissionId;
  }

  public setTrackedMissionId(id: string | null): void {
    if (this.trackedMissionId === id) return;
    this.trackedMissionId = id;
    this.notify();
  }

  public untrackMission(id?: string): void {
    if (id && this.trackedMissionId !== id) return;
    this.trackedMissionId = null;
    this.notify();
  }

  public getInstance(id: string): MissionRuntimeInstance | undefined {
    return this.activeMissions.get(id);
  }

  public isMissionActive(id: string): boolean {
    return this.activeMissions.has(id);
  }

  public isMissionCompleted(id: string): boolean {
    return this.completedMissions.has(id);
  }

  public getMissionState(id: string): MissionState {
    if (this.completedMissions.has(id)) return "COMPLETED";
    if (this.failedMissions.has(id)) return "FAILED";
    const active = this.activeMissions.get(id);
    if (active) return active.state;
    if (this.declinedMissions.has(id)) return "DECLINED";
    if (this.availableMissions.has(id)) return "AVAILABLE";
    return "AVAILABLE";
  }

  /**
   * Retrieves the current active objective definition and runtime state for a mission.
   */
  public getCurrentObjective(
    missionId: string,
  ): { def: MissionObjectiveDefinition; runtime: MissionObjectiveRuntimeState } | null {
    const instance = this.activeMissions.get(missionId);
    if (!instance) return null;

    const def = instance.definition.objectives[instance.currentObjectiveIndex];
    const runtime = instance.objectives[instance.currentObjectiveIndex];
    if (!def || !runtime) return null;

    return { def, runtime };
  }

  /**
   * Determines overhead marker status for an NPC:
   * - 'ACTIVE_TARGET': NPC is the current TALK objective target for the TRACKED mission
   * - 'AVAILABLE': NPC offers a mission that is currently available to start
   * - 'NONE': No active mission affiliation
   * (Per Phase 10 requirements: only the tracked mission's active objective displays overhead world markers)
   */
  public getNpcMissionIndicator(
    npcId: string,
    registry?: MissionRegistry,
  ): "AVAILABLE" | "ACTIVE_TARGET" | "NONE" {
    // 1. Check if NPC is the target of the tracked mission's current objective
    const tracked = this.getTrackedMission();
    if (tracked) {
      const currentObj = tracked.definition.objectives[tracked.currentObjectiveIndex];
      if (
        currentObj &&
        (currentObj.type === "TALK" ||
          currentObj.type === "TALK_TO_NPC" ||
          currentObj.type === "CHOICE" ||
          currentObj.target?.npcId === npcId) &&
        (currentObj.target?.npcId === npcId ||
          (!currentObj.target?.npcId && tracked.definition.giverNpcId === npcId))
      ) {
        return "ACTIVE_TARGET";
      }
    }

    // 2. Check if NPC offers an available mission
    const reg = registry ?? this.registry ?? missionRegistry;
    for (const availId of this.availableMissions) {
      if (this.activeMissions.has(availId) || this.completedMissions.has(availId)) continue;
      const def = reg.get(availId);
      if (def && def.giverNpcId === npcId) {
        return "AVAILABLE";
      }
    }

    return "NONE";
  }

  /**
   * Phase 10 & 25 Persistence Interface: Export serializable state.
   */
  public exportState(): MissionSerializedState {
    return {
      version: 1,
      activeMissions: Array.from(this.activeMissions.values()).map((instance) => ({
        id: instance.id,
        currentObjectiveIndex: instance.currentObjectiveIndex,
        objectives: JSON.parse(JSON.stringify(instance.objectives)),
        startTime: instance.startTime,
      })),
      completedMissions: Array.from(this.completedMissions),
      failedMissions: Array.from(this.failedMissions),
      availableMissions: Array.from(this.availableMissions),
      declinedMissions: Array.from(this.declinedMissions),
      trackedMissionId: this.trackedMissionId,
      timestamp: Date.now(),
    };
  }

  /**
   * Phase 10 & 25 Persistence Interface: Import serialized state.
   */
  public importState(serialized: MissionSerializedState, registry?: MissionRegistry): void {
    this.reset();
    const reg = registry ?? this.registry ?? missionRegistry;

    this.completedMissions = new Set(serialized.completedMissions);
    this.failedMissions = new Set(serialized.failedMissions);
    this.availableMissions = new Set(serialized.availableMissions);
    this.declinedMissions = new Set(serialized.declinedMissions);
    this.trackedMissionId = serialized.trackedMissionId;

    for (const activeData of serialized.activeMissions) {
      const def = reg.get(activeData.id);
      if (!def) continue;

      const instance: MissionRuntimeInstance = {
        id: activeData.id,
        definition: def,
        state: "ACTIVE",
        currentObjectiveIndex: activeData.currentObjectiveIndex,
        objectives: activeData.objectives,
        startTime: activeData.startTime ?? Date.now(),
        tracked: this.trackedMissionId === activeData.id,
      };
      this.activeMissions.set(activeData.id, instance);
    }
    this.notify();
  }

  /**
   * Phase 10 & 19 Map Hook: Returns typed map markers for active missions.
   */
  public getMapMarkers(): MissionMapMarker[] {
    const markers: MissionMapMarker[] = [];
    for (const instance of this.activeMissions.values()) {
      const currentObj = instance.definition.objectives[instance.currentObjectiveIndex];
      if (!currentObj) continue;
      const pos = currentObj.target?.position ?? [0, 0, 0];
      markers.push({
        missionId: instance.id,
        objectiveId: currentObj.id,
        title: instance.definition.title,
        objectiveTitle: currentObj.title,
        position: pos,
        targetType: currentObj.type,
        district: (instance.definition.metadata?.district as string) || "Varanaya",
        tracked: this.trackedMissionId === instance.id,
      });
    }
    return markers;
  }

  // --- Internal State Mutations (Called by MissionManager) ---

  public setAvailableMissions(missionIds: string[]): void {
    this.availableMissions = new Set(missionIds);
    this.notify();
  }

  public addActiveMission(instance: MissionRuntimeInstance): void {
    this.activeMissions.set(instance.id, instance);
    this.availableMissions.delete(instance.id);
    this.declinedMissions.delete(instance.id);
    if (!this.trackedMissionId) {
      this.trackedMissionId = instance.id;
    }
    this.notify();
  }

  public updateActiveMission(instance: MissionRuntimeInstance): void {
    this.activeMissions.set(instance.id, instance);
    this.notify();
  }

  public markMissionCompleted(id: string): void {
    const instance = this.activeMissions.get(id);
    if (instance) {
      instance.state = "COMPLETED";
      instance.endTime = Date.now();
      this.activeMissions.delete(id);
    }
    this.completedMissions.add(id);
    this.availableMissions.delete(id);

    if (this.trackedMissionId === id) {
      const nextActive = this.activeMissions.values().next().value;
      this.trackedMissionId = nextActive ? nextActive.id : null;
    }
    this.notify();
  }

  public markMissionFailed(id: string): void {
    const instance = this.activeMissions.get(id);
    if (instance) {
      instance.state = "FAILED";
      instance.endTime = Date.now();
      this.activeMissions.delete(id);
    }
    this.failedMissions.add(id);
    this.availableMissions.delete(id);

    if (this.trackedMissionId === id) {
      const nextActive = this.activeMissions.values().next().value;
      this.trackedMissionId = nextActive ? nextActive.id : null;
    }
    this.notify();
  }

  public markMissionAbandoned(id: string, _definition?: MissionDefinition): void {
    this.activeMissions.delete(id);
    this.availableMissions.add(id);

    if (this.trackedMissionId === id) {
      const nextActive = this.activeMissions.values().next().value;
      this.trackedMissionId = nextActive ? nextActive.id : null;
    }
    this.notify();
  }

  public markMissionDeclined(id: string): void {
    this.declinedMissions.add(id);
    this.notify();
  }

  public markMissionPaused(id: string): void {
    const instance = this.activeMissions.get(id);
    if (instance) {
      instance.state = "PAUSED";
      this.notify();
    }
  }

  public markMissionResumed(id: string): void {
    const instance = this.activeMissions.get(id);
    if (instance) {
      instance.state = "ACTIVE";
      this.notify();
    }
  }

  public reset(): void {
    this.activeMissions.clear();
    this.completedMissions.clear();
    this.failedMissions.clear();
    this.availableMissions.clear();
    this.declinedMissions.clear();
    this.trackedMissionId = null;
    this.notify();
  }

  public subscribe(listener: MissionStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

export const missionStore = new MissionStore();
