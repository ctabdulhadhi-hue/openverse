import type { DialogueChoice, DialogueNode } from "./DialogueTypes";

export type DialogueEventType =
  "dialogue_started" | "dialogue_node_entered" | "dialogue_choice_selected" | "dialogue_ended";

export interface DialogueEvent {
  type: DialogueEventType;
  conversationId: string;
  npcId: string;
  nodeId?: string;
  node?: DialogueNode;
  choiceId?: string;
  choice?: DialogueChoice;
  timestamp: number;
  reason?: string;
}

export type DialogueEventListener = (event: DialogueEvent) => void;

/**
 * DialogueEventBus.
 *
 * Decoupled event emitter for dialogue events. Future mission systems,
 * audio triggers, and achievements listen to these events.
 */
export class DialogueEventBus {
  private listeners = new Set<DialogueEventListener>();

  public subscribe(listener: DialogueEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: DialogueEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error("[DialogueEventBus] Error in event listener:", err);
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const dialogueEventBus = new DialogueEventBus();
