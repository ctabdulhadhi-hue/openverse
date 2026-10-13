"use client";

import { missionStore } from "@/game/missions/MissionStore";

import { distanceInWorldMeters } from "./MapCoordinates";
import { playerPositionTracker } from "./PlayerPositionTracker";

export interface TrackedDestination {
  id: string;
  name: string;
  position: [number, number, number];
  icon?: string;
  type: "LOCATION" | "MISSION" | "CUSTOM";
  regionName?: string;
  missionId?: string;
}

export type NavigationListener = (destination: TrackedDestination | null) => void;

/**
 * Unified Navigation & Waypoint Tracking Store for OPENVERSE.
 *
 * Single source of truth for:
 * 1. Custom map landmark tracking (Track Location).
 * 2. Active mission objective navigation.
 * 3. Dynamic distance & bearing calculations for Compass, Minimap, and HUD.
 */
export class NavigationStore {
  private static instance: NavigationStore;
  private customDestination: TrackedDestination | null = null;
  private listeners: Set<NavigationListener> = new Set();
  private missionSubUnsubscribe: (() => void) | null = null;

  public static getInstance(): NavigationStore {
    if (!NavigationStore.instance) {
      NavigationStore.instance = new NavigationStore();
    }
    return NavigationStore.instance;
  }

  constructor() {
    // Reactively listen to mission tracking changes
    if (typeof window !== "undefined" || process.env.NODE_ENV === "test") {
      this.missionSubUnsubscribe = missionStore.subscribe(() => {
        // If no custom location is actively overriding, notify navigation listeners
        if (!this.customDestination) {
          this.notify();
        }
      });
    }
  }

  public setTrackedDestination(dest: TrackedDestination | null): void {
    this.customDestination = dest;
    this.notify();
  }

  public setTrackedLocation(loc: {
    id: string;
    name: string;
    position: [number, number, number];
    icon?: string;
    regionName?: string;
  }): void {
    this.setTrackedDestination({
      id: loc.id,
      name: loc.name,
      position: [...loc.position],
      icon: loc.icon ?? "📍",
      type: "LOCATION",
      regionName: loc.regionName,
    });
  }

  public setTrackedMission(mission: {
    missionId: string;
    title: string;
    position: [number, number, number];
    icon?: string;
  }): void {
    this.setTrackedDestination({
      id: `mission-${mission.missionId}`,
      name: mission.title,
      position: [...mission.position],
      icon: mission.icon ?? "⭐",
      type: "MISSION",
      missionId: mission.missionId,
    });
  }

  public clearTrackedDestination(): void {
    if (this.customDestination !== null) {
      this.customDestination = null;
      this.notify();
    }
  }

  /**
   * Returns active destination: custom location waypoint if set, or active mission objective.
   */
  public getTrackedDestination(): TrackedDestination | null {
    if (this.customDestination) {
      return this.customDestination;
    }

    const trackedMission = missionStore.getTrackedMission();
    if (trackedMission && trackedMission.state === "ACTIVE") {
      const obj = trackedMission.definition.objectives[trackedMission.currentObjectiveIndex];
      if (obj?.target?.position) {
        return {
          id: `mission-${trackedMission.id}`,
          name: `${trackedMission.definition.title}: ${obj.title}`,
          position: obj.target.position,
          icon: "⭐",
          type: "MISSION",
          missionId: trackedMission.id,
        };
      }
    }

    return null;
  }

  public isCustomLocationTracked(locationId: string): boolean {
    return this.customDestination?.id === locationId;
  }

  public isTracked(id: string): boolean {
    const active = this.getTrackedDestination();
    if (!active) return false;
    return active.id === id || active.missionId === id || active.id === `mission-${id}`;
  }

  /**
   * Calculates live distance in meters and cardinal bearing from a player position to the tracked destination.
   */
  public getTelemetry(playerPos?: [number, number, number], playerYaw?: number): {
    destination: TrackedDestination;
    distanceMeters: number;
    bearingDegrees: number;
    relativeAngleDegrees: number;
    cardinal: string;
  } | null {
    const dest = this.getTrackedDestination();
    if (!dest) return null;

    const pPos = playerPos ?? playerPositionTracker.getPosition();
    const yaw = playerYaw ?? playerPositionTracker.getYaw();

    const dx = dest.position[0] - pPos[0];
    const dz = dest.position[2] - pPos[2];
    const distanceMeters = Math.round(distanceInWorldMeters(pPos, dest.position));

    // World bearing (0 deg = North/-Z, 90 deg = East/+X, 180 deg = South/+Z, 270 deg = West/-X)
    let bearingRad = Math.atan2(dx, -dz);
    if (bearingRad < 0) bearingRad += Math.PI * 2;
    const bearingDegrees = Math.round((bearingRad * 180) / Math.PI);

    // Relative angle against player facing heading
    let relativeRad = bearingRad - yaw;
    // Normalize to [-PI, PI]
    while (relativeRad > Math.PI) relativeRad -= Math.PI * 2;
    while (relativeRad < -Math.PI) relativeRad += Math.PI * 2;
    const relativeAngleDegrees = Math.round((relativeRad * 180) / Math.PI);

    // Cardinal string
    const cardinals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const cardIdx = Math.round(bearingDegrees / 45) % 8;
    const cardinal = cardinals[cardIdx] ?? "N";

    return {
      destination: dest,
      distanceMeters,
      bearingDegrees,
      relativeAngleDegrees,
      cardinal,
    };
  }

  public subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    listener(this.getTrackedDestination());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public reset(): void {
    this.customDestination = null;
    this.notify();
  }

  private notify(): void {
    const current = this.getTrackedDestination();
    for (const listener of this.listeners) {
      listener(current);
    }
  }
}

export const navigationStore = NavigationStore.getInstance();
