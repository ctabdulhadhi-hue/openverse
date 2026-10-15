import * as THREE from "three";
import { beforeEach, describe, expect, it } from "vitest";

import { VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { ambientAudioSystem } from "@/game/audio";
import { dayNightStore } from "@/game/dayNight";
import { discoveryStore } from "@/game/discovery";
import { interactionRegistry, interactionStore, type InteractionTarget } from "@/game/interaction";

describe("Phase 4 — World Activities & Freedom Systems", () => {
  beforeEach(() => {
    interactionRegistry.clear();
    interactionStore.reset();
    discoveryStore.reset();
  });

  describe("1. Maritime Sound & Acoustic Effects", () => {
    it("safely invokes playSeafarerConch without throwing", () => {
      expect(() => {
        ambientAudioSystem.playSeafarerConch();
      }).not.toThrow();
    });
  });

  describe("2. Discovery Store By ID & Duplicate Prevention", () => {
    it("discovers Outer Island Sanctuary by id and prevents duplicates", () => {
      // Find outer island in location data
      const outerLoc = VARANAYA_LOCATIONS.find((l) => l.id === "outer-island-sanctuary");
      expect(outerLoc).toBeDefined();

      // Initially not discovered
      expect(discoveryStore.isDiscovered("outer-island-sanctuary")).toBe(false);

      // First discovery
      const firstResult = discoveryStore.discoverById("outer-island-sanctuary");
      expect(firstResult).toBe(true);
      expect(discoveryStore.isDiscovered("outer-island-sanctuary")).toBe(true);

      const telemetry = discoveryStore.getTelemetry();
      expect(telemetry.recentDiscovery?.id).toBe("outer-island-sanctuary");
      expect(telemetry.recentDiscovery?.name).toBe("Outer Island Sanctuary");

      // Duplicate attempt must return false and not re-notify
      const secondResult = discoveryStore.discoverById("outer-island-sanctuary");
      expect(secondResult).toBe(false);
    });

    it("returns false for invalid location ids", () => {
      expect(discoveryStore.discoverById("non-existent-location-xyz")).toBe(false);
    });
  });

  describe("3. Grand Causeway Environmental Interactions", () => {
    it("registers and triggers Causeway Belvedere resting bench", () => {
      let rested = false;
      dayNightStore.setTime(14, 0); // 2:00 PM

      const benchTarget: InteractionTarget = {
        id: "bench-causeway-belvedere",
        name: "CAUSEWAY BELVEDERE BENCH",
        type: "USE",
        promptLabel: "REST ON CAUSEWAY BENCH",
        position: new THREE.Vector3(104, 2.6, 23.2),
        range: 3.6,
        priority: 7,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          rested = true;
          dayNightStore.advanceHours(3);
          ambientAudioSystem.playDiscoveryChime();
        },
      };

      interactionRegistry.register(benchTarget);
      expect(interactionRegistry.get("bench-causeway-belvedere")).toBeDefined();

      const retrieved = interactionRegistry.get("bench-causeway-belvedere")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(104, 2.6, 23.2),
        cameraDirection: new THREE.Vector3(0, 0, 1),
        timestamp: Date.now(),
      });

      expect(rested).toBe(true);
      expect(dayNightStore.getState().hours).toBe(17); // 5:00 PM
    });

    it("registers and triggers Ancient Seafarers Stele reading", () => {
      let readStele = false;
      const steleTarget: InteractionTarget = {
        id: "causeway-seafarer-stele",
        name: "SEAFARER GUILD STELE",
        type: "READ",
        promptLabel: "READ SEAFARERS STELE",
        position: new THREE.Vector3(49.5, 2.8, 19.3),
        range: 3.6,
        priority: 8,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          readStele = true;
          ambientAudioSystem.playDiscoveryChime();
        },
      };

      interactionRegistry.register(steleTarget);
      const retrieved = interactionRegistry.get("causeway-seafarer-stele")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(49.5, 2.8, 19.3),
        cameraDirection: new THREE.Vector3(1, 0, 0),
        timestamp: Date.now(),
      });

      expect(readStele).toBe(true);
    });

    it("registers and triggers Outer Island Sanctuary horizon contemplation", () => {
      let contemplated = false;
      const vistaTarget: InteractionTarget = {
        id: "causeway-outer-vista",
        name: "OUTER HORIZON PROMONTORY",
        type: "READ",
        promptLabel: "CONTEMPLATE OCEAN HORIZON",
        position: new THREE.Vector3(186, 2.8, 16),
        range: 4.2,
        priority: 9,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          contemplated = true;
          ambientAudioSystem.playSeafarerConch();
          discoveryStore.discoverById("outer-island-sanctuary");
        },
      };

      interactionRegistry.register(vistaTarget);
      const retrieved = interactionRegistry.get("causeway-outer-vista")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(186, 2.8, 16),
        cameraDirection: new THREE.Vector3(1, 0, 0),
        timestamp: Date.now(),
      });

      expect(contemplated).toBe(true);
      expect(discoveryStore.isDiscovered("outer-island-sanctuary")).toBe(true);
    });
  });

  describe("4. Maritime Craft & Dockside Interactions", () => {
    it("registers and triggers Traditional Kettu-maram Craft examination", () => {
      let examined = false;
      const craftTarget: InteractionTarget = {
        id: "harbor-catamaran-craft",
        name: "KETTU-MARAM OUTRIGGER",
        type: "READ",
        promptLabel: "EXAMINE KETTU-MARAM CRAFT",
        position: new THREE.Vector3(48, 0.8, 24),
        range: 4.2,
        priority: 8,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          examined = true;
          ambientAudioSystem.playWaterSplash();
        },
      };

      interactionRegistry.register(craftTarget);
      const retrieved = interactionRegistry.get("harbor-catamaran-craft")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(48, 0.8, 24),
        cameraDirection: new THREE.Vector3(0, 0, 1),
        timestamp: Date.now(),
      });

      expect(examined).toBe(true);
    });

    it("registers and triggers Dockside Coir Nets inspection", () => {
      let inspected = false;
      const netsTarget: InteractionTarget = {
        id: "harbor-dockside-nets",
        name: "COIR FISHING NETS",
        type: "READ",
        promptLabel: "INSPECT COIR NETS",
        position: new THREE.Vector3(34.8, 1.4, 18),
        range: 3.6,
        priority: 7,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          inspected = true;
        },
      };

      interactionRegistry.register(netsTarget);
      const retrieved = interactionRegistry.get("harbor-dockside-nets")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(34.8, 1.4, 18),
        cameraDirection: new THREE.Vector3(0, 0, 1),
        timestamp: Date.now(),
      });

      expect(inspected).toBe(true);
    });

    it("registers and triggers Harbor Elder Lore seat conversation", () => {
      let heardStory = false;
      const elderTarget: InteractionTarget = {
        id: "harbor-elder-story",
        name: "HARBOR WATCHMAN'S BENCH",
        type: "READ",
        promptLabel: "LISTEN TO HARBOR TALE",
        position: new THREE.Vector3(34.5, 1.4, 4),
        range: 3.8,
        priority: 8,
        enabled: true,
        requiresLineOfSight: false,
        action: () => {
          heardStory = true;
          ambientAudioSystem.playSeafarerConch();
        },
      };

      interactionRegistry.register(elderTarget);
      const retrieved = interactionRegistry.get("harbor-elder-story")!;
      retrieved.action({
        target: retrieved,
        playerPos: new THREE.Vector3(34.5, 1.4, 4),
        cameraDirection: new THREE.Vector3(0, 0, -1),
        timestamp: Date.now(),
      });

      expect(heardStory).toBe(true);
    });
  });
});
