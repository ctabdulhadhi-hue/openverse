import { beforeEach, describe, expect, it } from "vitest";

import { VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { LAGOON_MISSIONS } from "@/data/missions/lagoonIslandMissions";
import { missionManager } from "@/game/missions/MissionManager";
import { airportStore } from "@/game/world/airport/aircraftStore";
import {
  LAGOON_ISLE_COORDINATES,
  LAGOON_ISLE_ORIGIN,
  isWithinLagoonIsleBounds,
} from "@/game/world/island/lagoonIslandData";
import { worldToMapCoordinates } from "@/game/world/map/MapCoordinates";
import { VARANAYA_MAP_REGIONS } from "@/game/world/map/MapTypes";
import { FLIGHT_ROUTES } from "@/game/world/travel/flightRoutes";
import { travelStore } from "@/game/world/travel/travelStore";
import { WORLD_REGIONS } from "@/game/world/WorldConfig";
import { getRegionAt } from "@/game/world/WorldRegions";

describe("Stage 2 — Lagoon Isle & Air Travel Loop Unit Tests", () => {
  beforeEach(() => {
    airportStore.reset();
    travelStore.reset();
  });

  describe("1. Region Registration & Unique IDs", () => {
    it("registers lagoon-island in WORLD_REGIONS with correct category and color", () => {
      const region = WORLD_REGIONS["lagoon-island"];
      expect(region).toBeDefined();
      expect(region?.id).toBe("lagoon-island");
      expect(region?.name).toBe("Lagoon Isle");
      expect(region?.category).toBe("COAST");
      expect(region?.themeColor).toBe("#06b6d4");
    });

    it("registers LAGOON_ISLE in VARANAYA_MAP_REGIONS taxonomy", () => {
      const mapRegion = VARANAYA_MAP_REGIONS.LAGOON_ISLE;
      expect(mapRegion).toBeDefined();
      expect(mapRegion.name).toBe("Lagoon Isle");
      expect(mapRegion.themeColor).toBe("#06b6d4");
    });

    it("resolves world coordinates around (800, 600) to Lagoon Isle region", () => {
      const regionArrival = getRegionAt(800, 600);
      expect(regionArrival.id).toBe("lagoon-island");
      expect(regionArrival.name).toBe("Lagoon Isle");

      const regionVillage = getRegionAt(835, 580);
      expect(regionVillage.id).toBe("lagoon-island");

      const regionViewpoint = getRegionAt(850, 635);
      expect(regionViewpoint.id).toBe("lagoon-island");
    });
  });

  describe("2. Canonical World Coordinate Policy", () => {
    it("anchors Lagoon Isle origin at [800, 0, 600] separated from Varanaya", () => {
      expect(LAGOON_ISLE_ORIGIN).toEqual([800, 0, 600]);
      // Verify bounds detection helper
      expect(isWithinLagoonIsleBounds(800, 600)).toBe(true);
      expect(isWithinLagoonIsleBounds(835, 580)).toBe(true);
      // Varanaya origin is not within Lagoon Isle bounds
      expect(isWithinLagoonIsleBounds(0, 0)).toBe(false);
      expect(isWithinLagoonIsleBounds(140, 55)).toBe(false);
    });

    it("verifies all canonical island landmarks match their documented positions", () => {
      expect(LAGOON_ISLE_COORDINATES.arrival.global).toEqual([800, 1.2, 600]);
      expect(LAGOON_ISLE_COORDINATES.village.global).toEqual([835, 1.2, 580]);
      expect(LAGOON_ISLE_COORDINATES.beach.global).toEqual([775, 0.4, 620]);
      expect(LAGOON_ISLE_COORDINATES.forest.global).toEqual([755, 1.0, 570]);
      expect(LAGOON_ISLE_COORDINATES.viewpoint.global).toEqual([850, 6.2, 635]);
      expect(LAGOON_ISLE_COORDINATES.harbor.global).toEqual([820, 0.8, 640]);
    });

    it("registers all Lagoon Isle locations in VARANAYA_LOCATIONS with fast travel disabled", () => {
      const lagoonLocations = VARANAYA_LOCATIONS.filter((l) => l.regionId === "LAGOON_ISLE");
      expect(lagoonLocations.length).toBe(6);

      for (const loc of lagoonLocations) {
        // Fast travel must be disabled so player travels via aircraft
        expect(loc.fastTravelAvailable).toBe(false);
        // Map coordinates are within valid bounds
        expect(loc.coordinates.x).toBeGreaterThanOrEqual(70);
        expect(loc.coordinates.x).toBeLessThanOrEqual(100);
        expect(loc.coordinates.y).toBeGreaterThanOrEqual(70);
        expect(loc.coordinates.y).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("3. Airport-to-Island Route Registration", () => {
    it("registers outbound route from Agatti Airport to Lagoon Isle", () => {
      const route = FLIGHT_ROUTES.ROUTE_AGATTI_TO_LAGOON;
      expect(route).toBeDefined();
      if (!route) return;
      expect(route.routeId).toBe("ROUTE_AGATTI_TO_LAGOON");
      expect(route.flightNumber).toBe("LA-102");
      expect(route.originId).toBe("island-airport");
      expect(route.destinationId).toBe("lagoon-island");
      expect(route.destinationName).toBe("Lagoon Isle");
      expect(route.arrivalPosition).toEqual([800, 1.2, 600]);
      expect(route.returnRouteId).toBe("ROUTE_LAGOON_TO_AGATTI");
    });

    it("registers return route from Lagoon Isle to Agatti Airport", () => {
      const route = FLIGHT_ROUTES.ROUTE_LAGOON_TO_AGATTI;
      expect(route).toBeDefined();
      if (!route) return;
      expect(route.routeId).toBe("ROUTE_LAGOON_TO_AGATTI");
      expect(route.flightNumber).toBe("LA-103");
      expect(route.originId).toBe("lagoon-island");
      expect(route.destinationId).toBe("island-airport");
      expect(route.destinationName).toBe("Agatti Island Aerodrome");
      expect(route.arrivalPosition).toEqual([137.5, 1.6, 49.8]);
      expect(route.returnRouteId).toBe("ROUTE_AGATTI_TO_LAGOON");
    });
  });

  describe("4. Cabin Validation & Boarding Restrictions", () => {
    it("correctly determines if player is inside the physical aircraft cabin bounds", () => {
      // Center of aisle at Agatti Stand 1
      expect(travelStore.isPlayerInsideCabin([138.5, 1.85, 52.0])).toBe(true);
      expect(travelStore.isPlayerInsideCabin([140.0, 1.5, 52.0])).toBe(true);
      expect(travelStore.isPlayerInsideCabin([135.0, 2.0, 51.5])).toBe(true);

      // Outside the cabin (on stairs or apron)
      expect(travelStore.isPlayerInsideCabin([137.5, 1.6, 49.8])).toBe(false);
      expect(travelStore.isPlayerInsideCabin([140.0, 0.4, 40.0])).toBe(false);
      expect(travelStore.isPlayerInsideCabin([0, 1.2, 8])).toBe(false);
    });

    it("prevents departure if airport is in locked state", async () => {
      airportStore.forceDeparting();
      expect(airportStore.getState()).toBe("DEPARTING");

      const started = await travelStore.startFlight("ROUTE_AGATTI_TO_LAGOON");
      expect(started).toBe(false);
      expect(travelStore.getTelemetry().isTraveling).toBe(false);
    });

    it("prevents duplicate travel triggers while flight is in progress", async () => {
      airportStore.forceBoarding();

      const promise1 = travelStore.startFlight("ROUTE_AGATTI_TO_LAGOON");
      // Immediate second call should be rejected
      const promise2 = travelStore.startFlight("ROUTE_AGATTI_TO_LAGOON");

      const result2 = await promise2;
      expect(result2).toBe(false);

      const result1 = await promise1;
      expect(result1).toBe(true);
    });
  });

  describe("5. Stage 2 Missions & Idempotency", () => {
    it("registers 3 distinctive Lagoon Isle missions with valid objectives", () => {
      expect(LAGOON_MISSIONS.length).toBe(3);

      const exploration = LAGOON_MISSIONS.find((m) => m.id === "lagoon_isle_exploration");
      expect(exploration).toBeDefined();
      expect(exploration?.objectives.length).toBe(3);

      const salvage = LAGOON_MISSIONS.find((m) => m.id === "lagoon_harbor_salvage");
      expect(salvage).toBeDefined();
      expect(salvage?.objectives.length).toBe(2);

      const viewpoint = LAGOON_MISSIONS.find((m) => m.id === "lagoon_viewpoint_challenge");
      expect(viewpoint).toBeDefined();
      expect(viewpoint?.objectives.length).toBe(1);
    });

    it("ensures mission registration in MissionManager is idempotent", () => {
      for (const m of LAGOON_MISSIONS) {
        missionManager.registerMission(m);
        // Repeated registration should not throw or duplicate
        missionManager.registerMission(m);
        expect(missionManager.getMission(m.id)).toBeDefined();
      }
    });
  });

  describe("6. 2D Map Projection Consistency", () => {
    it("maps Lagoon Isle coordinates cleanly into the southeast ocean sector", () => {
      const mapArrival = worldToMapCoordinates(800, 600);
      expect(mapArrival.x).toBeGreaterThan(80);
      expect(mapArrival.x).toBeLessThan(95);
      expect(mapArrival.y).toBeGreaterThan(75);
      expect(mapArrival.y).toBeLessThan(90);

      const mapRidge = worldToMapCoordinates(850, 635);
      expect(mapRidge.x).toBeGreaterThan(mapArrival.x);
      expect(mapRidge.y).toBeGreaterThan(mapArrival.y);
    });
  });
});
