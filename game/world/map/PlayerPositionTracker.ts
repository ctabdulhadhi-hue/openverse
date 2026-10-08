/**
 * Lightweight real-time player position observer for UI systems (Map, HUD, Minimap).
 *
 * Avoids per-frame React state updates by providing a decoupled subscription model
 * and instant synchronous position queries.
 */

export type PositionListener = (position: [number, number, number], yaw: number) => void;

export class PlayerPositionTracker {
  private static instance: PlayerPositionTracker;
  private currentPosition: [number, number, number] = [0, 1.2, 8];
  private currentYaw: number = 0;
  private listeners: Set<PositionListener> = new Set();

  public static getInstance(): PlayerPositionTracker {
    if (!PlayerPositionTracker.instance) {
      PlayerPositionTracker.instance = new PlayerPositionTracker();
    }
    return PlayerPositionTracker.instance;
  }

  public update(pos: { x: number; y: number; z: number }, yaw?: number): void {
    this.currentPosition[0] = pos.x;
    this.currentPosition[1] = pos.y;
    this.currentPosition[2] = pos.z;
    if (typeof yaw === "number") {
      this.currentYaw = yaw;
    }
    const posCopy: [number, number, number] = [
      this.currentPosition[0],
      this.currentPosition[1],
      this.currentPosition[2],
    ];
    for (const listener of this.listeners) {
      listener(posCopy, this.currentYaw);
    }
  }

  public getPosition(): [number, number, number] {
    return [this.currentPosition[0], this.currentPosition[1], this.currentPosition[2]];
  }

  public getYaw(): number {
    return this.currentYaw;
  }

  public subscribe(listener: PositionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public reset(spawnPos: [number, number, number] = [0, 1.2, 8], yaw = 0): void {
    this.currentPosition = [...spawnPos];
    this.currentYaw = yaw;
  }
}

export const playerPositionTracker = PlayerPositionTracker.getInstance();
