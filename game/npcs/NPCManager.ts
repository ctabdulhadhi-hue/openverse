import { DEFAULT_NPC_CONFIG, type NPCSystemConfig } from "./NPCConfig";
import { NPCController } from "./NPCController";
import type { NPCDefinition, NPCSpawnZone } from "./NPCData";
import {
  registerNPCInteraction,
  unregisterNPCInteraction,
  updateNPCInteractionPosition,
} from "./NPCInteraction";
import { npcRegistry, type NPCRegistry } from "./NPCRegistry";
import { npcStore, type NPCStore } from "./NPCStore";

/**
 * NPCManager.
 *
 * Central coordinator for NPC simulation, lifecycle, and telemetry.
 * Dispatches updates across all registered NPCs according to simulation LOD tiers.
 */
export class NPCManager {
  private registry: NPCRegistry;
  private store: NPCStore;
  private config: NPCSystemConfig;
  private spawnZones = new Map<string, NPCSpawnZone>();

  constructor(
    registry: NPCRegistry = npcRegistry,
    store: NPCStore = npcStore,
    config: NPCSystemConfig = DEFAULT_NPC_CONFIG,
  ) {
    this.registry = registry;
    this.store = store;
    this.config = config;
  }

  /**
   * Register a spawn zone for navigation constraints.
   */
  public registerSpawnZone(zone: NPCSpawnZone): void {
    this.spawnZones.set(zone.id, zone);
  }

  public getSpawnZone(id: string): NPCSpawnZone | undefined {
    return this.spawnZones.get(id);
  }

  /**
   * Spawn and register an NPC from its definition.
   */
  public spawnNPC(def: NPCDefinition): NPCController {
    const controller = new NPCController(def, this.config);
    this.registry.register(controller);
    registerNPCInteraction(controller);
    return controller;
  }

  /**
   * Despawn an NPC by ID.
   */
  public despawnNPC(id: string): boolean {
    unregisterNPCInteraction(id);
    return this.registry.unregister(id);
  }

  /**
   * Despawn all NPCs belonging to a streamed chunk key.
   */
  public despawnByChunk(chunkKey: string): number {
    const npcs = this.registry.queryByChunk(chunkKey);
    for (const npc of npcs) {
      unregisterNPCInteraction(npc.id);
    }
    return this.registry.unregisterByChunk(chunkKey);
  }

  /**
   * Master update tick invoked per frame.
   */
  public update(dt: number, playerPos: [number, number, number] | null): void {
    const allNPCs = this.registry.getAll();
    if (allNPCs.length === 0) {
      this.store.updateTelemetry({
        activeCount: 0,
        nearbyCount: 0,
        nearTierCount: 0,
        midTierCount: 0,
        farTierCount: 0,
        target: null,
      });
      return;
    }

    let nearCount = 0;
    let midCount = 0;
    let farCount = 0;
    let nearbyCount = 0;

    let closestNPC: NPCController | null = null;
    let minDistance = Infinity;

    for (const npc of allNPCs) {
      // 1. Calculate distance to player
      let dist = 999;
      if (playerPos) {
        const dx = npc.position[0] - playerPos[0];
        const dz = npc.position[2] - playerPos[2];
        dist = Math.hypot(dx, dz);
      }

      // 2. Assign simulation tier
      const tier = npc.updateSimulationTier(dist);
      if (tier === "NEAR") nearCount++;
      else if (tier === "MID") midCount++;
      else if (tier === "FAR") farCount++;

      if (dist <= this.config.playerAwarenessRadius) {
        nearbyCount++;
      }

      // Track closest for telemetry
      if (dist < minDistance) {
        minDistance = dist;
        closestNPC = npc;
      }

      // 3. Step NPC update
      const zone = this.spawnZones.get(npc.def.spawnZoneId);
      npc.update(dt, playerPos, zone);

      // 4. Synchronize interaction registry position with movement
      if (tier === "NEAR" || tier === "MID") {
        updateNPCInteractionPosition(npc.id, npc.position);
      }
    }

    // 5. Update F3 Telemetry
    this.store.updateTelemetry({
      activeCount: allNPCs.length,
      nearbyCount,
      nearTierCount: nearCount,
      midTierCount: midCount,
      farTierCount: farCount,
      target: closestNPC
        ? {
            id: closestNPC.id,
            name: closestNPC.def.name,
            type: closestNPC.def.type,
            state: closestNPC.state,
            distance: minDistance,
            behavior: closestNPC.def.behavior,
          }
        : null,
    });
  }

  /**
   * Reset the manager state.
   */
  public reset(): void {
    const allNPCs = this.registry.getAll();
    for (const npc of allNPCs) {
      unregisterNPCInteraction(npc.id);
    }
    this.registry.clear();
    this.spawnZones.clear();
    this.store.reset();
  }
}

export const npcManager = new NPCManager();
