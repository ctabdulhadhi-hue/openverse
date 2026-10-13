/**
 * Canonical 3D Waypoints for the OPENVERSE Drone Flyover.
 *
 * Mapped to actual Varanaya world geometry and Chunk (0, 0) landmarks.
 * Heights and clearance ensure no clipping through buildings or passing underground.
 */

import type { CinematicWaypoint } from "./introTypes";

export const CINEMATIC_WAYPOINTS: CinematicWaypoint[] = [
  {
    position: [-35, 48, 65],
    lookAt: [0, 8, -15],
    locationTitle: "KINGDOM OF VARANAYA",
    subtitle: "Ancient Sandstone Kingdom on the Azure Coast",
    t: 0.0,
  },
  {
    position: [-26, 26, 25],
    lookAt: [-14, 4, -15],
    locationTitle: "PALATIAL HAVELI DISTRICT",
    subtitle: "Carved Jharokha Balconies & Sandstone Mansions",
    t: 0.22,
  },
  {
    position: [36, 14, 28],
    lookAt: [24, 2, -6],
    locationTitle: "ROYAL WATERFRONT & GHAT STEPS",
    subtitle: "Continuous Stone Quay & Moored Lateen Dhows",
    t: 0.45,
  },
  {
    position: [14, 28, -32],
    lookAt: [0, 22, -68],
    locationTitle: "THE GRAND SANCTUARY",
    subtitle: "Colossal 62m Shikhara Spire & Sacred Mandapa Plinth",
    t: 0.7,
  },
  {
    position: [0, 10, -18],
    lookAt: [0, 1.5, 8],
    locationTitle: "ROYAL PROMENADE PLAZA",
    subtitle: "Ceremonial Heart of Varanaya",
    t: 0.88,
  },
  {
    position: [0, 3.2, 14.5],
    lookAt: [0, 2.0, 8],
    locationTitle: "YOUR JOURNEY BEGINS",
    subtitle: "Step forth into the living world",
    t: 1.0,
  },
];

export const FLYOVER_DURATION_SECONDS = 18.0;
export const VIDEO_INTRO_DURATION_SECONDS = 10.0;
export const TITLE_DURATION_SECONDS = 10.0;
export const HANDOFF_DURATION_SECONDS = 1.0;
