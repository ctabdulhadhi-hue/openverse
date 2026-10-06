"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { TerrainChunk } from "./TerrainChunk";

/**
 * Continuous Terrain Foundation for OPENVERSE.
 *
 * Built from modular, interlocking TerrainChunks that form a contiguous,
 * believable landscape across all biomes:
 * Town Basin → Countryside Valley → Forest Woodland → Mountain Massif → City Plateau → Coastal Shoreline.
 */
export function ContinuousTerrain() {
  return (
    <group name="continuous-terrain">
      {/* ======================================================== */}
      {/* 1. CENTRAL BASIN & WESTPORT TOWN MEADOWS (y = 0.0)       */}
      {/* ======================================================== */}
      <TerrainChunk
        id="town-central-basin"
        position={[0, 0, 40]}
        size={[360, 320]}
        material={SHARED_MATERIALS.meadowGrass}
        thickness={2.0}
      />
      <TerrainChunk
        id="town-north-valley"
        position={[0, 0, -140]}
        size={[320, 160]}
        material={SHARED_MATERIALS.meadowGrass}
        thickness={2.0}
      />
      <TerrainChunk
        id="countryside-south"
        position={[0, 0, 240]}
        size={[400, 160]}
        material={SHARED_MATERIALS.meadowGrass}
        thickness={2.0}
      />

      {/* ======================================================== */}
      {/* 2. PINE CREST FOREST WOODLAND PLATEAU (y ≈ 2.0 to 4.5)   */}
      {/* ======================================================== */}
      <TerrainChunk
        id="forest-plateau-main"
        position={[-300, 2.5, -220]}
        size={[320, 360]}
        material={SHARED_MATERIALS.forestGrass}
        thickness={5.0}
      />
      <TerrainChunk
        id="forest-west-wilderness"
        position={[-480, 4.0, -260]}
        size={[220, 340]}
        material={SHARED_MATERIALS.forestGrass}
        thickness={8.0}
      />
      {/* Transitional forest slope / ridge */}
      <TerrainChunk
        id="forest-transition-ridge"
        position={[-160, 1.25, -200]}
        size={[80, 280]}
        material={SHARED_MATERIALS.meadowGrass}
        thickness={2.5}
      />

      {/* ======================================================== */}
      {/* 3. CENTRAL CITY URBAN FOUNDATION (y ≈ 1.2)               */}
      {/* ======================================================== */}
      <TerrainChunk
        id="city-urban-plateau"
        position={[320, 1.2, -260]}
        size={[320, 320]}
        material={SHARED_MATERIALS.curbConcrete}
        thickness={2.4}
      />
      <TerrainChunk
        id="city-northeast-expansion"
        position={[460, 1.2, -340]}
        size={[200, 240]}
        material={SHARED_MATERIALS.curbConcrete}
        thickness={2.4}
      />

      {/* ======================================================== */}
      {/* 4. SUNKEN COAST SHORELINE & DUNES (y ≈ 0.3)              */}
      {/* ======================================================== */}
      <TerrainChunk
        id="coast-beach-shoreline"
        position={[420, 0.3, 120]}
        size={[320, 340]}
        material={SHARED_MATERIALS.beachSand}
        thickness={1.5}
      />
      <TerrainChunk
        id="coast-south-dunes"
        position={[440, 0.3, 320]}
        size={[280, 200]}
        material={SHARED_MATERIALS.beachSand}
        thickness={1.5}
      />

      {/* Coastal Bluffs (Rocky cliff shelf between City and Coast) */}
      <TerrainChunk
        id="coastal-bluffs"
        position={[340, 1.8, -70]}
        size={[240, 60]}
        material={SHARED_MATERIALS.cliffStone}
        thickness={3.6}
      />

      {/* ======================================================== */}
      {/* 5. MOUNT AETHEL ALPINE MASSIF (y ≈ 8.0 to 28.0)          */}
      {/* ======================================================== */}
      {/* Foothill terrace */}
      <TerrainChunk
        id="mountain-foothills"
        position={[0, 8.0, -420]}
        size={[540, 180]}
        material={SHARED_MATERIALS.cliffStone}
        thickness={16.0}
      />
      {/* Mid alpine ridge */}
      <TerrainChunk
        id="mountain-mid-ridge"
        position={[0, 18.0, -560]}
        size={[440, 160]}
        material={SHARED_MATERIALS.cliffStone}
        thickness={36.0}
      />
      {/* High summit massif */}
      <TerrainChunk
        id="mountain-summit-massif"
        position={[0, 28.0, -680]}
        size={[340, 140]}
        material={SHARED_MATERIALS.mountainPeak}
        thickness={56.0}
      />
    </group>
  );
}
