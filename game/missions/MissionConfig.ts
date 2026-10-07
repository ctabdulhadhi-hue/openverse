/**
 * Mission System Configuration & Constants for OPENVERSE.
 */
export const MISSION_CONFIG = {
  /** Distance threshold (in meters) for reaching a world marker objective */
  DEFAULT_REACH_RADIUS: 6.0,
  /** Distance threshold (in meters) for NPC talk objective proximity */
  DEFAULT_TALK_RADIUS: 5.0,
  /** Max active missions that can be tracked simultaneously on the HUD */
  MAX_TRACKED_MISSIONS: 1,
  /** Throttle interval (in milliseconds) for distance calculation updates on the HUD */
  DISTANCE_UPDATE_INTERVAL_MS: 200,
  /** Visual styles for 3D world objective markers */
  MARKER: {
    FLOAT_HEIGHT: 2.2,
    BOB_SPEED: 2.5,
    BOB_AMPLITUDE: 0.15,
    ROTATION_SPEED: 1.2,
    COLOR: "#38bdf8",
    PULSE_COLOR: "#67e8f9",
  },
  /** Colors for overhead markers and HUD */
  COLORS: {
    AVAILABLE_INDICATOR: "#38bdf8", // Sky / cyan
    ACTIVE_TARGET_INDICATOR: "#fbbf24", // Amber / gold
    OBJECTIVE_COMPLETE: "#4ade80", // Green
    HUD_ACCENT: "#38bdf8",
  },
} as const;
