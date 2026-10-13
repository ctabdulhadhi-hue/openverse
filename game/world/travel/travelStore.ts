/**
 * Travel State Machine & Inter-Island Flight Store.
 *
 * Coordinates:
 * - Boarding state checks and inside-cabin validation
 * - Prevention of duplicate journeys from rapid clicks or re-renders
 * - Synchronous and asynchronous flight transitions
 * - Player teleportation upon safe touchdown
 * - Telemetry subscriptions for HUD travel status overlay
 */

import { DEFAULT_OUTBOUND_ROUTE, type FlightRoute, FLIGHT_ROUTES } from "./flightRoutes";
import { airportStore } from "../airport/aircraftStore";

export type TravelPhase =
  "IDLE" | "PREPARING" | "DEPARTING" | "IN_FLIGHT" | "ARRIVING" | "COMPLETED";

export interface TravelTelemetry {
  isTraveling: boolean;
  activeRoute: FlightRoute | null;
  phase: TravelPhase;
  statusMessage: string;
  progress: number; // 0..1
}

type TravelListener = (telemetry: TravelTelemetry) => void;

class TravelStore {
  private isTraveling = false;
  private activeRoute: FlightRoute | null = null;
  private phase: TravelPhase = "IDLE";
  private statusMessage = "";
  private progress = 0;
  private listeners: Set<TravelListener> = new Set();

  constructor() {
    this.attachWindowBridge();
  }

  private attachWindowBridge(): void {
    if (typeof window !== "undefined") {
      (
        window as unknown as {
          __OPENVERSE_TRAVEL__?: {
            getTelemetry: () => TravelTelemetry;
            startOutboundFlight: () => Promise<boolean>;
            startReturnFlight: () => Promise<boolean>;
            isTraveling: () => boolean;
            isInsideCabin: (x: number, y: number, z: number) => boolean;
          };
        }
      ).__OPENVERSE_TRAVEL__ = {
        getTelemetry: () => this.getTelemetry(),
        startOutboundFlight: () => this.startFlight("ROUTE_AGATTI_TO_LAGOON"),
        startReturnFlight: () => this.startFlight("ROUTE_LAGOON_TO_AGATTI"),
        isTraveling: () => this.isTraveling,
        isInsideCabin: (x, y, z) => this.isPlayerInsideCabin([x, y, z]),
      };
    }
  }

  /**
   * Validates if the player is positioned inside the physical aircraft cabin bounds at Agatti Stand 1.
   */
  public isPlayerInsideCabin(pos: [number, number, number]): boolean {
    const [x, y, z] = pos;
    // Fuselage cabin bounds at [140, 0.4, 52]:
    // X between 133.5 and 146.5, Y between 0.8 and 3.2, Z between 50.4 and 53.6
    return x >= 133.5 && x <= 146.5 && y >= 0.8 && y <= 3.2 && z >= 50.4 && z <= 53.6;
  }

  public getTelemetry(): TravelTelemetry {
    return {
      isTraveling: this.isTraveling,
      activeRoute: this.activeRoute,
      phase: this.phase,
      statusMessage: this.statusMessage,
      progress: this.progress,
    };
  }

  public subscribe(listener: TravelListener): () => void {
    this.listeners.add(listener);
    listener(this.getTelemetry());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const telemetry = this.getTelemetry();
    for (const listener of this.listeners) {
      try {
        listener(telemetry);
      } catch (err) {
        console.error("Error in travel listener:", err);
      }
    }
  }

  /**
   * Initiates an inter-island flight along the specified route.
   */
  public async startFlight(routeId: string): Promise<boolean> {
    // 1. Re-entrance / double-activation guard
    if (this.isTraveling) {
      return false;
    }

    const route: FlightRoute = FLIGHT_ROUTES[routeId] ?? DEFAULT_OUTBOUND_ROUTE;

    // 2. State verification for outbound flight from airport
    if (routeId === "ROUTE_AGATTI_TO_LAGOON") {
      const airportState = airportStore.getState();
      if (airportState !== "BOARDING" && airportState !== "PARKED") {
        console.warn(`Cannot start flight: Airport is in ${airportState} state`);
        return false;
      }
    }

    this.isTraveling = true;
    this.activeRoute = route;
    this.phase = "PREPARING";
    this.progress = 0.05;
    this.statusMessage = `Flight ${route.flightNumber} preparing for departure...`;
    airportStore.setState("PREPARING");
    this.notify();

    // Stage 1: Cabin Secure & Taxi (500ms)
    await new Promise((r) => setTimeout(r, 500));
    this.phase = "DEPARTING";
    this.progress = 0.25;
    this.statusMessage = `Flight ${route.flightNumber} taking off from ${route.originName}...`;
    airportStore.setState("DEPARTING");
    this.notify();

    // Stage 2: En Route / Cruising (1200ms)
    await new Promise((r) => setTimeout(r, 1000));
    this.phase = "IN_FLIGHT";
    this.progress = 0.65;
    this.statusMessage = `Cruising above the turquoise coral reef en route to ${route.destinationName}...`;
    airportStore.setState("IN_FLIGHT");
    this.notify();

    // Stage 3: Descent & Approach (600ms)
    await new Promise((r) => setTimeout(r, 700));
    this.phase = "ARRIVING";
    this.progress = 0.9;
    this.statusMessage = `Approaching ${route.destinationName}... Touchdown!`;
    airportStore.setState("ARRIVING");
    this.notify();

    // Stage 4: Arrive & Safe Placement
    await new Promise((r) => setTimeout(r, 400));

    // Place player at destination arrival coordinates
    if (typeof window !== "undefined") {
      const playerBridge = (
        window as unknown as {
          __OPENVERSE_PLAYER__?: {
            teleport: (x: number, y: number, z: number, yaw?: number) => void;
            setCameraYaw: (yaw: number, pitch?: number) => void;
          };
        }
      ).__OPENVERSE_PLAYER__;

      if (playerBridge?.teleport) {
        playerBridge.teleport(
          route.arrivalPosition[0],
          route.arrivalPosition[1],
          route.arrivalPosition[2],
          route.arrivalYaw,
        );
        playerBridge.setCameraYaw(route.arrivalYaw, 0.08);
      }
    }

    this.phase = "COMPLETED";
    this.progress = 1.0;
    this.statusMessage = `Welcome to ${route.destinationName}!`;
    airportStore.setState("PARKED");
    this.notify();

    // Brief delay to allow player camera and world chunks to settle before dismissing overlay
    await new Promise((r) => setTimeout(r, 500));
    this.isTraveling = false;
    this.phase = "IDLE";
    this.progress = 0;
    this.statusMessage = "";
    airportStore.setState("BOARDING");
    this.notify();

    return true;
  }

  public reset(): void {
    this.isTraveling = false;
    this.activeRoute = null;
    this.phase = "IDLE";
    this.statusMessage = "";
    this.progress = 0;
    this.notify();
  }
}

export const travelStore = new TravelStore();
