import type {
  DialogueChoice,
  DialogueNode,
  DialogueRuntimeSnapshot,
  DialogueStatus,
} from "./DialogueTypes";

export type DialogueStoreListener = (snapshot: DialogueRuntimeSnapshot) => void;

/**
 * DialogueStore.
 *
 * Observable store holding real-time dialogue state for UI widgets and the F3 debug panel.
 */
export class DialogueStore {
  private snapshot: DialogueRuntimeSnapshot = {
    status: "INACTIVE",
    conversationId: null,
    npcId: null,
    speakerName: null,
    speakerRole: null,
    currentNodeId: null,
    currentNode: null,
    availableChoices: [],
    selectedChoiceIndex: 0,
    history: [],
  };

  private listeners = new Set<DialogueStoreListener>();

  public getSnapshot(): DialogueRuntimeSnapshot {
    return this.snapshot;
  }

  public isActive(): boolean {
    return (
      this.snapshot.status === "ACTIVE" ||
      this.snapshot.status === "WAITING_FOR_CHOICE" ||
      this.snapshot.status === "STARTING"
    );
  }

  public getStatus(): DialogueStatus {
    return this.snapshot.status;
  }

  public getCurrentNode(): DialogueNode | null {
    return this.snapshot.currentNode;
  }

  public getChoices(): DialogueChoice[] {
    return this.snapshot.availableChoices;
  }

  public getSelectedChoiceIndex(): number {
    return this.snapshot.selectedChoiceIndex;
  }

  public setSelectedChoiceIndex(index: number): void {
    if (this.snapshot.selectedChoiceIndex === index) return;
    this.updateSnapshot({ selectedChoiceIndex: index });
  }

  public updateSnapshot(partial: Partial<DialogueRuntimeSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...partial };
    this.notify();
  }

  public reset(): void {
    this.snapshot = {
      status: "INACTIVE",
      conversationId: null,
      npcId: null,
      speakerName: null,
      speakerRole: null,
      currentNodeId: null,
      currentNode: null,
      availableChoices: [],
      selectedChoiceIndex: 0,
      history: [],
    };
    this.notify();
  }

  public subscribe(listener: DialogueStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }
}

export const dialogueStore = new DialogueStore();
