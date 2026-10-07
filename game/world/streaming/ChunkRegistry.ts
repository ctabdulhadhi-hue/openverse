import { WORLD_LANDMARKS } from "../WorldData";
import { getRegionAt } from "../WorldRegions";
import { hashCoords, seededRandom } from "../WorldUtils";
import { chunkToWorldCenter, getChunkKey } from "./ChunkCoordinates";
import { DEFAULT_STREAMING_CONFIG } from "./StreamingConfig";

export interface RoadSegmentSpec {
  position: [number, number, number];
  length: number;
  width: number;
  rotation?: [number, number, number];
  hasCurbs?: boolean;
}

export interface TreeSpec {
  position: [number, number, number];
  scale: number;
}

export interface BoulderSpec {
  position: [number, number, number];
  scale: number;
}

export interface ChunkBlueprint {
  chunkX: number;
  chunkZ: number;
  key: string;
  worldCenterX: number;
  worldCenterZ: number;
  size: number;
  regionId: string;
  regionName: string;
  biome: "TOWN" | "FOREST" | "MOUNTAIN" | "CITY" | "COAST" | "ROAD" | "WILDERNESS";
  terrain: {
    elevation: number;
    thickness: number;
    materialKey:
      | "meadowGrass"
      | "forestGrass"
      | "cliffStone"
      | "mountainPeak"
      | "curbConcrete"
      | "beachSand"
      | "warmSandstone";
  };
  hasPlaza?: boolean;
  landmarkId?: string;
  roadSegments: RoadSegmentSpec[];
  trees: TreeSpec[];
  boulders: BoulderSpec[];
}

/**
 * Deterministically generates the content blueprint for any chunk in the world.
 * Built on the Phase 4 geographical layout and extensible to any coordinate.
 */
