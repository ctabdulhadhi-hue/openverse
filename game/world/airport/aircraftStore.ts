import type { AircraftState, AirportTelemetry, FlightScheduleItem } from "./airportTypes";

export const DEFAULT_FLIGHT_SCHEDULE: FlightScheduleItem[] = [
  {
    flightNumber: "LA-102",
    airline: "Lagoon Air",
    destination: "Bangaram Atoll",
    origin: "Varanaya Coastal",
    scheduledTime: "09:30 AM",
    gate: "Gate 1",
    aircraftType: "VA-72 Turboprop",
    status: "BOARDING",
    remarks: "Boarding at Gate 1 · Stand 1",
  },
  {
    flightNumber: "VCA-204",
    airline: "Varanaya Coastal Airways",
    destination: "Kavaratti Island",
    origin: "Agatti Island",
    scheduledTime: "11:15 AM",
    gate: "Gate 1",
    aircraftType: "VA-72 Turboprop",
    status: "ON_TIME",
    remarks: "Scheduled · Aircraft Preparing",
  },
  {
    flightNumber: "LA-308",
    airline: "Lagoon Air",
    destination: "Minicoy South",
    origin: "Varanaya Coastal",
    scheduledTime: "02:45 PM",
    gate: "Gate 1",
    aircraftType: "VA-72 Turboprop",
    status: "ON_TIME",
    remarks: "Estimated on time",
  },
  {
    flightNumber: "VCA-110",
    airline: "Varanaya Coastal Airways",
    destination: "Cochin Mainland",
    origin: "Agatti Island",
    scheduledTime: "05:00 PM",
    gate: "Gate 1",
    aircraftType: "VA-72 Turboprop",
    status: "ON_TIME",
    remarks: "Evening connection",
  },
];

type AircraftListener = (telemetry: AirportTelemetry) => void;

class AircraftStore {
  private state: AircraftState = "BOARDING";
  private activeFlightIndex = 0;
  private schedule: FlightScheduleItem[] = [...DEFAULT_FLIGHT_SCHEDULE];
  private passengersBoarded = 14;
  private maxPassengers = 24;
  private fuelLevelPercent = 92;
  private listeners: Set<AircraftListener> = new Set();

  constructor() {
    this.attachWindowBridge();
  }

  private attachWindowBridge(): void {
    if (typeof window !== "undefined") {
      (
        window as unknown as {
          __OPENVERSE_AIRPORT__?: {
            getState: () => AircraftState;
            setState: (state: AircraftState) => void;
            forceBoarding: () => void;
            forceDeparting: () => void;
            forceParked: () => void;
            getTelemetry: () => AirportTelemetry;
            getSchedule: () => FlightScheduleItem[];
          };
        }
      ).__OPENVERSE_AIRPORT__ = {
        getState: () => this.getState(),
        setState: (s) => this.setState(s),
        forceBoarding: () => this.forceBoarding(),
        forceDeparting: () => this.forceDeparting(),
        forceParked: () => this.forceParked(),
        getTelemetry: () => this.getTelemetry(),
        getSchedule: () => this.getSchedule(),
      };
    }
  }

  public getState(): AircraftState {
    return this.state;
  }

  public isBoardingAllowed(): boolean {
    return this.state === "BOARDING" || this.state === "PARKED";
  }

  public setState(nextState: AircraftState): void {
    if (this.state === nextState) return;
    this.state = nextState;

    // Update active flight status on departure board
    if (this.schedule[this.activeFlightIndex]) {
      const activeFlight = this.schedule[this.activeFlightIndex]!;
      if (nextState === "BOARDING") {
        activeFlight.status = "BOARDING";
        activeFlight.remarks = "Now Boarding at Gate 1";
      } else if (nextState === "PREPARING") {
        activeFlight.status = "ON_TIME";
        activeFlight.remarks = "Gate Closed · Departure Clearance";
      } else if (nextState === "DEPARTING" || nextState === "IN_FLIGHT") {
        activeFlight.status = "DEPARTED";
        activeFlight.remarks = "Airborne en route";
      } else if (nextState === "LANDED" || nextState === "PARKED") {
        activeFlight.status = "ARRIVED";
        activeFlight.remarks = "Parked at Stand 1";
      }
    }

    this.notify();
  }

  public forceBoarding(): void {
    this.setState("BOARDING");
  }

  public forceDeparting(): void {
    this.setState("DEPARTING");
  }

  public forceParked(): void {
    this.setState("PARKED");
  }

  public isBoardingOpen(): boolean {
    return this.isBoardingAllowed();
  }

  public boardPassenger(): boolean {
    if (!this.isBoardingAllowed()) return false;
    if (this.passengersBoarded >= this.maxPassengers) return false;
    this.passengersBoarded += 1;
    this.notify();
    return true;
  }

  public getSchedule(): FlightScheduleItem[] {
    return this.schedule.map((f) => ({ ...f }));
  }

  public getTelemetry(): AirportTelemetry {
    const activeFlight = this.schedule[this.activeFlightIndex];
    return {
      aircraftState: this.state,
      isBoardingAllowed: this.isBoardingAllowed(),
      activeFlightNumber: activeFlight?.flightNumber ?? "LA-102",
      currentStand: "Stand 1",
      fuelLevelPercent: this.fuelLevelPercent,
      passengersBoarded: this.passengersBoarded,
      maxPassengers: this.maxPassengers,
    };
  }

  public subscribe(listener: AircraftListener): () => void {
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
        console.error("Error in aircraft listener:", err);
      }
    }
  }

  public reset(): void {
    this.state = "BOARDING";
    this.passengersBoarded = 14;
    this.fuelLevelPercent = 92;
    this.schedule = DEFAULT_FLIGHT_SCHEDULE.map((f) => ({ ...f }));
    this.notify();
  }
}

export const airportStore = new AircraftStore();
export const aircraftStore = airportStore;
