import { missionRegistry, type MissionRegistry } from "./MissionRegistry";
import type {
  MissionDefinition,
  MissionObjectiveDefinition,
  MissionObjectiveRuntimeState,
  MissionRuntimeInstance,
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

  public getTrackedMission(): MissionRuntimeInstance | null {
    if (!this.trackedMissionId) {
      const firstActive = this.activeMissions.values().next().value;
      return firstActive ?? null;
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
   * - 'AVAILABLE': NPC offers a mission that is currently available to start
   * - 'ACTIVE_TARGET': NPC is the current TALK objective target for an active mission
   * - 'NONE': No active mission affiliation
   */
  public getNpcMissionIndicator(
    npcId: string,
    registry?: MissionRegistry,
  ): "AVAILABLE" | "ACTIVE_TARGET" | "NONE" {
    // 1. Check if NPC is the target of any active mission's current objective
    for (const active of this.activeMissions.values()) {
      const currentObj = active.definition.objectives[active.currentObjectiveIndex];
      if (
        currentObj &&
        (currentObj.type === "TALK" || currentObj.target?.npcId === npcId) &&
        (currentObj.target?.npcId === npcId || active.definition.giverNpcId === npcId)
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

  // --- Internal State Mutations (Called by MissionManager) ---

  public setAvailableMissions(missionIds: string[]): void {
    this.availableMissions = new Set(missionIds);
    this.notify();
  }

  public addActiveMission(instance: MissionRuntimeInstance): void {
    this.activeMissions.set(instance.id, instance);
    this.availableMissions.delete(instance.id);
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

  public reset(): void {
    this.activeMissions.clear();
    this.completedMissions.clear();
    this.failedMissions.clear();
    this.availableMissions.clear();
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
