import { beforeEach, describe, expect, it } from "vitest";

import { VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { airportStore } from "@/game/world/airport/aircraftStore";
import type { AircraftState } from "@/game/world/airport/airportTypes";
import { getRegionAt } from "@/game/world/WorldRegions";

describe("Stage 1 — Island Airport & Interactive Aircraft Unit Tests", () => {
  beforeEach(() => {
    airportStore.reset();
  });

  describe("1. Aircraft State Machine & Transitions", () => {
    it("initializes in BOARDING state with boarding allowed", () => {
      const telemetry = airportStore.getTelemetry();
      expect(telemetry.aircraftState).toBe("BOARDING");
      expect(telemetry.isBoardingAllowed).toBe(true);
      expect(airportStore.isBoardingOpen()).toBe(true);
    });

    it("allows boarding in PARKED and BOARDING states only", () => {
      const states: AircraftState[] = [
        "PARKED",
        "BOARDING",
        "PREPARING",
        "DEPARTING",
        "IN_FLIGHT",
        "ARRIVING",
        "LANDED",
      ];

      for (const st of states) {
        airportStore.setState(st);
        const isOpen = airportStore.isBoardingOpen();
        if (st === "PARKED" || st === "BOARDING") {
          expect(isOpen).toBe(true);
        } else {
          expect(isOpen).toBe(false);
        }
      }
    });

    it("supports forceBoarding test override", () => {
      airportStore.setState("IN_FLIGHT");
      expect(airportStore.isBoardingOpen()).toBe(false);

      airportStore.forceBoarding();
      expect(airportStore.getState()).toBe("BOARDING");
      expect(airportStore.isBoardingOpen()).toBe(true);
      expect(airportStore.getTelemetry().isBoardingAllowed).toBe(true);
    });

    it("supports forceDeparting test override and locks boarding", () => {
      airportStore.forceBoarding();
      expect(airportStore.isBoardingOpen()).toBe(true);

      airportStore.forceDeparting();
      expect(airportStore.getState()).toBe("DEPARTING");
      expect(airportStore.isBoardingOpen()).toBe(false);
      expect(airportStore.getTelemetry().isBoardingAllowed).toBe(false);
    });

    it("handles passenger boarding increments up to max capacity", () => {
      airportStore.setState("BOARDING");
      const initial = airportStore.getTelemetry().passengersBoarded;
      const success = airportStore.boardPassenger();
      expect(success).toBe(true);
      expect(airportStore.getTelemetry().passengersBoarded).toBe(initial + 1);
    });

    it("rejects boarding passenger when flight is not boarding", () => {
      airportStore.setState("DEPARTING");
      const success = airportStore.boardPassenger();
      expect(success).toBe(false);
    });
  });

  describe("2. Flight Schedule Timetable", () => {
    it("maintains consistent scheduled flight information", () => {
      const schedule = airportStore.getSchedule();
      expect(schedule.length).toBeGreaterThanOrEqual(4);

      const flight1 = schedule[0];
      expect(flight1?.flightNumber).toBe("LA-102");
      expect(flight1?.airline).toBe("Lagoon Air");
      expect(flight1?.aircraftType).toBe("VA-72 Turboprop");
      expect(flight1?.status).toBe("BOARDING");
    });

    it("notifies telemetry subscribers upon state change", () => {
      let notifiedState: AircraftState | null = null;
      const unsub = airportStore.subscribe((t) => {
        notifiedState = t.aircraftState;
      });

      airportStore.setState("PREPARING");
      expect(notifiedState).toBe("PREPARING");
      unsub();
    });
  });

  describe("3. Geographic World Coordinates & Map Integration", () => {
    it("correctly resolves player position to Island Airport region", () => {
      // Terminal coordinates
      const regionTerminal = getRegionAt(140, 36);
      expect(regionTerminal.id).toBe("island-airport");
      expect(regionTerminal.name).toBe("Agatti Island Aerodrome");

      // Apron Stand 1 coordinates
      const regionApron = getRegionAt(140, 52);
      expect(regionApron.id).toBe("island-airport");

      // Runway coordinates
      const regionRunway = getRegionAt(170, 68);
      expect(regionRunway.id).toBe("island-airport");
    });

    it("registers Agatti Island Aerodrome in VARANAYA_LOCATIONS with fast travel enabled", () => {
      const airportLoc = VARANAYA_LOCATIONS.find((loc) => loc.id === "varanaya-island-airport");
      expect(airportLoc).toBeDefined();
      expect(airportLoc?.name).toBe("Agatti Island Aerodrome");
      expect(airportLoc?.type).toBe("AIRPORT");
      expect(airportLoc?.regionId).toBe("ISLAND_AIRPORT");
      expect(airportLoc?.fastTravelAvailable).toBe(true);
      expect(airportLoc?.position).toEqual([140, 1.2, 55]);
    });
  });
});
