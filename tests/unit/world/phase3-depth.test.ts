import * as THREE from "three";
import { beforeEach, describe, expect, it } from "vitest";

import { ambientAudioSystem } from "@/game/audio";
import { interactionRegistry, interactionStore, type InteractionTarget } from "@/game/interaction";

describe("Phase 3 — World Depth & Immersion Systems", () => {
  beforeEach(() => {
    interactionRegistry.clear();
    interactionStore.reset();
  });

  describe("1. Enclosed Space Acoustic Damping Detection", () => {
    it("detects when player is inside the Sacred Garbhagriha Inner Sanctum", () => {
      // Sanctum center is roughly [0, 4.0, -65], box bounds approx x: [-4, 4], y: [2, 12], z: [-72, -58]
      expect(ambientAudioSystem.isInsideEnclosedSpace(0, 4.0, -65)).toBe(true);
      expect(ambientAudioSystem.isInsideEnclosedSpace(2.5, 3.8, -63)).toBe(true);
    });

    it("detects when player is inside the West Gatehouse Guard Room", () => {
      // Gatehouse guard room is at [-16, 1.5, -2] with radius 4.5
      expect(ambientAudioSystem.isInsideEnclosedSpace(-16, 1.5, -2)).toBe(true);
      expect(ambientAudioSystem.isInsideEnclosedSpace(-15, 1.2, -3)).toBe(true);
    });

    it("detects when player is inside the Merchant Haveli Shaded Courtyard", () => {
      // Merchant haveli courtyard is at [42, 1.5, -32] with radius 6.5
      expect(ambientAudioSystem.isInsideEnclosedSpace(42, 1.5, -32)).toBe(true);
      expect(ambientAudioSystem.isInsideEnclosedSpace(44, 1.2, -30)).toBe(true);
    });

    it("correctly identifies open outdoor locations as not enclosed", () => {
      // Royal Promenade plaza
      expect(ambientAudioSystem.isInsideEnclosedSpace(0, 1.0, 10)).toBe(false);
      // Azure Bay pier
      expect(ambientAudioSystem.isInsideEnclosedSpace(35, 0.5, 0)).toBe(false);
      // Grand Sanctuary outer ceremonial staircase
      expect(ambientAudioSystem.isInsideEnclosedSpace(0, 1.0, -20)).toBe(false);
    });
  });

  describe("2. Ceremonial Sacred Bell Multi-Harmonic Sound", () => {
    it("safely invokes playSacredBell without throwing", () => {
      expect(() => {
        ambientAudioSystem.playSacredBell();
      }).not.toThrow();
    });
  });

  describe("3. Grand Sanctuary Inner Sanctum Altar Interaction", () => {
    it("registers and triggers lotus offering & meditation at the sacred altar", () => {
      let offered = false;
      const altarTarget: InteractionTarget = {
        id: "sanctum-altar-offering",
        name: "CONSECRATED ALTAR",
        type: "USE",
        promptLabel: "OFFER LOTUS & MEDITATE",
        position: new THREE.Vector3(0, 3.8, -66),
        range: 3.5,
        priority: 9,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          offered = true;
          ambientAudioSystem.playSacredBell();
        },
      };

      interactionRegistry.register(altarTarget);
      expect(interactionRegistry.get("sanctum-altar-offering")).toBeDefined();

      const retrieved = interactionRegistry.get("sanctum-altar-offering")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(0, 3.8, -65),
        cameraDirection: new THREE.Vector3(0, 0, -1),
        timestamp: Date.now(),
      });

      expect(offered).toBe(true);
    });
  });
});
