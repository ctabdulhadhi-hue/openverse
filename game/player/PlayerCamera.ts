import * as THREE from "three";

import { DEFAULT_PLAYER_CONFIG, type PlayerCameraConfig } from "./PlayerConfig";

export class PlayerCamera {
  public yaw = 0; // Horizontal view orientation in radians
  public pitch = 0.15; // Vertical elevation angle in radians (moderate downward tilt by default)
  public currentDistance: number;
  public collisionHit = false;

  private config: PlayerCameraConfig;
  private currentCameraPos = new THREE.Vector3();
  private targetFocus = new THREE.Vector3();
  private desiredCameraPos = new THREE.Vector3();
  private isInitialized = false;

  constructor(config: PlayerCameraConfig = DEFAULT_PLAYER_CONFIG.camera) {
    this.config = config;
    this.currentDistance = config.distance;
  }

  /**
   * Updates camera yaw and pitch from mouse movement deltas.
   * Standard third-person game controls:
   * - Move mouse RIGHT (deltaX > 0) -> view pans RIGHT
   * - Move mouse LEFT (deltaX < 0) -> view pans LEFT
   * - Move mouse UP (deltaY < 0) -> view looks UP
   * - Move mouse DOWN (deltaY > 0) -> view looks DOWN
   */
  public updateMouseLook(deltaX: number, deltaY: number, invertY = false, invertX = false): void {
    const xFactor = this.config.invertX || invertX ? -1 : 1;
    const yFactor = this.config.invertY || invertY ? -1 : 1;

    // Horizontal mouse delta directly increments yaw
    this.yaw += deltaX * this.config.sensitivity * xFactor;

    // Vertical mouse delta: in DOM, upward mouse has negative deltaY.
    // Adding negative deltaY decreases pitch, which lowers camera angle and tilts view upward.
    this.pitch += deltaY * this.config.sensitivity * yFactor;

    // Clamp pitch to prevent flipping or clipping through ground
    this.pitch = Math.max(this.config.minPitch, Math.min(this.config.maxPitch, this.pitch));
  }

  /**
   * Smoothly updates camera position and orientation relative to player target.
   * Optionally accepts obstacleDistance (from physics raycast) to prevent clipping through solid geometry.
   */
  public update(
    camera: THREE.Camera,
    playerPos: THREE.Vector3,
    delta: number,
    obstacleDistance?: number | null,
  ): void {
    // 1. Target focus point (e.g. character chest / upper torso)
    this.targetFocus.set(playerPos.x, playerPos.y + this.config.targetHeight, playerPos.z);

    // 2. Compute desired distance considering obstacle collision
    let targetDistance = this.config.distance;
    this.collisionHit = false;

    if (
      this.config.collisionEnabled &&
      obstacleDistance !== undefined &&
      obstacleDistance !== null &&
      obstacleDistance < this.config.distance
    ) {
      this.collisionHit = true;
      // Pull camera closer with a safety margin (0.25m before obstacle)
      targetDistance = Math.max(this.config.minDistance, obstacleDistance - 0.25);
    }

    // 3. Smoothly adjust current camera distance with framerate-independent damping
    // Snap in quickly to prevent wall clipping (speed ~20), recover smoothly when obstacle clears (speed ~6)
    const zoomDamp = targetDistance < this.currentDistance ? 20.0 : 6.0;
    this.currentDistance = THREE.MathUtils.damp(
      this.currentDistance,
      targetDistance,
      zoomDamp,
      delta,
    );

    // 4. Compute camera position in spherical coordinates behind character
    // Adapt height proportionally when pulled in close to maintain clean shoulder/torso framing
    const distRatio = Math.min(1, Math.max(0.2, this.currentDistance / this.config.distance));
    const effectiveHeight = this.config.height * distRatio;

    const horizontalDistance = this.currentDistance * Math.cos(this.pitch);
    const offsetX = -horizontalDistance * Math.sin(this.yaw);
    const offsetZ = horizontalDistance * Math.cos(this.yaw);
    const offsetY = effectiveHeight + this.currentDistance * Math.sin(this.pitch);

    this.desiredCameraPos.set(
      this.targetFocus.x + offsetX,
      this.targetFocus.y + offsetY,
      this.targetFocus.z + offsetZ,
    );

    // 5. Apply camera position with framerate-independent position damping
    if (!this.isInitialized) {
      // First frame: snap directly to prevent flying in from origin
      camera.position.copy(this.desiredCameraPos);
      this.currentCameraPos.copy(this.desiredCameraPos);
      this.isInitialized = true;
    } else {
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        this.desiredCameraPos.x,
        this.config.positionSmoothing,
        delta,
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        this.desiredCameraPos.y,
        this.config.positionSmoothing,
        delta,
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        this.desiredCameraPos.z,
        this.config.positionSmoothing,
        delta,
      );
      this.currentCameraPos.copy(camera.position);
    }

    // 6. Look at focus point
    camera.lookAt(this.targetFocus);
  }

  public setYaw(yaw: number): void {
    this.yaw = yaw;
  }

  public setPitch(pitch: number): void {
    this.pitch = Math.max(this.config.minPitch, Math.min(this.config.maxPitch, pitch));
  }

  public resetInitialization(): void {
    this.isInitialized = false;
  }

  public getConfig(): PlayerCameraConfig {
    return this.config;
  }
}
