"use client";

import type * as THREE from "three";

import { DistantScenery } from "./distant/DistantScenery";
import { WorldStreamer } from "./streaming/WorldStreamer";
import { WaterPlane } from "./terrain/WaterPlane";

export interface WorldProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * OPENVERSE World Master Orchestrator (Phase 5).
 *
 * Implements a high-performance streaming open world:
 * - Player-centered chunk streaming with configurable active/load/unload radii
 * - Dynamic collision enabling (Rapier colliders active only near player)
 * - Automatic unmounting of distant chunks to conserve memory
 * - Distant mountain and skyline silhouettes provide seamless horizon continuity
 * - Zero artificial world boundaries
 */
export function World({ playerPosRef }: WorldProps) {
  return (
    <group name="openverse-world">
      {/* 1. Global Horizon Scenery (Distant low-poly mountain ranges & skyline silhouettes) */}
      <DistantScenery />

      {/* 2. Coastal Ocean Water (Eastern maritime shoreline) */}
      <WaterPlane />

      {/* 3. Player-Centered World Streamer (Loads/unloads chunks, colliders, and geometry) */}
      <WorldStreamer playerPosRef={playerPosRef} />
    </group>
  );
}
