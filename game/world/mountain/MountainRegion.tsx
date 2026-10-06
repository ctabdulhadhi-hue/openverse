"use client";

import { MountainCliffs } from "./MountainCliffs";
import { MountainOverlook } from "../landmarks/MountainOverlook";

/**
 * Mount Aethel Mountain Region for OPENVERSE (Phase 4).
 * Highest elevation region in the north, offering winding ascent trails and summit viewpoint.
 */
export function MountainRegion() {
  return (
    <group name="mountain-region">
      {/* Switchback Hiking Trail & Rocky Cliffs */}
      <MountainCliffs />

      {/* Mount Aethel Overlook Platform Landmark */}
      <MountainOverlook />
    </group>
  );
}
