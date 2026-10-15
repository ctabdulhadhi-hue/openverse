/**
 * Discovery System Types for OPENVERSE Open-World Exploration.
 */

export interface DiscoveredLocationRecord {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  discoveredAt: number;
  position: [number, number, number];
  icon: string;
  isViewpoint: boolean;
}

export interface DiscoveryTelemetry {
  totalDiscovered: number;
  totalLocations: number;
  recentDiscovery: DiscoveredLocationRecord | null;
  discoveredIds: Set<string>;
}
