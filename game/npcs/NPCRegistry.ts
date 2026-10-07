import type { NPCController } from "./NPCController";

/**
 * NPCRegistry.
 *
 * Central catalog and spatial query registry for all active NPCs in OPENVERSE.
 * Integrates with world chunk streaming lifecycle to register/unregister entities cleanly.
 */
export class NPCRegistry {
  private npcs = new Map<string, NPCController>();
  private chunkIndex = new Map<string, Set<string>>();

  /**
   * Register an NPC controller.
   */
  public register(npc: NPCController): void {
    if (this.npcs.has(npc.id)) {
      this.unregister(npc.id);
    }

    this.npcs.set(npc.id, npc);

    const chunkKey = npc.def.chunkKey;
    if (!this.chunkIndex.has(chunkKey)) {
      this.chunkIndex.set(chunkKey, new Set());
    }
    this.chunkIndex.get(chunkKey)!.add(npc.id);
  }

  /**
   * Unregister an NPC controller by ID.
   */
  public unregister(id: string): boolean {
    const npc = this.npcs.get(id);
    if (!npc) return false;

    this.npcs.delete(id);

    const chunkKey = npc.def.chunkKey;
    const chunkSet = this.chunkIndex.get(chunkKey);
    if (chunkSet) {
      chunkSet.delete(id);
      if (chunkSet.size === 0) {
        this.chunkIndex.delete(chunkKey);
      }
    }

    return true;
  }

  /**
   * Unregister all NPCs associated with a specific streamed chunk key (e.g. "0,0").
   */
  public unregisterByChunk(chunkKey: string): number {
    const ids = this.chunkIndex.get(chunkKey);
    if (!ids) return 0;

    const count = ids.size;
    for (const id of Array.from(ids)) {
      this.npcs.delete(id);
    }
    this.chunkIndex.delete(chunkKey);
    return count;
  }

  /**
   * Get an NPC by ID.
   */
  public get(id: string): NPCController | undefined {
    return this.npcs.get(id);
  }

  /**
   * Get all registered NPCs.
   */
  public getAll(): NPCController[] {
    return Array.from(this.npcs.values());
  }

  /**
   * Get active count of registered NPCs.
   */
  public getCount(): number {
    return this.npcs.size;
  }

  /**
   * Query all NPCs within a given radius around a position [x, y, z].
   */
  public queryNearby(center: [number, number, number], radius: number): NPCController[] {
    const radiusSq = radius * radius;
    const results: NPCController[] = [];

    for (const npc of this.npcs.values()) {
      const dx = npc.position[0] - center[0];
      const dz = npc.position[2] - center[2];
      const distSq = dx * dx + dz * dz;

      if (distSq <= radiusSq) {
        results.push(npc);
      }
    }

    return results;
  }

  /**
   * Query all NPCs registered in a specific chunk.
   */
  public queryByChunk(chunkKey: string): NPCController[] {
    const ids = this.chunkIndex.get(chunkKey);
    if (!ids) return [];

    const results: NPCController[] = [];
    for (const id of ids) {
      const npc = this.npcs.get(id);
      if (npc) results.push(npc);
    }
    return results;
  }

  /**
   * Clear all registered NPCs.
   */
  public clear(): void {
    this.npcs.clear();
    this.chunkIndex.clear();
  }
}

export const npcRegistry = new NPCRegistry();
