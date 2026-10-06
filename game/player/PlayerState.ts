import * as THREE from "three";

import { DEFAULT_PLAYER_SPAWN, type PlayerSpawnConfig } from "./PlayerConfig";

export type PlayerMovementState =
  | "IDLE"
  | "WALKING"
  | "SPRINTING"
  | "JUMP_REQUESTED"
  | "JUMPING"
  | "AIRBORNE"
  | "FALLING"
  | "LANDING";

export interface PlayerRuntimeState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number; // Yaw angle in radians around Y axis
  movementState: PlayerMovementState;
  speed: number; // Current scalar ground speed (m/s)
  isGrounded: boolean;
  jumpRequested: boolean;
  fallDistance: number; // Drop distance accumulator (m)
}

export function createPlayerRuntimeState(
  spawnConfig: PlayerSpawnConfig = DEFAULT_PLAYER_SPAWN,
): PlayerRuntimeState {
  return {
    position: new THREE.Vector3(
      spawnConfig.position[0],
      spawnConfig.position[1],
      spawnConfig.position[2],
    ),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: spawnConfig.rotation,
    movementState: "IDLE",
    speed: 0,
    isGrounded: true,
    jumpRequested: false,
    fallDistance: 0,
  };
}
