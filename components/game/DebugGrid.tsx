"use client";

interface DebugGridProps {
  visible?: boolean;
}

/**
 * Development grid and coordinate axes helper.
 * Clearly designated as a debug tool; easily toggleable or removed.
 */
export function DebugGrid({ visible = true }: DebugGridProps) {
  if (!visible) return null;

  return (
    <group name="debug-environment-grid">
      {/* 120m development grid with 60 divisions (2m per cell) */}
      <gridHelper args={[140, 70, "#38bdf8", "#334155"]} position={[0, 0.02, 0]} />
      {/* Orientation axes (X: red, Y: green, Z: blue) */}
      <axesHelper args={[6]} position={[0, 0.05, 0]} />
    </group>
  );
}
