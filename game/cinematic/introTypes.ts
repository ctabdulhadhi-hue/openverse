/**
 * Type definitions for the OPENVERSE Cinematic Startup Intro & Drone Flyover.
 */

export type IntroPhase =
  | "UNINITIALIZED" // Checking autoplay / initial load
  | "WAITING_FOR_INTERACTION" // Audio autoplay blocked; waiting for user click
  | "TITLE" // 5.0 seconds of title image display
  | "FLYOVER" // Drone camera flying through the 3D world
  | "HANDOFF" // Blending camera smoothly into player camera
  | "COMPLETED"; // Normal gameplay active

export interface CinematicWaypoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  locationTitle: string;
  subtitle: string;
  t: number; // Normalized time [0, 1] along curve
}

export interface IntroTelemetry {
  phase: IntroPhase;
  hasStarted: boolean;
  titleElapsedTime: number;
  flyoverProgress: number;
  activeLocationTitle: string;
  activeSubtitle: string;
  isMuted: boolean;
  audioAllowed: boolean;
  isAudioPlaying: boolean;
  videoDuration?: number;
}
