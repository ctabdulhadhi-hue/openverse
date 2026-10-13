/**
 * Airport and Aircraft Type Definitions for OPENVERSE.
 * Fictional island aerodrome inspired by Agatti Island, Lakshadweep.
 */

export type AircraftState =
  "PARKED" | "BOARDING" | "PREPARING" | "DEPARTING" | "IN_FLIGHT" | "ARRIVING" | "LANDED";

export interface FlightScheduleItem {
  flightNumber: string;
  airline: string;
  destination: string;
  origin: string;
  scheduledTime: string;
  gate: string;
  aircraftType: string;
  status: "ON_TIME" | "BOARDING" | "DEPARTED" | "ARRIVED" | "DELAYED";
  remarks: string;
}

export interface AirportTelemetry {
  aircraftState: AircraftState;
  isBoardingAllowed: boolean;
  activeFlightNumber: string;
  currentStand: string;
  fuelLevelPercent: number;
  passengersBoarded: number;
  maxPassengers: number;
}
