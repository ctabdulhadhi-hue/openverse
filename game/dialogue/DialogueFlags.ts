import type { DialogueValue } from "./DialogueTypes";

export type DialogueFlagListener = (flags: Record<string, DialogueValue>) => void;

/**
 * DialogueFlagStore.
 *
 * Lightweight, centralized in-memory store for dialogue memory and world-flags.
 * Supports subscriptions and is serializable for future save/load persistence.
 */
export class DialogueFlagStore {
  private flags = new Map<string, DialogueValue>();
  private listeners = new Set<DialogueFlagListener>();

  public getFlag(key: string): DialogueValue | undefined {
    return this.flags.get(key);
  }

  public setFlag(key: string, value: DialogueValue): void {
    if (this.flags.get(key) === value) return;
    this.flags.set(key, value);
    this.notify();
  }

  public hasFlag(key: string, expectedValue?: DialogueValue): boolean {
    if (!this.flags.has(key)) return false;
    if (expectedValue === undefined) {
      const val = this.flags.get(key);
      return val !== false && val !== 0 && val !== "";
    }
    return this.flags.get(key) === expectedValue;
  }

  public getAllFlags(): Record<string, DialogueValue> {
    const result: Record<string, DialogueValue> = {};
    for (const [k, v] of this.flags.entries()) {
      result[k] = v;
    }
    return result;
  }

  public getCount(): number {
    return this.flags.size;
  }

  public clear(): void {
    if (this.flags.size === 0) return;
    this.flags.clear();
    this.notify();
  }

  public subscribe(listener: DialogueFlagListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllFlags());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getAllFlags();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

export const dialogueFlagStore = new DialogueFlagStore();