export function getChunkBlueprint(
  chunkX: number,
  chunkZ: number,
  chunkSize = DEFAULT_STREAMING_CONFIG.chunkSize,
  worldSeed = DEFAULT_STREAMING_CONFIG.worldSeed,
): ChunkBlueprint {
  const [worldCenterX, , worldCenterZ] = chunkToWorldCenter(chunkX, chunkZ, chunkSize);
  const key = getChunkKey(chunkX, chunkZ);
  const region = getRegionAt(worldCenterX, worldCenterZ);

  // Initialize deterministic PRNG for this specific chunk
  const chunkSeed = hashCoords(worldSeed, chunkX, chunkZ);
  const rng = seededRandom(chunkSeed);

  // Default blueprint structure
  const blueprint: ChunkBlueprint = {
    chunkX,
    chunkZ,
    key,
    worldCenterX,
    worldCenterZ,
    size: chunkSize,
    regionId: region.id,
    regionName: region.name,
    biome: region.category === "SUBURB" ? "TOWN" : region.category,
    terrain: {
      elevation: 0,
      thickness: 2.0,
      materialKey: "meadowGrass",
    },
    roadSegments: [],
    trees: [],
    boulders: [],
  };

  // Check if any landmark is situated in this chunk
  const half = chunkSize / 2;
  const landmark = WORLD_LANDMARKS.find((lm) => {
    const lx = lm.position[0];
    const lz = lm.position[2];
    return (
      lx >= worldCenterX - half &&
      lx < worldCenterX + half &&
      lz >= worldCenterZ - half &&
      lz < worldCenterZ + half
    );
  });
  if (landmark) {
    blueprint.landmarkId = landmark.id;
  }

  // ========================================================
  // 1. WESTPORT TOWN CHUNKS
  // ========================================================
  if (chunkX === 0 && chunkZ === 0) {
    // Central Town Square Plaza, Grand Sanctuary, Palaces, and Waterfront
    blueprint.biome = "TOWN";
    blueprint.hasPlaza = true;
    blueprint.terrain = { elevation: 0.05, thickness: 2.0, materialKey: "warmSandstone" };
    return blueprint;
  }

  if (chunkX === 1 && chunkZ === 0) {
    // Varanaya Eastern Turquoise Bay & Grand Causeway approach
    blueprint.biome = "COAST";
    blueprint.terrain = { elevation: -0.4, thickness: 2.0, materialKey: "beachSand" };
    return blueprint;
  }

  if (chunkX === -1 && chunkZ === 0) {
    // Varanaya West Outer Promenade & Gate Approaches
    blueprint.biome = "TOWN";
    blueprint.terrain = { elevation: 0.05, thickness: 2.0, materialKey: "warmSandstone" };
    return blueprint;
  }

  // ========================================================
  // 2. VALLEY THOROUGHFARE & COUNTRYSIDE CHUNKS
  // ========================================================
  if (chunkX === 0 && chunkZ === -1) {
    // North Valley Road fork towards Forest, Mountain, and City
    blueprint.biome = "ROAD";
    blueprint.terrain = { elevation: 0.05, thickness: 2.0, materialKey: "meadowGrass" };
    blueprint.roadSegments.push({
      position: [0, 0.06, -180],
      length: 140,
      width: 8,
    });
    // West connector branch
    blueprint.roadSegments.push({
      position: [-60, 0.06, -200],
      length: 80,
      width: 7,
      rotation: [0, Math.PI / 4, 0],
    });
    // East connector branch
    blueprint.roadSegments.push({
      position: [60, 0.06, -200],
      length: 80,
      width: 8,
      rotation: [0, -Math.PI / 3, 0],
    });
    return blueprint;
  }

  if (chunkX === 0 && chunkZ === 1) {
    // South Countryside Road leading into peaceful rural hills
    blueprint.biome = "ROAD";
    blueprint.terrain = { elevation: 0.05, thickness: 2.0, materialKey: "meadowGrass" };
    blueprint.roadSegments.push({
      position: [0, 0.06, 180],
      length: 160,
      width: 8,
    });
    return blueprint;
  }

  // ========================================================
  // 3. PINE CREST FOREST CHUNKS
  // ========================================================
  if (chunkX === -1 && chunkZ === -1) {
    // Forest Entrance & Trails
    blueprint.biome = "FOREST";
    blueprint.terrain = { elevation: 2.5, thickness: 5.0, materialKey: "forestGrass" };
    blueprint.roadSegments.push({
      position: [-220, 2.55, -220],
      length: 120,
      width: 6,
      hasCurbs: false,
    });
    // 12 procedural pine trees along trail
    for (let i = 0; i < 12; i++) {
      blueprint.trees.push({
        position: [worldCenterX + (rng() - 0.5) * 160, 2.5, worldCenterZ + (rng() - 0.5) * 160],
        scale: 0.8 + rng() * 0.5,
      });
    }
    return blueprint;
  }

  if (chunkX === -1 && chunkZ === -2) {
    // Heart of Pine Crest Forest & Ancient Hollow Cedar Landmark
    blueprint.biome = "FOREST";
    blueprint.terrain = { elevation: 2.5, thickness: 5.0, materialKey: "forestGrass" };
    // Dense evergreen canopy
    for (let i = 0; i < 16; i++) {
      const tx = worldCenterX + (rng() - 0.5) * 160;
      const tz = worldCenterZ + (rng() - 0.5) * 160;
      // Keep clearing open around Ancient Tree [-280, -380]
      if (Math.hypot(tx - -280, tz - -380) > 35) {
        blueprint.trees.push({
          position: [tx, 2.5, tz],
          scale: 0.9 + rng() * 0.6,
        });
      }
    }
    // Mossy forest boulders
    blueprint.boulders.push({ position: [-260, 3.2, -370], scale: 1.5 });
    blueprint.boulders.push({ position: [-310, 3.4, -390], scale: 1.8 });
    return blueprint;
  }

  // ========================================================
  // 4. MOUNT AETHEL CHUNKS
  // ========================================================
  if (chunkX === 0 && chunkZ === -2) {
    // Mount Aethel Foothills & Ascent Highway
    blueprint.biome = "MOUNTAIN";
    blueprint.terrain = { elevation: 8.0, thickness: 16.0, materialKey: "cliffStone" };
    blueprint.roadSegments.push({
      position: [0, 5.0, -340],
      length: 140,
      width: 8,
      rotation: [0.06, 0, 0],
    });
    // Foothill boulders
    for (let i = 0; i < 5; i++) {
      blueprint.boulders.push({
        position: [worldCenterX + (rng() - 0.5) * 150, 9.0, worldCenterZ + (rng() - 0.5) * 150],
        scale: 1.6 + rng() * 0.8,
      });
    }
    return blueprint;
  }

  if (chunkX === 0 && (chunkZ === -3 || chunkZ === -4)) {
    // Mount Aethel Summit, Switchbacks & Summit Overlook Landmark
    blueprint.biome = "MOUNTAIN";
    blueprint.terrain = { elevation: 28.0, thickness: 56.0, materialKey: "mountainPeak" };
    return blueprint;
  }

  // ========================================================
  // 5. CENTRAL CITY CHUNKS
  // ========================================================
  if (chunkX === 1 && chunkZ === -1) {
    // City Approach Highway & Suburban transition
    blueprint.biome = "CITY";
    blueprint.terrain = { elevation: 1.2, thickness: 2.4, materialKey: "curbConcrete" };
    blueprint.roadSegments.push({
      position: [180, 1.25, -200],
      length: 140,
      width: 9,
      rotation: [0, -Math.PI / 3, 0],
    });
    return blueprint;
  }

  if (chunkX === 2 && (chunkZ === -1 || chunkZ === -2)) {
    // Central City Grand Avenue & Corporate Skyline & Central Spire
    blueprint.biome = "CITY";
    blueprint.terrain = { elevation: 1.2, thickness: 2.4, materialKey: "curbConcrete" };
    blueprint.roadSegments.push({
      position: [360, 1.25, -220],
      length: 180,
      width: 10,
    });
    return blueprint;
  }

  // ========================================================
  // 6. SUNKEN COAST CHUNKS
  // ========================================================
  if (chunkX === 2 && chunkZ === 0) {
    // Coastal Shoreline Dunes, Coastal Road & Wooden Maritime Pier
    blueprint.biome = "COAST";
    blueprint.terrain = { elevation: 0.3, thickness: 1.5, materialKey: "beachSand" };
    blueprint.roadSegments.push({
      position: [360, 0.8, 0],
      length: 180,
      width: 8,
    });
    return blueprint;
  }

  if (chunkX === 3 && chunkZ === 0) {
    // Azure Point Lighthouse & Coastal Bluffs
    blueprint.biome = "COAST";
    blueprint.terrain = { elevation: 0.3, thickness: 1.5, materialKey: "beachSand" };
    return blueprint;
  }

  // ========================================================
  // 7. GENERAL PROCEDURAL WILDERNESS CHUNKS (Infinite Extension)
  // ========================================================
  blueprint.biome = "WILDERNESS";
  // Determine wilderness elevation and terrain style based on coordinates
  if (worldCenterZ < -400) {
    // Northern wilderness = alpine foothills
    blueprint.terrain = { elevation: 6.0, thickness: 12.0, materialKey: "cliffStone" };
    for (let i = 0; i < 4; i++) {
      blueprint.boulders.push({
        position: [worldCenterX + (rng() - 0.5) * 160, 7.0, worldCenterZ + (rng() - 0.5) * 160],
        scale: 1.4 + rng() * 0.8,
      });
    }
  } else if (worldCenterX < -200) {
    // Western wilderness = deep pine forest
    blueprint.terrain = { elevation: 2.5, thickness: 5.0, materialKey: "forestGrass" };
    for (let i = 0; i < 10; i++) {
      blueprint.trees.push({
        position: [worldCenterX + (rng() - 0.5) * 160, 2.5, worldCenterZ + (rng() - 0.5) * 160],
        scale: 0.75 + rng() * 0.5,
      });
    }
  } else if (worldCenterX > 300 && worldCenterZ > 0) {
    // Eastern coastal wilderness = dunes
    blueprint.terrain = { elevation: 0.3, thickness: 1.5, materialKey: "beachSand" };
  } else {
    // Temperate countryside meadow
    blueprint.terrain = { elevation: 0.05, thickness: 2.0, materialKey: "meadowGrass" };
    for (let i = 0; i < 5; i++) {
      blueprint.trees.push({
        position: [worldCenterX + (rng() - 0.5) * 160, 0.05, worldCenterZ + (rng() - 0.5) * 160],
        scale: 0.8 + rng() * 0.4,
      });
    }
  }

  return blueprint;
}
