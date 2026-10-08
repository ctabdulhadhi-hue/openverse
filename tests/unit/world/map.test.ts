import { beforeEach, describe, expect, it } from "vitest";

import { VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { VARANAYA_SMALL_FAVOR } from "@/data/missions/varanayaSmallFavor";
import { missionStore } from "@/game/missions/MissionStore";
import {
  isWithinMapBounds,
  mapToWorldCoordinates,
  VARANAYA_MAP_BOUNDS,
  worldToMapCoordinates,
} from "@/game/world/map/MapCoordinates";
import { VARANAYA_MAP_REGIONS } from "@/game/world/map/MapTypes";
import { playerPositionTracker } from "@/game/world/map/PlayerPositionTracker";

describe("Phase 10 / Pre-Phase-11 Varanaya Map System", () => {
  beforeEach(() => {
    playerPositionTracker.reset([0, 1.2, 8], 0);
    missionStore.reset();
  });

  describe("1. World Coordinate Conversion", () => {
    it("converts world origin [0, 0, 0] to accurate map percentages", () => {
      const coords = worldToMapCoordinates(0, 0);
      // minX: -100, maxX: 200 => range 300; 100/300 = 33.33%
      // minZ: -110, maxZ: 90 => range 200; 110/200 = 55.0%
      expect(coords.x).toBeCloseTo(33.33, 1);
      expect(coords.y).toBeCloseTo(55.0, 1);
    });

    it("converts map boundary points to 0% and 100%", () => {
      const nw = worldToMapCoordinates(VARANAYA_MAP_BOUNDS.minX, VARANAYA_MAP_BOUNDS.minZ);
      expect(nw.x).toBe(0);
      expect(nw.y).toBe(0);

      const se = worldToMapCoordinates(VARANAYA_MAP_BOUNDS.maxX, VARANAYA_MAP_BOUNDS.maxZ);
      expect(se.x).toBe(100);
      expect(se.y).toBe(100);
    });

    it("converts map percentages back to 3D world coordinates", () => {
      const origin = mapToWorldCoordinates(33.33, 55.0);
      expect(origin[0]).toBeCloseTo(0, 0);
      expect(origin[2]).toBeCloseTo(0, 0);

      const northwest = mapToWorldCoordinates(0, 0);
      expect(northwest[0]).toBe(VARANAYA_MAP_BOUNDS.minX);
      expect(northwest[2]).toBe(VARANAYA_MAP_BOUNDS.minZ);
    });

    it("performs bidirectional roundtrip conversion with high precision", () => {
      const testPoints: [number, number][] = [
        [0, 0],
        [28, 4],
        [0, -68],
        [-28, 2],
        [80, 16],
        [176, 16],
      ];

      for (const [wx, wz] of testPoints) {
        const mapCoords = worldToMapCoordinates(wx, wz);
        const worldCoords = mapToWorldCoordinates(mapCoords.x, mapCoords.y);
        expect(worldCoords[0]).toBeCloseTo(wx, 1);
        expect(worldCoords[2]).toBeCloseTo(wz, 1);
      }
    });

    it("clamps coordinates outside canonical map bounds to [0..100]", () => {
      const farWest = worldToMapCoordinates(-999, 0);
      expect(farWest.x).toBe(0);

      const farEast = worldToMapCoordinates(999, 0);
      expect(farEast.x).toBe(100);

      const farNorth = worldToMapCoordinates(0, -999);
      expect(farNorth.y).toBe(0);

      const farSouth = worldToMapCoordinates(0, 999);
      expect(farSouth.y).toBe(100);
    });

    it("correctly identifies positions within map bounds", () => {
      expect(isWithinMapBounds(0, 0)).toBe(true);
      expect(isWithinMapBounds(-28, 2)).toBe(true);
      expect(isWithinMapBounds(176, 16)).toBe(true);
      expect(isWithinMapBounds(-500, 0)).toBe(false);
      expect(isWithinMapBounds(0, 500)).toBe(false);
    });
  });

  describe("2. Varanaya Location Registration & Architectural Synchronicity", () => {
    it("contains all 11 required primary Varanaya locations", () => {
      const ids = VARANAYA_LOCATIONS.map((l) => l.id);
      expect(ids).toContain("royal-promenade");
      expect(ids).toContain("sacred-monument-district");
      expect(ids).toContain("grand-sanctuary");
      expect(ids).toContain("royal-waterfront");
      expect(ids).toContain("harbor-spice-market");
      expect(ids).toContain("palatial-haveli-avenues");
      expect(ids).toContain("royal-palace-gardens");
      expect(ids).toContain("grand-sea-gate");
      expect(ids).toContain("grand-causeway-bridge");
      expect(ids).toContain("outer-island-sanctuary");
      expect(ids).toContain("harbor-watchtower");
    });

    it("synchronizes 3D coordinates exactly with 3D world architecture", () => {
      const sanctuary = VARANAYA_LOCATIONS.find((l) => l.id === "grand-sanctuary");
      expect(sanctuary).toBeDefined();
      expect(sanctuary?.position).toEqual([0, 0, -68]);

      const seaGate = VARANAYA_LOCATIONS.find((l) => l.id === "grand-sea-gate");
      expect(seaGate).toBeDefined();
      expect(seaGate?.position).toEqual([-28, 0, 2]);

      const waterfront = VARANAYA_LOCATIONS.find((l) => l.id === "royal-waterfront");
      expect(waterfront).toBeDefined();
      expect(waterfront?.position).toEqual([28, 0, 4]);

      const outerIsland = VARANAYA_LOCATIONS.find((l) => l.id === "outer-island-sanctuary");
      expect(outerIsland).toBeDefined();
      expect(outerIsland?.position).toEqual([176, 0, 16]);
    });

    it("verifies map coordinates match the worldToMapCoordinates transformation", () => {
      for (const loc of VARANAYA_LOCATIONS) {
        const expected = worldToMapCoordinates(loc.position[0], loc.position[2]);
        expect(loc.coordinates.x).toBeCloseTo(expected.x, 1);
        expect(loc.coordinates.y).toBeCloseTo(expected.y, 1);
      }
    });

    it("associates all locations with valid regional taxonomy", () => {
      const validRegions = Object.keys(VARANAYA_MAP_REGIONS);
      for (const loc of VARANAYA_LOCATIONS) {
        expect(validRegions).toContain(loc.regionId);
        expect(loc.regionName).toBeTruthy();
        expect(loc.description).toBeTruthy();
        expect(loc.tagline).toBeTruthy();
        expect(loc.icon).toBeTruthy();
      }
    });
  });

  describe("3. Player Position Synchronization", () => {
    it("initializes to canonical spawn point [0, 1.2, 8]", () => {
      const pos = playerPositionTracker.getPosition();
      expect(pos).toEqual([0, 1.2, 8]);
      expect(playerPositionTracker.getYaw()).toBe(0);
    });

    it("updates position and yaw synchronously", () => {
      playerPositionTracker.update({ x: 28, y: 0.1, z: 16 }, 1.57);
      const pos = playerPositionTracker.getPosition();
      expect(pos).toEqual([28, 0.1, 16]);
      expect(playerPositionTracker.getYaw()).toBe(1.57);
    });

    it("notifies subscribers when player position updates", () => {
      let notifiedPos: [number, number, number] | null = null;
      let notifiedYaw: number | null = null;

      const unsub = playerPositionTracker.subscribe((pos, yaw) => {
        notifiedPos = pos;
        notifiedYaw = yaw;
      });

      playerPositionTracker.update({ x: 50, y: 2, z: -30 }, 3.14);
      expect(notifiedPos).toEqual([50, 2, -30]);
      expect(notifiedYaw).toBe(3.14);

      unsub();
      playerPositionTracker.update({ x: 0, y: 0, z: 0 }, 0);
      // Should not have been called after unsub
      expect(notifiedPos).toEqual([50, 2, -30]);
    });

    it("converts player 3D position accurately to map percentage coordinates", () => {
      playerPositionTracker.update({ x: 0, y: 1.2, z: 0 });
      const pos = playerPositionTracker.getPosition();
      const mapCoords = worldToMapCoordinates(pos[0], pos[2]);
      expect(mapCoords.x).toBeCloseTo(33.33, 1);
      expect(mapCoords.y).toBeCloseTo(55.0, 1);
    });
  });

  describe("4. Mission Map Markers Hook", () => {
    it("surfaces mission map markers with accurate world positions", () => {
      missionStore.addActiveMission({
        id: VARANAYA_SMALL_FAVOR.id,
        definition: VARANAYA_SMALL_FAVOR,
        state: "ACTIVE",
        currentObjectiveIndex: 0,
        objectives: VARANAYA_SMALL_FAVOR.objectives.map((o) => ({
          id: o.id,
          state: "ACTIVE",
          completed: false,
          currentCount: 0,
          requiredCount: 1,
        })),
        startTime: Date.now(),
        tracked: true,
      });

      const markers = missionStore.getMapMarkers();
      expect(markers).toHaveLength(1);
      expect(markers[0]?.missionId).toBe("varanaya_small_favor");
      expect(markers[0]?.tracked).toBe(true);
      expect(markers[0]?.position).toEqual([26, 1.4, 4]);

      const mapCoords = worldToMapCoordinates(markers[0]!.position[0], markers[0]!.position[2]);
      expect(mapCoords.x).toBeCloseTo(42.0, 1);
      expect(mapCoords.y).toBeCloseTo(57.0, 1);
    });
  });

  describe("5. Discovery & Fast Travel State", () => {
    it("marks core settlement hubs as discovered initially", () => {
      const promenade = VARANAYA_LOCATIONS.find((l) => l.id === "royal-promenade");
      expect(promenade?.discovered).toBe(true);
      expect(promenade?.fastTravelAvailable).toBe(true);

      const waterfront = VARANAYA_LOCATIONS.find((l) => l.id === "royal-waterfront");
      expect(waterfront?.discovered).toBe(true);
      expect(waterfront?.fastTravelAvailable).toBe(true);
    });

    it("marks distant sanctuaries and wilderness as undiscovered initially", () => {
      const outerIsland = VARANAYA_LOCATIONS.find((l) => l.id === "outer-island-sanctuary");
      expect(outerIsland?.discovered).toBe(false);
      expect(outerIsland?.fastTravelAvailable).toBe(false);

      const wilderness = VARANAYA_LOCATIONS.find((l) => l.id === "western-approach");
      expect(wilderness?.discovered).toBe(false);
      expect(wilderness?.fastTravelAvailable).toBe(false);
    });
  });

  describe("6. Obsolete Map Content Verification", () => {
    it("ensures no obsolete Westport or Pine Crest locations remain in the active map", () => {
      const locationNames = VARANAYA_LOCATIONS.map((l) => l.name.toLowerCase());
      const locationIds = VARANAYA_LOCATIONS.map((l) => l.id.toLowerCase());

      expect(locationIds).not.toContain("westport-harbor");
      expect(locationIds).not.toContain("pine-crest-ridge");
      expect(locationIds).not.toContain("aethel-mountain-peak");
      expect(locationIds).not.toContain("sunken-cove");
      expect(locationIds).not.toContain("central-district");

      expect(locationNames).not.toContain("pine crest forest");
      expect(locationNames).not.toContain("mount aethel peak");
      expect(locationNames).not.toContain("sunken cove");
    });
  });
});
