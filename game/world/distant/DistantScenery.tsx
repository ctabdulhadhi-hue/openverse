"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Distant Scenery & Horizon Panorama for OPENVERSE.
 *
 * Provides distant visual composition that frames the horizon:
 * - Distant alpine mountain ranges to the North (heights 60m-140m)
 * - Distant urban skyline silhouettes to the Northeast
 * - Distant woodland ridgelines to the West
 * - Distant rolling countryside hills to the South
 *
 * Lightweight, non-colliding geometric silhouettes rendered with shared materials
 * and atmospheric fog for immense perceived scale without performance cost.
 */
export function DistantScenery() {
  return (
    <group name="distant-horizon-scenery">
      {/* ======================================================== */}
      {/* 1. NORTHERN ALPINE MOUNTAIN RIDGE SILHOUETTES            */}
      {/* ======================================================== */}
      <group position={[0, 0, -1100]}>
        {/* Massive central peak behind Mount Aethel */}
        <mesh position={[0, 60, 0]} material={SHARED_MATERIALS.mountainPeak}>
          <coneGeometry args={[260, 140, 6]} />
        </mesh>
        {/* Flanking northwest peaks */}
        <mesh position={[-380, 50, 80]} material={SHARED_MATERIALS.mountainPeak}>
          <coneGeometry args={[220, 110, 5]} />
        </mesh>
        <mesh position={[-640, 40, 140]} material={SHARED_MATERIALS.cliffStone}>
          <coneGeometry args={[200, 90, 5]} />
        </mesh>
        {/* Flanking northeast peaks */}
        <mesh position={[360, 45, 90]} material={SHARED_MATERIALS.mountainPeak}>
          <coneGeometry args={[210, 105, 5]} />
        </mesh>
        <mesh position={[680, 35, 160]} material={SHARED_MATERIALS.cliffStone}>
          <coneGeometry args={[190, 85, 5]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. WESTERN WOODLAND RIDGELINE (Forest Horizon)           */}
      {/* ======================================================== */}
      <group position={[-750, 0, -220]}>
        <mesh position={[0, 18, 0]} material={SHARED_MATERIALS.forestGrass}>
          <cylinderGeometry args={[80, 110, 36, 7]} />
        </mesh>
        <mesh position={[40, 15, -180]} material={SHARED_MATERIALS.forestGrass}>
          <cylinderGeometry args={[70, 95, 30, 7]} />
        </mesh>
        <mesh position={[-30, 14, 160]} material={SHARED_MATERIALS.forestGrass}>
          <cylinderGeometry args={[75, 100, 28, 7]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 3. NORTHEAST METROPOLITAN SKYLINE SILHOUETTES            */}
      {/* ======================================================== */}
      <group position={[680, 0, -480]}>
        {/* Distant megatower silhouette */}
        <mesh position={[0, 45, 0]} material={SHARED_MATERIALS.distantScenery}>
          <boxGeometry args={[35, 90, 35]} />
        </mesh>
        <mesh position={[45, 35, 20]} material={SHARED_MATERIALS.distantScenery}>
          <boxGeometry args={[28, 70, 28]} />
        </mesh>
        <mesh position={[-40, 38, -15]} material={SHARED_MATERIALS.distantScenery}>
          <boxGeometry args={[30, 76, 30]} />
        </mesh>
        <mesh position={[85, 26, 40]} material={SHARED_MATERIALS.distantScenery}>
          <boxGeometry args={[24, 52, 24]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. SOUTHERN COUNTRYSIDE ROLLING HILLS                    */}
      {/* ======================================================== */}
      <group position={[0, 0, 520]}>
        <mesh position={[-200, 10, 0]} material={SHARED_MATERIALS.meadowGrass}>
          <cylinderGeometry args={[160, 200, 20, 8]} />
        </mesh>
        <mesh position={[180, 8, 40]} material={SHARED_MATERIALS.meadowGrass}>
          <cylinderGeometry args={[140, 180, 16, 8]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. DISTANT OFFSHORE MARITIME ISLANDS & SEA SPIRES        */}
      {/* ======================================================== */}
      <group position={[920, 0, 120]}>
        {/* Distant Outer Royal Island Mountain */}
        <mesh position={[0, 35, 0]} material={SHARED_MATERIALS.cliffStone}>
          <coneGeometry args={[140, 70, 7]} />
        </mesh>
        {/* Distant Temple Tower Spire on Island */}
        <mesh position={[0, 72, 0]} material={SHARED_MATERIALS.distantScenery}>
          <cylinderGeometry args={[4, 12, 35, 6]} />
        </mesh>
        <mesh position={[0, 92, 0]} material={SHARED_MATERIALS.goldOrnament}>
          <coneGeometry args={[2, 10, 6]} />
        </mesh>

        {/* Flanking Sea Stack Rocks in Ocean */}
        <mesh position={[-160, 18, 60]} material={SHARED_MATERIALS.cliffStone}>
          <cylinderGeometry args={[25, 45, 36, 6]} />
        </mesh>
        <mesh position={[140, 22, -80]} material={SHARED_MATERIALS.cliffStone}>
          <cylinderGeometry args={[30, 50, 44, 6]} />
        </mesh>
      </group>
    </group>
  );
}
