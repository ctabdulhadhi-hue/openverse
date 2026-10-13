/**
 * Canonical 3D Waypoints for the OPENVERSE Drone Flyover.
 *
 * Starts high above a realistic procedural cloud layer at altitude y = 215m,
 * glides forward and descends through the clouds with immersive mist,
 * emerges beneath the cloud deck to reveal the Kingdom of Varanaya,
 * swoops across established landmarks (Palatial Haveli, Waterfront, Grand Sanctuary),
 * and smoothly hands off to the player camera at spawn [0, 1.2, 8].
 */

import type { CinematicWaypoint } from "./introTypes";

export const CINEMATIC_WAYPOINTS: CinematicWaypoint[] = [
  {
    position: [-92, 215, 210],
    lookAt: [15, 140, -30],
    locationTitle: "HIGH ABOVE THE CLOUDS",
    subtitle: "Cruising the Azure Cloud Sea Above Varanaya",
    t: 0.0,
  },
  {
    position: [-68, 172, 145],
    lookAt: [10, 115, -25],
    locationTitle: "DESCENDING THE CLOUD DECK",
    subtitle: "Approaching the Coastal Cloud Canopy",
    t: 0.16,
  },
  {
    position: [-46, 122, 90],
    lookAt: [5, 65, -20],
    locationTitle: "PASSING THROUGH THE CLOUDS",
    subtitle: "Enveloped in Soft Atmospheric Mist",
    t: 0.3,
  },
  {
    position: [-35, 52, 58],
    lookAt: [0, 10, -15],
    locationTitle: "KINGDOM OF VARANAYA",
    subtitle: "Ancient Sandstone Kingdom on the Azure Coast",
    t: 0.44,
  },
  {
    position: [-26, 26, 25],
    lookAt: [-14, 4, -15],
    locationTitle: "PALATIAL HAVELI DISTRICT",
    subtitle: "Carved Jharokha Balconies & Sandstone Mansions",
    t: 0.6,
  },
  {
    position: [36, 14, 28],
    lookAt: [24, 2, -6],
    locationTitle: "ROYAL WATERFRONT & GHAT STEPS",
    subtitle: "Continuous Stone Quay & Moored Lateen Dhows",
    t: 0.74,
  },
  {
    position: [14, 28, -32],
    lookAt: [0, 22, -68],
    locationTitle: "THE GRAND SANCTUARY",
    subtitle: "Colossal 62m Shikhara Spire & Sacred Mandapa Plinth",
    t: 0.86,
  },
  {
    position: [0, 9.5, -16],
    lookAt: [0, 1.5, 8],
    locationTitle: "ROYAL PROMENADE PLAZA",
    subtitle: "Ceremonial Heart of Varanaya",
    t: 0.94,
  },
  {
    position: [0, 3.2, 14.5],
    lookAt: [0, 2.0, 8],
    locationTitle: "YOUR JOURNEY BEGINS",
    subtitle: "Step forth into the living world",
    t: 1.0,
  },
];

export const FLYOVER_DURATION_SECONDS = 22.0;
export const VIDEO_INTRO_DURATION_SECONDS = 10.0;
export const TITLE_DURATION_SECONDS = 10.0;
export const HANDOFF_DURATION_SECONDS = 1.0;
