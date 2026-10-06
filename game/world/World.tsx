"use client";

import { CityRegion } from "./city/CityRegion";
import { CoastRegion } from "./coast/CoastRegion";
import { ForestRegion } from "./forest/ForestRegion";
import { MountainRegion } from "./mountain/MountainRegion";
import { RoadNetwork } from "./roads/RoadNetwork";
import { ContinuousTerrain } from "./terrain/ContinuousTerrain";
import { WaterPlane } from "./terrain/WaterPlane";
import { TownRegion } from "./town/TownRegion";

/**
 * OPENVERSE World Master Orchestrator (Phase 4).
 *
 * Implements the first continuous, explorable open world:
 * TOWN → ROAD → FOREST → MOUNTAIN → CITY → COAST
 *
 * The player can physically walk, sprint, and jump across all five regions
 * without loading screens, page transitions, or artificial boundaries.
 */
export function World() {
  return (
    <group name="openverse-world">
      {/* 1. Seamless Continuous Terrain Base */}
      <ContinuousTerrain />

      {/* 2. Coastal Ocean Water */}
      <WaterPlane />

      {/* 3. Physically Connected Road Network */}
      <RoadNetwork />

      {/* 4. Region: Westport Town (Spawn District & Settlement) */}
      <TownRegion />

      {/* 5. Region: Pine Crest Forest (Woodland, Trails & Ancient Tree) */}
      <ForestRegion />

      {/* 6. Region: Mount Aethel (Alpine Cliffs, Switchbacks & Overlook) */}
      <MountainRegion />

      {/* 7. Region: Central City (Skyline, Paved Streets & Civic Spire) */}
      <CityRegion />

      {/* 8. Region: Sunken Coast (Beach, Lighthouse & Maritime Pier) */}
      <CoastRegion />
    </group>
  );
}
