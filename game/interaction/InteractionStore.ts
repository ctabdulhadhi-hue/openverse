import type { InteractionTelemetry } from "./InteractionTypes";

/**
 * InteractionStore.
 *
 * Lightweight observer store for real-time interaction state.
 * Allows HUD widgets and F3 debug overlays to subscribe to interaction changes
 * without triggering React re-renders in the main animation loop unless state actually changes.
 */
export class InteractionStore {
  private telemetry: InteractionTelemetry = {
    targetId: null,
    targetName: null,
    targetType: null,
    promptLabel: null,
    distance: null,
    candidateCount: 0,
    hasLineOfSight: true,
    registryCount: 0,
    isInteracting: false,
  };

  private listeners = new Set<(telemetry: InteractionTelemetry) => void>();

  public getTelemetry(): InteractionTelemetry {
    return this.telemetry;
  }

  public updateTelemetry(partial: Partial<InteractionTelemetry>): void {
    // Check if key properties changed
    let changed = false;
    for (const key of Object.keys(partial) as (keyof InteractionTelemetry)[]) {
      if (this.telemetry[key] !== partial[key]) {
        changed = true;
        break;
      }
    }

    if (!changed) return;

    this.telemetry = { ...this.telemetry, ...partial };
    this.notify();
  }

  public subscribe(listener: (telemetry: InteractionTelemetry) => void): () => void {
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
      targetId: null,
      targetName: null,
      targetType: null,
      promptLabel: null,
      distance: null,
      candidateCount: 0,
      hasLineOfSight: true,
      registryCount: 0,
      isInteracting: false,
    };
    this.notify();
  }

  // Readable modal state (signs, kiosks, notice boards, terminals)
  private activeReadable: ReadableModalData | null = null;
  private readableListeners = new Set<(readable: ReadableModalData | null) => void>();

  public getActiveReadable(): ReadableModalData | null {
    return this.activeReadable;
  }

  public openReadable(data: ReadableModalData): void {
    this.activeReadable = data;
    for (const listener of this.readableListeners) {
      listener(this.activeReadable);
    }
  }

  public closeReadable(): void {
    if (!this.activeReadable) return;
    this.activeReadable = null;
    for (const listener of this.readableListeners) {
      listener(null);
    }
  }

  public subscribeReadable(listener: (readable: ReadableModalData | null) => void): () => void {
    this.readableListeners.add(listener);
    listener(this.activeReadable);
    return () => {
      this.readableListeners.delete(listener);
    };
  }
}

export interface ReadableModalData {
  title: string;
  subtitle?: string;
  content: string;
  location?: string;
}

export const interactionStore = new InteractionStore();
