import * as THREE from "three";

import { DEFAULT_PLAYER_CONFIG, type PlayerCameraConfig } from "./PlayerConfig";

export class PlayerCamera {
  public yaw = 0; // Horizontal rotation angle in radians
  public pitch = 0.15; // Vertical elevation angle in radians (slight downward pitch by default)

  private config: PlayerCameraConfig;
  private currentCameraPos = new THREE.Vector3();
  private targetFocus = new THREE.Vector3();
  private desiredCameraPos = new THREE.Vector3();

  constructor(config: PlayerCameraConfig = DEFAULT_PLAYER_CONFIG.camera) {
    this.config = config;
  }

  public updateMouseLook(deltaX: number, deltaY: number, invertY = false): void {
    const yFactor = invertY ? -1 : 1;

    this.yaw -= deltaX * this.config.sensitivity;
    this.pitch -= deltaY * this.config.sensitivity * yFactor;

    // Clamp vertical look angle to prevent camera flipping upside down
    this.pitch = Math.max(this.config.minPitch, Math.min(this.config.maxPitch, this.pitch));
  }

  public update(camera: THREE.Camera, playerPos: THREE.Vector3, delta: number): void {
    // 1. Compute target focus point (e.g. upper torso / head of character)
    this.targetFocus.set(playerPos.x, playerPos.y + this.config.targetHeight, playerPos.z);

    // 2. Compute camera spherical offset behind character
    const horizontalDistance = this.config.distance * Math.cos(this.pitch);
    const offsetY = this.config.height + this.config.distance * Math.sin(this.pitch);
    const offsetX = horizontalDistance * Math.sin(this.yaw);
    const offsetZ = horizontalDistance * Math.cos(this.yaw);

    this.desiredCameraPos.set(
      this.targetFocus.x + offsetX,
      this.targetFocus.y + offsetY,
      this.targetFocus.z + offsetZ,
    );

    // 3. Smoothly interpolate camera position
    const lerpFactor = Math.min(1, this.config.positionSmoothing * delta);
    camera.position.lerp(this.desiredCameraPos, lerpFactor);

    // 4. Orient camera towards focus point
    camera.lookAt(this.targetFocus);
  }

  public setYaw(yaw: number): void {
    this.yaw = yaw;
  }

  public setPitch(pitch: number): void {
    this.pitch = Math.max(this.config.minPitch, Math.min(this.config.maxPitch, pitch));
  }
}
