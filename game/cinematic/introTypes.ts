/**
 * Type definitions for the OPENVERSE Cinematic Startup Intro & Drone Flyover.
 */

export type IntroPhase =
  | "UNINITIALIZED" // Checking initial load
  | "LOADING" // Full-screen pure black (#000000) loading screen with animated indicator
  | "WAITING_FOR_INTERACTION" // Audio interaction fallback if needed
  | "TITLE" // Backwards-compatibility alias
  | "FLYOVER" // Drone camera flying through the 3D world (begins with 1.5-2s fade out of loading screen)
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
  loadingProgress: number; // 0 to 100
  loadingStatus: string;
  loadingError: string | null;
  isWorldReady: boolean;
  flyoverProgress: number;
  activeLocationTitle: string;
  activeSubtitle: string;
  isMuted: boolean;
  audioAllowed: boolean;
  isAudioPlaying: boolean;
  cloudRevealed: boolean;
  titleElapsedTime?: number;
  videoDuration?: number;
}
