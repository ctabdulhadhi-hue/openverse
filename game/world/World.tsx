"use client";

import { CityRegion } from "./city/CityRegion";
import { CoastRegion } from "./coast/CoastRegion";
import { DistantScenery } from "./distant/DistantScenery";
import { ForestRegion } from "./forest/ForestRegion";
import { MountainRegion } from "./mountain/MountainRegion";
import { RoadNetwork } from "./roads/RoadNetwork";
import { ContinuousTerrain } from "./terrain/ContinuousTerrain";
import { WaterPlane } from "./terrain/WaterPlane";
import { TownRegion } from "./town/TownRegion";

/**
 * OPENVERSE World Master Orchestrator (Phase 4).
 *
 * Implements the expandable, continuous open world:
 * TOWN → ROAD → FOREST → MOUNTAIN → CITY → COAST
 *
 * Features:
 * - Expandable multi-region coordinate architecture
 * - Horizontal TerrainChunks with solid Rapier colliders
 * - Horizon distant scenery (mountains, skyline silhouettes)
 * - Seamless physical traversal without page loads or teleportation
 */
export function World() {
  return (
    <group name="openverse-world">
      {/* 1. Modular Horizontal Terrain Foundation */}
      <ContinuousTerrain />

      {/* 2. Coastal Ocean Water Plane */}
      <WaterPlane />

      {/* 3. Distant Horizon Mountain & Skyline Scenery */}
      <DistantScenery />

      {/* 4. Connected Paved Road Network */}
      <RoadNetwork />

      {/* 5. Region: Westport Town (Spawn District & Historic Plaza) */}
      <TownRegion />

      {/* 6. Region: Pine Crest Forest (Woodland, Trails & Ancient Tree) */}
      <ForestRegion />

      {/* 7. Region: Mount Aethel (Alpine Massif, Switchbacks & Summit Overlook) */}
      <MountainRegion />

      {/* 8. Region: Central City (Skyline, Paved Avenues & Civic Spire) */}
      <CityRegion />

      {/* 9. Region: Sunken Coast (Beach, Bluffs, Maritime Pier & Lighthouse) */}
      <CoastRegion />
    </group>
  );
}
