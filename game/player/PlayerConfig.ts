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
  invertX: boolean; // horizontal mouse inversion (default false)
  invertY: boolean; // vertical mouse inversion (default false)
  collisionEnabled: boolean; // whether camera collision is enabled (default true)
  minDistance: number; // minimum distance during collision pullback (meters)
  maxDistance: number; // maximum distance camera can pull back (meters)
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
  distance: 5.0,
  height: 0.6,
  targetHeight: 1.4,
  sensitivity: 0.0022,
  minPitch: -0.35, // looking upward towards sky (-20 deg)
  maxPitch: 1.15, // looking down from above (+65 deg)
  positionSmoothing: 12.0,
  rotationSmoothing: 15.0,
  invertX: false,
  invertY: false,
  collisionEnabled: true,
  minDistance: 0.9,
  maxDistance: 5.5,
};

export const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  spawn: DEFAULT_PLAYER_SPAWN,
  movement: DEFAULT_PLAYER_MOVEMENT_CONFIG,
  camera: DEFAULT_PLAYER_CAMERA_CONFIG,
};
