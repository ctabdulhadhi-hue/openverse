export interface PlayerSpawnConfig {
  position: [number, number, number];
  rotation: number; // yaw in radians
}

export interface PlayerMovementConfig {
  walkSpeed: number; // meters per second
  sprintSpeed: number; // meters per second
  acceleration: number; // rate of velocity increase (m/s^2 or interpolation factor)
  deceleration: number; // rate of velocity decay to idle
  rotationSpeed: number; // turn rate in radians per second
}

export interface PlayerCameraConfig {
  distance: number; // distance behind character pivot (meters)
  height: number; // vertical camera offset (meters)
  targetHeight: number; // character focus pivot height above ground (meters)
  sensitivity: number; // mouse sensitivity (rad per mouse pixel delta)
  minPitch: number; // minimum downward look angle (radians)
  maxPitch: number; // maximum upward look angle (radians)
  positionSmoothing: number; // camera translation interpolation speed
  rotationSmoothing: number; // camera look rotation interpolation speed
}

export interface PlayerConfig {
  spawn: PlayerSpawnConfig;
  movement: PlayerMovementConfig;
  camera: PlayerCameraConfig;
}

export const DEFAULT_PLAYER_SPAWN: PlayerSpawnConfig = {
  position: [0, 0, 8],
  rotation: 0,
};

export const DEFAULT_PLAYER_MOVEMENT_CONFIG: PlayerMovementConfig = {
  walkSpeed: 3.5,
  sprintSpeed: 6.5,
  acceleration: 12.0,
  deceleration: 15.0,
  rotationSpeed: 10.0,
};

export const DEFAULT_PLAYER_CAMERA_CONFIG: PlayerCameraConfig = {
  distance: 5.5,
  height: 2.2,
  targetHeight: 1.35,
  sensitivity: 0.0022,
  minPitch: -Math.PI / 4.5, // -40 degrees (looking down from above)
  maxPitch: Math.PI / 3, // +60 degrees (looking up from below)
  positionSmoothing: 10.0,
  rotationSmoothing: 15.0,
};

export const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  spawn: DEFAULT_PLAYER_SPAWN,
  movement: DEFAULT_PLAYER_MOVEMENT_CONFIG,
  camera: DEFAULT_PLAYER_CAMERA_CONFIG,
};
