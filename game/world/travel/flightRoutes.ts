/**
 * Canonical Flight Route Registry for OPENVERSE Air Travel.
 *
 * Defines the single source of truth for inter-island routes,
 * flight numbers, departure/arrival waypoints, and boarding requirements.
 */

import { LAGOON_ISLE_COORDINATES } from "../island/lagoonIslandData";

export interface FlightRoute {
  routeId: string;
  flightNumber: string;
  airline: string;
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  departurePosition: [number, number, number];
  arrivalPosition: [number, number, number];
  arrivalYaw: number;
  returnRouteId: string;
  travelDurationMs: number;
  aircraftType: string;
}

export const OUTBOUND_ROUTE: FlightRoute = {
  routeId: "ROUTE_AGATTI_TO_LAGOON",
  flightNumber: "LA-102",
  airline: "Lagoon Air",
  originId: "island-airport",
  originName: "Agatti Island Aerodrome",
  destinationId: "lagoon-island",
  destinationName: "Lagoon Isle",
  // In-cabin departure station at front aisle
  departurePosition: [137.5, 1.85, 52.0],
  // Lagoon Isle arrival shelter transfer area
  arrivalPosition: LAGOON_ISLE_COORDINATES.arrival.global,
  arrivalYaw: 0, // Facing North toward Coral Bay Settlement
  returnRouteId: "ROUTE_LAGOON_TO_AGATTI",
  travelDurationMs: 2600,
  aircraftType: "VA-72 Regional Turboprop",
};

export const RETURN_ROUTE: FlightRoute = {
  routeId: "ROUTE_LAGOON_TO_AGATTI",
  flightNumber: "LA-103",
  airline: "Lagoon Air",
  originId: "lagoon-island",
  originName: "Lagoon Isle Airstrip",
  destinationId: "island-airport",
  destinationName: "Agatti Island Aerodrome",
  // Lagoon Isle return flight boarding station
  departurePosition: LAGOON_ISLE_COORDINATES.arrival.global,
  // Agatti Stand 1 mobile boarding stairs platform
  arrivalPosition: [137.5, 1.6, 49.8],
  arrivalYaw: Math.PI, // Facing south towards Apron & Terminal
  returnRouteId: "ROUTE_AGATTI_TO_LAGOON",
  travelDurationMs: 2600,
  aircraftType: "VA-72 Regional Turboprop",
};

export const FLIGHT_ROUTES: Record<string, FlightRoute> = {
  ROUTE_AGATTI_TO_LAGOON: OUTBOUND_ROUTE,
  ROUTE_LAGOON_TO_AGATTI: RETURN_ROUTE,
};

export const DEFAULT_OUTBOUND_ROUTE: FlightRoute = OUTBOUND_ROUTE;
export const DEFAULT_RETURN_ROUTE: FlightRoute = RETURN_ROUTE;
