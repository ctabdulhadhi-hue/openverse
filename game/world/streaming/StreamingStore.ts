import { DEFAULT_STREAMING_CONFIG } from "./StreamingConfig";

export interface StreamingStats {
  currentChunkX: number;
  currentChunkZ: number;
  loadedCount: number;
  activeCount: number;
  loadingCount: number;
  unloadingCount: number;
  activePhysicsBodies: number;
  currentRegion: string;
  activeRadius: number;
  loadRadius: number;
  unloadRadius: number;
  fpsEstimate: number;
  drawCalls?: number;
  triangles?: number;
}

class StreamingStateStore {
  private stats: StreamingStats = {
    currentChunkX: 0,
    currentChunkZ: 0,
    loadedCount: 1,
    activeCount: 1,
    loadingCount: 0,
    unloadingCount: 0,
    activePhysicsBodies: 24,
    currentRegion: "Westport Town",
    activeRadius: DEFAULT_STREAMING_CONFIG.activeRadius,
    loadRadius: DEFAULT_STREAMING_CONFIG.loadRadius,
    unloadRadius: DEFAULT_STREAMING_CONFIG.unloadRadius,
    fpsEstimate: 60.0,
    drawCalls: 0,
    triangles: 0,
  };

  private listeners = new Set<(stats: StreamingStats) => void>();

  public getStats(): StreamingStats {
    return this.stats;
  }

  public updateStats(partial: Partial<StreamingStats>): void {
    let changed = false;
    for (const key of Object.keys(partial) as Array<keyof StreamingStats>) {
      if (this.stats[key] !== partial[key]) {
        // Safe assignment
        (this.stats as Record<keyof StreamingStats, unknown>)[key] = partial[key];
        changed = true;
      }
    }
    if (changed) {
      this.notify();
    }
  }

  public subscribe(listener: (stats: StreamingStats) => void): () => void {
    this.listeners.add(listener);
    listener(this.stats);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.stats);
    }
  }
}

export const streamingStore = new StreamingStateStore();
