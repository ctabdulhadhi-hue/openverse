import { VARANAYA_LOCATIONS, type LocationDefinition } from "@/data/locations/locationsData";

import { discoveryStore } from "./DiscoveryStore";
import type { DiscoveredLocationRecord } from "./discoveryTypes";

export type DiscoveryCallback = (record: DiscoveredLocationRecord, loc: LocationDefinition) => void;

export class DiscoveryManager {
  private callbacks = new Set<DiscoveryCallback>();
  private defaultRadius = 35.0; // 35 meters discovery radius

  public onDiscovery(cb: DiscoveryCallback): () => void {
    this.callbacks.add(cb);
    return () => {
      this.callbacks.delete(cb);
    };
  }

  /**
   * Throttled check called during frame update with player coordinates.
   */
  public checkProximity(playerPos: [number, number, number]): DiscoveredLocationRecord[] {
    const newlyDiscovered: DiscoveredLocationRecord[] = [];

    for (const loc of VARANAYA_LOCATIONS) {
      if (discoveryStore.isDiscovered(loc.id)) {
        continue;
      }

      const dx = playerPos[0] - loc.position[0];
      const dz = playerPos[2] - loc.position[2];
      const dist = Math.hypot(dx, dz);

      const radius = loc.type === "SANCTUARY" || loc.type === "DISTRICT" ? 48.0 : this.defaultRadius;

      if (dist <= radius) {
        const wasAdded = discoveryStore.discoverLocation(loc);
        if (wasAdded) {
          const telemetry = discoveryStore.getTelemetry();
          if (telemetry.recentDiscovery) {
            newlyDiscovered.push(telemetry.recentDiscovery);
            for (const cb of this.callbacks) {
              cb(telemetry.recentDiscovery, loc);
            }
          }
        }
      }
    }

    return newlyDiscovered;
  }
}

export const discoveryManager = new DiscoveryManager();
