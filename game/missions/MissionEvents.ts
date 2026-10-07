import type { MissionEvent, MissionEventType } from "./MissionTypes";

export type MissionEventListener = (event: MissionEvent) => void;

/**
 * MissionEventBus.
 *
 * Decoupled pub/sub bus for mission lifecycle events.
 * Allows external systems (dialogue, audio, telemetry, achievements) to react to mission changes.
 */
export class MissionEventBus {
  private listeners = new Set<MissionEventListener>();

  public subscribe(listener: MissionEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: MissionEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  public createAndEmit(
    type: MissionEventType,
    missionId: string,
    objectiveId?: string,
    metadata?: Record<string, unknown>,
  ): MissionEvent {
    const event: MissionEvent = {
      type,
      missionId,
      objectiveId,
      timestamp: Date.now(),
      metadata,
    };
    this.emit(event);
    return event;
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const missionEventBus = new MissionEventBus();
