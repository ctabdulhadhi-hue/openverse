import * as THREE from "three";
import { beforeEach, describe, expect, it } from "vitest";

import { WESTPORT_NPCS } from "@/data/npcs/westportNPCs";
import { ambientAudioSystem } from "@/game/audio";
import { dayNightStore } from "@/game/dayNight";
import { interactionRegistry, interactionStore, type InteractionTarget } from "@/game/interaction";

describe("Phase 2 — Deep World Interactions & Systems", () => {
  beforeEach(() => {
    interactionRegistry.clear();
    interactionStore.reset();
  });

  describe("1. DayNightSystem Advance Hours", () => {
    it("advances simulated time by specified hours", () => {
      dayNightStore.setTime(8, 0); // 8:00 AM
      expect(dayNightStore.getState().hours).toBe(8);

      dayNightStore.advanceHours(3);
      expect(dayNightStore.getState().hours).toBe(11);
    });

    it("increments day count when time rolls past midnight", () => {
      dayNightStore.setTime(22, 0); // 10:00 PM
      const initialDay = dayNightStore.getState().dayNumber;

      dayNightStore.advanceHours(4); // Rolls over to 2:00 AM
      expect(dayNightStore.getState().hours).toBe(2);
      expect(dayNightStore.getState().dayNumber).toBe(initialDay + 1);
    });
  });

  describe("2. Procedural Web Audio Sound Effects", () => {
    it("safely invokes playWaterSplash without throwing", () => {
      expect(() => {
        ambientAudioSystem.playWaterSplash();
      }).not.toThrow();
    });

    it("safely invokes playDiscoveryChime without throwing", () => {
      expect(() => {
        ambientAudioSystem.playDiscoveryChime();
      }).not.toThrow();
    });
  });

  describe("3. Environmental World Interactions", () => {
    it("registers and triggers promenade bench rest interaction", () => {
      let rested = false;
      const benchTarget: InteractionTarget = {
        id: "bench-promenade-0",
        name: "PROMENADE BENCH",
        type: "USE",
        promptLabel: "REST ON BENCH",
        position: new THREE.Vector3(14, 0.6, 14),
        range: 3.6,
        priority: 6,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          rested = true;
          dayNightStore.advanceHours(3);
        },
      };

      interactionRegistry.register(benchTarget);
      expect(interactionRegistry.get("bench-promenade-0")).toBeDefined();

      const retrieved = interactionRegistry.get("bench-promenade-0")!;
      dayNightStore.setTime(9, 0);
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(14, 0.6, 14),
        cameraDirection: new THREE.Vector3(0, 0, 1),
        timestamp: Date.now(),
      });

      expect(rested).toBe(true);
      expect(dayNightStore.getState().hours).toBe(12);
    });

    it("registers and triggers harbor lookout inspection", () => {
      let surveyed = false;
      const lookoutTarget: InteractionTarget = {
        id: "harbor-pier-lookout",
        name: "NORTH PIER LOOKOUT",
        type: "READ",
        promptLabel: "SURVEY AZURE BAY",
        position: new THREE.Vector3(19, 0.8, 0),
        range: 4.0,
        priority: 8,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          surveyed = true;
        },
      };

      interactionRegistry.register(lookoutTarget);
      const retrieved = interactionRegistry.get("harbor-pier-lookout")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(19, 0.8, 0),
        cameraDirection: new THREE.Vector3(1, 0, 0),
        timestamp: Date.now(),
      });

      expect(surveyed).toBe(true);
    });

    it("registers and triggers shoreline fishing jetty", () => {
      let fished = false;
      const fishingTarget: InteractionTarget = {
        id: "harbor-fishing-jetty",
        name: "SOUTH PIER JETTY",
        type: "READ",
        promptLabel: "CAST FISHING LINE",
        position: new THREE.Vector3(21, 0.8, 0),
        range: 4.0,
        priority: 8,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          fished = true;
        },
      };

      interactionRegistry.register(fishingTarget);
      const retrieved = interactionRegistry.get("harbor-fishing-jetty")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(21, 0.8, 0),
        cameraDirection: new THREE.Vector3(1, 0, 0),
        timestamp: Date.now(),
      });

      expect(fished).toBe(true);
    });

    it("registers and triggers lotus fountain water drink", () => {
      let drank = false;
      const fountainTarget: InteractionTarget = {
        id: "fountain-lotus-terrace",
        name: "LOTUS FOUNTAIN",
        type: "USE",
        promptLabel: "DRINK FOUNTAIN WATER",
        position: new THREE.Vector3(0, 1.0, 0),
        range: 4.8,
        priority: 8,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          drank = true;
        },
      };

      interactionRegistry.register(fountainTarget);
      const retrieved = interactionRegistry.get("fountain-lotus-terrace")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(0, 1.0, 0),
        cameraDirection: new THREE.Vector3(0, 0, 1),
        timestamp: Date.now(),
      });

      expect(drank).toBe(true);
    });
  });

  describe("4. NPC World Lore & Alignment", () => {
    it("ensures all NPCs have rich dialogues reflecting the coastal kingdom of Varanaya", () => {
      for (const npc of WESTPORT_NPCS) {
        expect(npc.dialogueText.length).toBeGreaterThan(20);
        // Ensure no legacy references
        expect(npc.dialogueText).not.toContain("Westport");
        expect(npc.dialogueText).not.toContain("Central City");
        expect(npc.dialogueText).not.toContain("Mount Aethel");
      }
    });
  });
});
