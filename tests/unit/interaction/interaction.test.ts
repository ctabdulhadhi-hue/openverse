import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_INTERACTION_CONFIG,
  InteractionDetector,
  InteractionManager,
  InteractionRegistry,
  InteractionStore,
  interactionEventBus,
  type InteractionTarget,
} from "@/game/interaction";
import { PlayerInputManager } from "@/game/player";

describe("Phase 6 — Interaction System", () => {
  let registry: InteractionRegistry;
  let detector: InteractionDetector;
  let store: InteractionStore;
  let manager: InteractionManager;

  const playerPos = new THREE.Vector3(0, 0, 0);
  const forwardDir = new THREE.Vector3(0, 0, -1); // Facing North (-Z)

  beforeEach(() => {
    registry = new InteractionRegistry();
    detector = new InteractionDetector(DEFAULT_INTERACTION_CONFIG);
    store = new InteractionStore();
    manager = new InteractionManager(detector, registry, store);
    interactionEventBus.clear();
  });

  describe("1. InteractionRegistry Lifecycle", () => {
    it("registers and retrieves an interaction target", () => {
      const target: InteractionTarget = {
        id: "test-sign",
        name: "Welcome Sign",
        type: "READ",
        position: [0, 0, -3],
        range: 4,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(target);
      expect(registry.getCount()).toBe(1);
      expect(registry.get("test-sign")?.name).toBe("Welcome Sign");
    });

    it("prevents duplicate registrations and updates in place", () => {
      const target1: InteractionTarget = {
        id: "door-1",
        name: "Outpost Door",
        type: "OPEN",
        position: [2, 0, 0],
        range: 3,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      const target2: InteractionTarget = {
        ...target1,
        promptLabel: "CLOSE DOOR",
        type: "CLOSE",
      };

      registry.register(target1);
      registry.register(target2);

      expect(registry.getCount()).toBe(1);
      expect(registry.get("door-1")?.promptLabel).toBe("CLOSE DOOR");
    });

    it("unregisters targets cleanly by id", () => {
      const target: InteractionTarget = {
        id: "bench-1",
        name: "Plaza Bench",
        type: "USE",
        position: [1, 0, 1],
        range: 2,
        priority: 0,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(target);
      expect(registry.getCount()).toBe(1);

      registry.unregister("bench-1");
      expect(registry.getCount()).toBe(0);
      expect(registry.get("bench-1")).toBeUndefined();
    });

    it("unregisters all targets associated with an unmounted chunk key (streaming support)", () => {
      const targetA: InteractionTarget = {
        id: "chunk-a-sign",
        chunkKey: "0,0",
        name: "Town Sign",
        type: "READ",
        position: [0, 0, 0],
        range: 3,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      const targetB: InteractionTarget = {
        id: "chunk-b-tree",
        chunkKey: "-1,-2",
        name: "Ancient Tree Plaque",
        type: "READ",
        position: [-200, 0, -400],
        range: 3,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(targetA);
      registry.register(targetB);
      expect(registry.getCount()).toBe(2);

      // Unload chunk -1,-2
      registry.unregisterByChunk("-1,-2");
      expect(registry.getCount()).toBe(1);
      expect(registry.get("chunk-b-tree")).toBeUndefined();
      expect(registry.get("chunk-a-sign")).toBeDefined();
    });
  });

  describe("2. Spatial Queries and Candidate Filtering", () => {
    it("filters out targets beyond max radial query distance", () => {
      const nearTarget: InteractionTarget = {
        id: "near",
        name: "Near Item",
        type: "USE",
        position: [0, 0, -3],
        range: 4,
        priority: 0,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      const farTarget: InteractionTarget = {
        id: "far",
        name: "Far Mountain",
        type: "READ",
        position: [0, 0, -200],
        range: 4,
        priority: 0,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(nearTarget);
      registry.register(farTarget);

      const nearby = registry.queryNearby(playerPos, 10);
      expect(nearby.length).toBe(1);
      expect(nearby[0]?.id).toBe("near");
    });

    it("filters out disabled targets", () => {
      const disabledTarget: InteractionTarget = {
        id: "locked-gate",
        name: "Locked Gate",
        type: "OPEN",
        position: [0, 0, -2],
        range: 3,
        priority: 1,
        enabled: false,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(disabledTarget);
      const result = detector.evaluate({
        playerPos,
        cameraForward: forwardDir,
        registry,
      });

      expect(result.bestCandidate).toBeNull();
    });

    it("filters out targets behind the player outside the detection cone", () => {
      const behindTarget: InteractionTarget = {
        id: "behind-sign",
        name: "Sign Behind Player",
        type: "READ",
        position: [0, 0, 2], // South (+Z), but camera looks North (-Z)
        range: 3.5,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(behindTarget);
      const result = detector.evaluate({
        playerPos,
        cameraForward: forwardDir,
        registry,
      });

      expect(result.bestCandidate).toBeNull();
    });

    it("filters out targets exceeding their specific interaction range", () => {
      const target: InteractionTarget = {
        id: "tiny-switch",
        name: "Mini Switch",
        type: "USE",
        position: [0, 0, -4],
        range: 2.0, // Player is 4m away, range is only 2m
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(target);
      const result = detector.evaluate({
        playerPos,
        cameraForward: forwardDir,
        registry,
      });

      expect(result.bestCandidate).toBeNull();
    });
  });

  describe("3. Priority and Tie-Breaking Selection", () => {
    it("selects target with higher priority over lower priority", () => {
      const lowPriority: InteractionTarget = {
        id: "low",
        name: "Crate",
        type: "USE",
        position: [0, 0, -2],
        range: 3.5,
        priority: 0,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      const highPriority: InteractionTarget = {
        id: "high",
        name: "Quest Door",
        type: "OPEN",
        position: [0.5, 0, -2.5],
        range: 3.5,
        priority: 10,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(lowPriority);
      registry.register(highPriority);

      const result = detector.evaluate({
        playerPos,
        cameraForward: forwardDir,
        registry,
      });

      expect(result.bestCandidate?.target.id).toBe("high");
    });

    it("breaks equal-priority ties using alignment with camera forward center", () => {
      // Both at priority 5 and equal distance 3m, but one is directly centered
      const centered: InteractionTarget = {
        id: "centered",
        name: "Center Sign",
        type: "READ",
        position: [0, 0, -3],
        range: 3.5,
        priority: 5,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      const offCenter: InteractionTarget = {
        id: "off-center",
        name: "Side Sign",
        type: "READ",
        position: [1.8, 0, -2.4],
        range: 3.5,
        priority: 5,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(centered);
      registry.register(offCenter);

      const result = detector.evaluate({
        playerPos,
        cameraForward: forwardDir,
        registry,
      });

      expect(result.bestCandidate?.target.id).toBe("centered");
    });
  });

  describe("4. Interaction Lifecycle and Execution", () => {
    it("dispatches target_entered and target_exited lifecycle events", () => {
      const target: InteractionTarget = {
        id: "door-test",
        name: "Iron Door",
        type: "OPEN",
        position: [0, 0, -2],
        range: 3,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: vi.fn(),
      };

      registry.register(target);

      const enteredSpy = vi.fn();
      const exitedSpy = vi.fn();
      interactionEventBus.subscribe((e) => {
        if (e.type === "target_entered") enteredSpy(e);
        if (e.type === "target_exited") exitedSpy(e);
      });

      // 1. Look towards target
      manager.update(playerPos, forwardDir);
      expect(enteredSpy).toHaveBeenCalledTimes(1);

      // 2. Turn camera away
      const awayDir = new THREE.Vector3(0, 0, 1);
      manager.update(playerPos, awayDir);
      expect(exitedSpy).toHaveBeenCalledTimes(1);
    });

    it("triggers target action and updates interaction store telemetry", async () => {
      const actionMock = vi.fn();
      const target: InteractionTarget = {
        id: "kiosk-test",
        name: "Westport Kiosk",
        type: "USE",
        position: [0, 0, -2],
        range: 3,
        priority: 1,
        enabled: true,
        requiresLineOfSight: false,
        action: actionMock,
      };

      registry.register(target);
      manager.update(playerPos, forwardDir);

      const executed = await manager.trigger(playerPos, forwardDir);
      expect(executed).toBe(true);
      expect(actionMock).toHaveBeenCalledTimes(1);

      const telemetry = store.getTelemetry();
      expect(telemetry.targetId).toBe("kiosk-test");
      expect(telemetry.targetType).toBe("USE");
      expect(telemetry.promptLabel).toBe("USE Westport Kiosk");
    });
  });

  describe("5. Input Integration and Menu Suppression", () => {
    it("records KeyE down and consumes interaction once", () => {
      const input = new PlayerInputManager();
      input.attach();

      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE" }));
      expect(input.getSnapshot().interact).toBe(true);

      const consumed = input.consumeInteract();
      expect(consumed).toBe(true);

      // Subsequent consumption returns false until pressed again
      expect(input.consumeInteract()).toBe(false);

      input.detach();
    });

    it("suppresses interaction input when disabled (e.g. pause or map menu open)", () => {
      const input = new PlayerInputManager();
      input.attach();

      input.setEnabled(false);
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE" }));

      expect(input.getSnapshot().interact).toBe(false);
      expect(input.consumeInteract()).toBe(false);

      input.detach();
    });
  });
});
