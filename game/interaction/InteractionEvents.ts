import type {
  InteractionEvent,
  InteractionEventListener,
  InteractionEventType,
} from "./InteractionTypes";

/**
 * Lightweight event dispatcher for interaction lifecycle events.
 */
export class InteractionEventBus {
  private listeners = new Set<InteractionEventListener>();

  public subscribe(listener: InteractionEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: InteractionEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        // Suppress errors in listeners to keep engine loop stable
        if (process.env.NODE_ENV === "development") {
          console.warn("[InteractionEventBus] Listener error:", err);
        }
      }
    }
  }

  public emitSimple(
    type: InteractionEventType,
    target?: InteractionEvent["target"],
    reason?: string,
  ): void {
    this.emit({
      type,
      target,
      timestamp: Date.now(),
      reason,
    });
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const interactionEventBus = new InteractionEventBus();
