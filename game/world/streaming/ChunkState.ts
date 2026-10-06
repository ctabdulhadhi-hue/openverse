export type ChunkLifecycleState = "UNLOADED" | "LOADING" | "LOADED" | "ACTIVE" | "UNLOADING";

export interface ChunkData {
  key: string;
  chunkX: number;
  chunkZ: number;
  worldCenterX: number;
  worldCenterZ: number;
  size: number;
  regionId: string;
  regionName: string;
  state: ChunkLifecycleState;
  hasCollision: boolean; // True when within ACTIVE_RADIUS
}
