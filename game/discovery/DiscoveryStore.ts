import { VARANAYA_LOCATIONS, type LocationDefinition } from "@/data/locations/locationsData";

import type { DiscoveredLocationRecord, DiscoveryTelemetry } from "./discoveryTypes";

type DiscoveryObserver = (telemetry: DiscoveryTelemetry) => void;

class DiscoveryStore {
  private discoveredMap = new Map<string, DiscoveredLocationRecord>();
  private observers = new Set<DiscoveryObserver>();
  private recentDiscovery: DiscoveredLocationRecord | null = null;
  private initialDiscoveredIds = new Set<string>();

  constructor() {
    for (const loc of VARANAYA_LOCATIONS) {
      if (loc.discovered) {
        this.initialDiscoveredIds.add(loc.id);
      }
    }
    this.initDefaultDiscoveries();
  }

  private initDefaultDiscoveries(): void {
    const now = Date.now();
    for (const loc of VARANAYA_LOCATIONS) {
      if (loc.discovered) {
        this.discoveredMap.set(loc.id, {
          id: loc.id,
          name: loc.name,
          regionId: loc.regionId,
          regionName: loc.regionName,
          discoveredAt: now,
          position: loc.position,
          icon: loc.icon,
          isViewpoint: loc.type === "VIEWPOINT",
        });
      }
    }
  }

  public isDiscovered(locationId: string): boolean {
    return this.discoveredMap.has(locationId);
  }

  public discoverLocation(loc: LocationDefinition): boolean {
    if (this.discoveredMap.has(loc.id)) {
      return false; // Already discovered
    }

    const record: DiscoveredLocationRecord = {
      id: loc.id,
      name: loc.name,
      regionId: loc.regionId,
      regionName: loc.regionName,
      discoveredAt: Date.now(),
      position: loc.position,
      icon: loc.icon,
      isViewpoint: loc.type === "VIEWPOINT",
    };

    this.discoveredMap.set(loc.id, record);
    this.recentDiscovery = record;

    // Mutate the live data object in VARANAYA_LOCATIONS as well
    loc.discovered = true;

    this.notify();
    return true;
  }

  public discoverById(locationId: string): boolean {
    if (this.discoveredMap.has(locationId)) {
      return false;
    }
    const loc = VARANAYA_LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return false;
    return this.discoverLocation(loc);
  }

  public getTelemetry(): DiscoveryTelemetry {
    return {
      totalDiscovered: this.discoveredMap.size,
      totalLocations: VARANAYA_LOCATIONS.length,
      recentDiscovery: this.recentDiscovery,
      discoveredIds: new Set(this.discoveredMap.keys()),
    };
  }

  public subscribe(observer: DiscoveryObserver): () => void {
    this.observers.add(observer);
    observer(this.getTelemetry());
    return () => {
      this.observers.delete(observer);
    };
  }

  private notify(): void {
    const telemetry = this.getTelemetry();
    for (const observer of this.observers) {
      observer(telemetry);
    }
  }

  public reset(): void {
    this.discoveredMap.clear();
    this.recentDiscovery = null;
    for (const loc of VARANAYA_LOCATIONS) {
      loc.discovered = this.initialDiscoveredIds.has(loc.id);
    }
    this.initDefaultDiscoveries();
    this.notify();
  }
}

export const discoveryStore = new DiscoveryStore();
