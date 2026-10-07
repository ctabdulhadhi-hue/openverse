import * as THREE from "three";
import { beforeEach, describe, expect, it } from "vitest";

import { WESTPORT_NPCS, WESTPORT_SPAWN_ZONES } from "@/data/npcs/westportNPCs";
import { interactionRegistry, interactionStore } from "@/game/interaction";
import {
  DEFAULT_NPC_CONFIG,
  evaluatePlayerPerception,
  getShortestAngleDelta,
  isInsideObstacle,
  mulberry32,
  NPCController,
  NPCManager,
  NPCRegistry,
  NPCStore,
  normalizeAngle,
  rotateTowards,
  sampleZoneDestination,
  stepMovement,
  type NPCDefinition,
  type NPCSpawnZone,
} from "@/game/npcs";

describe("Phase 7 — NPC System Foundation", () => {
  let registry: NPCRegistry;
  let store: NPCStore;
  let manager: NPCManager;

  const sampleZone: NPCSpawnZone = {
    id: "test-zone",
    name: "Test Plaza",
    center: [0, 0, 0],
    radius: 12,
    allowedTypes: ["CIVILIAN", "TRAVELER"],
    forbiddenBoxes: [{ min: [2, 0, 2], max: [6, 4, 6] }],
  };

  const sampleDef: NPCDefinition = {
    id: "test-npc-1",
    type: "CIVILIAN",
    name: "Civic Explorer",
    title: "Cartographer",
    spawnZoneId: "test-zone",
    basePosition: [0, 0, 0],
    baseRotation: 0,
    behavior: "WANDER",
    walkSpeed: 1.6,
    seed: 42,
    dialogueText: "Greetings from the frontier!",
    chunkKey: "0,0",
    appearance: {
      shirtColor: "#0284c7",
      pantsColor: "#334155",
      shoesColor: "#1e293b",
      skinColor: "#d4a373",
      hairColor: "#1c1917",
      hasHat: false,
      hasBackpack: true,
      heightScale: 1.0,
      widthScale: 1.0,
    },
  };

  beforeEach(() => {
    registry = new NPCRegistry();
    store = new NPCStore();
    manager = new NPCManager(registry, store, DEFAULT_NPC_CONFIG);
    manager.registerSpawnZone(sampleZone);
    interactionRegistry.clear();
    interactionStore.reset();
  });

  // -------------------------------------------------------------
  // 1 & 2 & 3. Registry Lifecycle, Duplicate Prevention & Consistency
  // -------------------------------------------------------------
  describe("1. NPC Registry Lifecycle & Consistency", () => {
    it("registers an NPC and retrieves it by ID", () => {
      const ctrl = new NPCController(sampleDef);
      registry.register(ctrl);

      expect(registry.getCount()).toBe(1);
      expect(registry.get("test-npc-1")).toBe(ctrl);
      expect(registry.getAll()).toHaveLength(1);
    });

    it("unregisters an NPC by ID cleanly", () => {
      const ctrl = new NPCController(sampleDef);
      registry.register(ctrl);
      expect(registry.getCount()).toBe(1);

      const removed = registry.unregister("test-npc-1");
      expect(removed).toBe(true);
      expect(registry.getCount()).toBe(0);
      expect(registry.get("test-npc-1")).toBeUndefined();
    });

    it("prevents duplicate registrations and updates in place", () => {
      const ctrl1 = new NPCController(sampleDef);
      registry.register(ctrl1);

      const ctrl2 = new NPCController({ ...sampleDef, name: "Updated Explorer" });
      registry.register(ctrl2);

      expect(registry.getCount()).toBe(1);
      expect(registry.get("test-npc-1")?.def.name).toBe("Updated Explorer");
    });

    it("unregisters NPCs by chunk key for chunk streaming lifecycle", () => {
      const ctrlA = new NPCController(sampleDef);
      const ctrlB = new NPCController({ ...sampleDef, id: "test-npc-2", chunkKey: "0,0" });
      const ctrlC = new NPCController({ ...sampleDef, id: "test-npc-3", chunkKey: "1,0" });

      registry.register(ctrlA);
      registry.register(ctrlB);
      registry.register(ctrlC);
      expect(registry.getCount()).toBe(3);

      const removed = registry.unregisterByChunk("0,0");
      expect(removed).toBe(2);
      expect(registry.getCount()).toBe(1);
      expect(registry.get("test-npc-3")).toBeDefined();
    });

    it("queries nearby NPCs within a specified radius", () => {
      const ctrlNear = new NPCController({ ...sampleDef, id: "near", basePosition: [2, 0, 2] });
      const ctrlFar = new NPCController({ ...sampleDef, id: "far", basePosition: [50, 0, 50] });

      registry.register(ctrlNear);
      registry.register(ctrlFar);

      const nearby = registry.queryNearby([0, 0, 0], 10);
      expect(nearby).toHaveLength(1);
      expect(nearby[0]?.id).toBe("near");
    });

    it("maintains consistent counts and empty state on clear", () => {
      registry.register(new NPCController(sampleDef));
      expect(registry.getCount()).toBe(1);
      registry.clear();
      expect(registry.getCount()).toBe(0);
      expect(registry.getAll()).toEqual([]);
    });
  });

  // -------------------------------------------------------------
  // 4 & 5. Deterministic Spawning & Spawn Zones
  // -------------------------------------------------------------
  describe("2. Deterministic Spawning & Spawn Zones", () => {
    it("generates deterministic pseudo-random numbers from Mulberry32 seed", () => {
      const rng1 = mulberry32(12345);
      const rng2 = mulberry32(12345);

      const seq1 = [rng1(), rng1(), rng1()];
      const seq2 = [rng2(), rng2(), rng2()];

      expect(seq1).toEqual(seq2);
    });

    it("detects obstacle bounding boxes correctly", () => {
      const boxes = [
        {
          min: [10, 0, 10] as [number, number, number],
          max: [20, 5, 20] as [number, number, number],
        },
      ];

      expect(isInsideObstacle(15, 15, boxes)).toBe(true);
      expect(isInsideObstacle(0, 0, boxes)).toBe(false);
      expect(isInsideObstacle(20.5, 20.5, boxes, 0.8)).toBe(true); // inside margin
      expect(isInsideObstacle(22, 22, boxes, 0.8)).toBe(false); // outside margin
    });

    it("samples deterministic destinations within zone radius and outside obstacles", () => {
      const dest1 = sampleZoneDestination(sampleZone, 42, 1, [0, 0, 0]);
      const dest2 = sampleZoneDestination(sampleZone, 42, 1, [0, 0, 0]);

      expect(dest1).toEqual(dest2);

      // Verify distance is within zone radius
      const dist = Math.hypot(dest1[0] - sampleZone.center[0], dest1[2] - sampleZone.center[2]);
      expect(dist).toBeLessThanOrEqual(sampleZone.radius);

      // Verify destination is not inside forbidden box
      expect(isInsideObstacle(dest1[0], dest1[2], sampleZone.forbiddenBoxes)).toBe(false);
    });

    it("verifies all Westport population definitions have valid spawn zones and positions", () => {
      expect(WESTPORT_NPCS.length).toBeGreaterThanOrEqual(8);
      expect(WESTPORT_NPCS.length).toBeLessThanOrEqual(12);

      for (const def of WESTPORT_NPCS) {
        expect(def.id).toMatch(/^npc-/);
        expect(def.walkSpeed).toBeGreaterThanOrEqual(1.3);
        expect(def.walkSpeed).toBeLessThanOrEqual(1.9);
        expect(def.dialogueText.length).toBeGreaterThan(10);
        expect(WESTPORT_SPAWN_ZONES.some((z) => z.id === def.spawnZoneId)).toBe(true);
      }
    });
  });

  // -------------------------------------------------------------
  // 6 & 7 & 8. State Transitions, Idle & Wander Behavior
  // -------------------------------------------------------------
  describe("3. NPC State Machine & Behavior", () => {
    it("transitions from SPAWNING to IDLE upon timer completion", () => {
      const ctrl = new NPCController(sampleDef);
      expect(ctrl.state).toBe("SPAWNING");

      // Advance past spawn duration
      ctrl.update(0.6, null, sampleZone);
      expect(ctrl.state).toBe("IDLE");
      expect(ctrl.speed).toBe(0);
    });

    it("executes IDLE behavior and transitions to WALKING when WANDER behavior is active", () => {
      const ctrl = new NPCController(sampleDef);
      ctrl.transitionTo("IDLE", 0.5);

      ctrl.update(0.6, null, sampleZone);
      expect(ctrl.state).toBe("WALKING");
      expect(ctrl.targetDestination).not.toBeNull();
    });

    it("remains IDLE when behavior is IDLE without wandering", () => {
      const idleDef: NPCDefinition = { ...sampleDef, behavior: "IDLE" };
      const ctrl = new NPCController(idleDef);
      ctrl.transitionTo("IDLE", 0.5);

      ctrl.update(0.6, null, sampleZone);
      expect(ctrl.state).toBe("IDLE");
      expect(ctrl.targetDestination).toBeNull();
    });

    it("transitions from WALKING to WAITING when destination is reached", () => {
      const ctrl = new NPCController(sampleDef);
      ctrl.position = [0, 0, 0];
      ctrl.targetDestination = [0.1, 0, 0.1]; // Already within arrival threshold
      ctrl.transitionTo("WALKING", 10.0);

      ctrl.update(0.1, null, sampleZone);
      expect(ctrl.state).toBe("WAITING");
      expect(ctrl.targetDestination).toBeNull();
      expect(ctrl.speed).toBe(0);
    });

    it("transitions from WAITING to IDLE after wait duration expires", () => {
      const ctrl = new NPCController(sampleDef);
      ctrl.transitionTo("WAITING", 0.5);

      ctrl.update(0.6, null, sampleZone);
      expect(ctrl.state).toBe("IDLE");
    });
  });

  // -------------------------------------------------------------
  // 9. Movement, Navigation & Speed
  // -------------------------------------------------------------
  describe("4. Movement, Rotation & Speed", () => {
    it("steps position towards target destination at specified walk speed", () => {
      const currentPos: [number, number, number] = [0, 0, 0];
      const targetPos: [number, number, number] = [10, 0, 0];
      const speed = 1.5;
      const dt = 1.0;

      const result = stepMovement(currentPos, targetPos, Math.PI / 2, speed, 5.0, 0.35, dt);

      expect(result.newPosition[0]).toBeGreaterThan(0);
      expect(result.hasArrived).toBe(false);
      expect(result.actualSpeed).toBeGreaterThan(0);
    });

    it("smoothly interpolates rotation towards heading without snapping", () => {
      const currentYaw = 0;
      const targetYaw = Math.PI / 2;
      const turnSpeed = 2.0;
      const dt = 0.5;

      const newYaw = rotateTowards(currentYaw, targetYaw, turnSpeed * dt);
      expect(newYaw).toBeCloseTo(1.0, 1);
      expect(newYaw).toBeLessThan(targetYaw);
    });

    it("handles angular wrapping correctly across -PI and +PI boundary", () => {
      const angleA = Math.PI * 0.95;
      const angleB = -Math.PI * 0.95;

      const delta = getShortestAngleDelta(angleA, angleB);
      expect(Math.abs(delta)).toBeCloseTo(Math.PI * 0.1, 2);

      expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI, 2);
    });

    it("detects arrival when position is within arrivalThreshold", () => {
      const currentPos: [number, number, number] = [9.8, 0, 0];
      const targetPos: [number, number, number] = [10.0, 0, 0];

      const result = stepMovement(currentPos, targetPos, 0, 1.5, 5.0, 0.35, 0.1);
      expect(result.hasArrived).toBe(true);
      expect(result.actualSpeed).toBe(0);
    });
  });

  // -------------------------------------------------------------
  // 10. Simulation Tiers (LOD)
  // -------------------------------------------------------------
  describe("5. Simulation Tiers (LOD)", () => {
    it("assigns NEAR simulation tier when player is within 25m", () => {
      const ctrl = new NPCController(sampleDef);
      const tier = ctrl.updateSimulationTier(15);
      expect(tier).toBe("NEAR");
      expect(ctrl.simulationTier).toBe("NEAR");
    });

    it("assigns MID simulation tier when player is between 25m and 60m", () => {
      const ctrl = new NPCController(sampleDef);
      const tier = ctrl.updateSimulationTier(45);
      expect(tier).toBe("MID");
    });

    it("assigns FAR simulation tier when player is between 60m and 120m", () => {
      const ctrl = new NPCController(sampleDef);
      const tier = ctrl.updateSimulationTier(90);
      expect(tier).toBe("FAR");
    });

    it("assigns UNLOADED simulation tier when player is beyond 120m", () => {
      const ctrl = new NPCController(sampleDef);
      const tier = ctrl.updateSimulationTier(140);
      expect(tier).toBe("UNLOADED");
    });
  });

  // -------------------------------------------------------------
  // 14 & 15. Player Proximity & Perception
  // -------------------------------------------------------------
  describe("6. Player Proximity & Perception", () => {
    it("detects player presence within awareness radius", () => {
      const npcPos: [number, number, number] = [0, 0, 0];
      const playerPos: [number, number, number] = [0, 0, 4]; // 4m away

      const perception = evaluatePlayerPerception(npcPos, 0, playerPos, 7.0, Math.PI * 0.45);
      expect(perception.isPlayerNearby).toBe(true);
      expect(perception.playerDistance).toBeCloseTo(4.0, 1);
    });

    it("ignores player presence outside awareness radius", () => {
      const npcPos: [number, number, number] = [0, 0, 0];
      const playerPos: [number, number, number] = [0, 0, 15]; // 15m away

      const perception = evaluatePlayerPerception(npcPos, 0, playerPos, 7.0, Math.PI * 0.45);
      expect(perception.isPlayerNearby).toBe(false);
      expect(perception.playerDistance).toBe(15);
    });

    it("computes relative look-at angle when player is within forward vision field", () => {
      const npcPos: [number, number, number] = [0, 0, 0];
      const playerPos: [number, number, number] = [2, 0, 3];

      const perception = evaluatePlayerPerception(npcPos, 0, playerPos, 7.0, Math.PI * 0.45);
      expect(perception.isPlayerNearby).toBe(true);
      expect(perception.relativeLookAngle).not.toBe(0);
    });
  });

  // -------------------------------------------------------------
  // 12. Interaction System Integration
  // -------------------------------------------------------------
  describe("7. Phase 6 Interaction System Integration", () => {
    it("registers NPC as an interactable target with type TALK in InteractionRegistry", () => {
      const ctrl = manager.spawnNPC(sampleDef);

      const interactable = interactionRegistry.get(`npc-${ctrl.id}`);
      expect(interactable).toBeDefined();
      expect(interactable?.type).toBe("TALK");
      expect(interactable?.promptLabel).toBe("TALK");
      expect(interactable?.name).toBe(sampleDef.name);
    });

    it("updates interaction target position as NPC moves", () => {
      manager.spawnNPC(sampleDef);

      // Move player near so it is in NEAR tier
      manager.update(0.1, [0, 0, 0]);

      const interactable = interactionRegistry.get(`npc-${sampleDef.id}`);
      expect(interactable).toBeDefined();
      expect(interactable?.position).toEqual(sampleDef.basePosition);
    });

    it("triggers dialogue modal in InteractionStore when interaction action is executed", () => {
      const ctrl = manager.spawnNPC(sampleDef);
      const interactable = interactionRegistry.get(`npc-${ctrl.id}`);

      expect(interactable).toBeDefined();
      interactable?.action({
        target: interactable,
        playerPos: new THREE.Vector3(0, 0, 0),
        cameraDirection: new THREE.Vector3(0, 0, -1),
        timestamp: Date.now(),
      });

      const modal = interactionStore.getActiveReadable();
      expect(modal).not.toBeNull();
      expect(modal?.title).toBe(sampleDef.name);
      expect(modal?.content).toBe(sampleDef.dialogueText);
    });

    it("unregisters NPC from InteractionRegistry on despawn", () => {
      manager.spawnNPC(sampleDef);
      expect(interactionRegistry.get(`npc-${sampleDef.id}`)).toBeDefined();

      manager.despawnNPC(sampleDef.id);
      expect(interactionRegistry.get(`npc-${sampleDef.id}`)).toBeUndefined();
    });

    it("unregisters all chunk NPCs from InteractionRegistry when chunk despawns", () => {
      manager.spawnNPC(sampleDef);
      manager.spawnNPC({ ...sampleDef, id: "test-npc-b", chunkKey: "0,0" });

      expect(interactionRegistry.getCount()).toBe(2);

      manager.despawnByChunk("0,0");
      expect(interactionRegistry.getCount()).toBe(0);
      expect(registry.getCount()).toBe(0);
    });
  });

  // -------------------------------------------------------------
  // NPCManager & Telemetry Store
  // -------------------------------------------------------------
  describe("8. NPCManager & Telemetry Aggregation", () => {
    it("updates telemetry store with active count, tiers, and closest target", () => {
      manager.spawnNPC({ ...sampleDef, id: "npc-close", basePosition: [2, 0, 0] });
      manager.spawnNPC({ ...sampleDef, id: "npc-mid", basePosition: [35, 0, 0] });
      manager.spawnNPC({ ...sampleDef, id: "npc-far", basePosition: [80, 0, 0] });

      manager.update(0.1, [0, 0, 0]);

      const telemetry = store.getTelemetry();
      expect(telemetry.activeCount).toBe(3);
      expect(telemetry.nearTierCount).toBe(1);
      expect(telemetry.midTierCount).toBe(1);
      expect(telemetry.farTierCount).toBe(1);
      expect(telemetry.target?.id).toBe("npc-close");
    });
  });
});
