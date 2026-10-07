import type { NPCStateType } from "./NPCState";
import type { NPCBehavior, NPCType } from "./NPCType";

export interface NPCTargetTelemetry {
  id: string;
  name: string;
  type: NPCType;
  state: NPCStateType;
  distance: number;
  behavior: NPCBehavior;
}

export interface NPCTelemetry {
  activeCount: number;
  nearbyCount: number;
  nearTierCount: number;
  midTierCount: number;
  farTierCount: number;
  target: NPCTargetTelemetry | null;
}

/**
 * NPCStore.
 *
 * Lightweight observer store for real-time NPC system telemetry.
 * Serves the F3 debug diagnostics panel without triggering global re-renders.
 */
export class NPCStore {
  private telemetry: NPCTelemetry = {
    activeCount: 0,
    nearbyCount: 0,
    nearTierCount: 0,
    midTierCount: 0,
    farTierCount: 0,
    target: null,
  };

  private listeners = new Set<(telemetry: NPCTelemetry) => void>();

  public getTelemetry(): NPCTelemetry {
    return this.telemetry;
  }

  public updateTelemetry(partial: Partial<NPCTelemetry>): void {
    let changed = false;
    for (const key of Object.keys(partial) as (keyof NPCTelemetry)[]) {
      if (this.telemetry[key] !== partial[key]) {
        changed = true;
        break;
      }
    }

    if (!changed) return;

    this.telemetry = { ...this.telemetry, ...partial };
    this.notify();
  }

  public subscribe(listener: (telemetry: NPCTelemetry) => void): () => void {
    this.listeners.add(listener);
    listener(this.telemetry);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.telemetry);
    }
  }

  public reset(): void {
    this.telemetry = {
      activeCount: 0,
      nearbyCount: 0,
      nearTierCount: 0,
      midTierCount: 0,
      farTierCount: 0,
      target: null,
    };
    this.notify();
  }
}

export const npcStore = new NPCStore();
