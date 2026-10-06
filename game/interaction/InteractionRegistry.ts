import * as THREE from "three";

import type { InteractionTarget } from "./InteractionTypes";
import { getTargetVector3 } from "./InteractionUtils";

/**
 * InteractionRegistry.
 *
 * Central repository of all interactables currently active in the world.
 * Features:
 * - Thread/frame-safe registration and unregistration
 * - Chunk-keyed spatial grouping for automatic lifecycle management with Phase 5 streaming
 * - Duplicate registration prevention
 * - Fast spatial query for nearby interactables
 */
export class InteractionRegistry {
  private targets = new Map<string, InteractionTarget>();
  private chunkMap = new Map<string, Set<string>>();
  private tempVec = new THREE.Vector3();

  /**
   * Registers or updates an interaction target.
   */
  public register(target: InteractionTarget): void {
    if (!target.id) return;

    // Unregister from previous chunk bucket if changing chunkKey
    const existing = this.targets.get(target.id);
    if (existing && existing.chunkKey && existing.chunkKey !== target.chunkKey) {
      this.chunkMap.get(existing.chunkKey)?.delete(target.id);
    }

    this.targets.set(target.id, target);

    if (target.chunkKey) {
      let set = this.chunkMap.get(target.chunkKey);
      if (!set) {
        set = new Set();
        this.chunkMap.set(target.chunkKey, set);
      }
      set.add(target.id);
    }
  }

  /**
   * Unregisters a target by its unique ID.
   */
  public unregister(id: string): void {
    const target = this.targets.get(id);
    if (!target) return;

    if (target.chunkKey) {
      const set = this.chunkMap.get(target.chunkKey);
      if (set) {
        set.delete(id);
        if (set.size === 0) {
          this.chunkMap.delete(target.chunkKey);
        }
      }
    }

    this.targets.delete(id);
  }

  /**
   * Unregisters all targets associated with a specific chunk key.
   * Called automatically when a world chunk is unmounted during streaming.
   */
  public unregisterByChunk(chunkKey: string): void {
    const set = this.chunkMap.get(chunkKey);
    if (!set) return;

    for (const id of set) {
      this.targets.delete(id);
    }

    this.chunkMap.delete(chunkKey);
  }

  /**
   * Retrieves an interaction target by ID.
   */
  public get(id: string): InteractionTarget | undefined {
    return this.targets.get(id);
  }

  /**
   * Returns all currently registered interaction targets.
   */
  public getAll(): InteractionTarget[] {
    return Array.from(this.targets.values());
  }

  /**
   * Total count of registered interactables.
   */
  public getCount(): number {
    return this.targets.size;
  }

  /**
   * Clears all registered targets and chunk associations.
   */
  public clear(): void {
    this.targets.clear();
    this.chunkMap.clear();
  }

  /**
   * Queries targets within a broad radial sphere from a given position.
   */
  public queryNearby(playerPos: THREE.Vector3, maxRadius: number): InteractionTarget[] {
    const results: InteractionTarget[] = [];
    const maxRadiusSq = maxRadius * maxRadius;

    for (const target of this.targets.values()) {
      if (!target.enabled) continue;

      getTargetVector3(target.position, this.tempVec);
      const distSq = playerPos.distanceToSquared(this.tempVec);
      if (distSq <= maxRadiusSq) {
        results.push(target);
      }
    }

    return results;
  }
}

/**
 * Global singleton interaction registry.
 */
export const interactionRegistry = new InteractionRegistry();
