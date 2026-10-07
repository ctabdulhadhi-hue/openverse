"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface PalmTreeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Royal Coastal Palm Tree.
 * Features:
 * - Gently curving segmented trunk
 * - Flaring base with root flare
 * - Crown of arching tropical palm fronds
 * - High visual impact for coastal royal gardens and promenades
 */
export function PalmTree({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}: PalmTreeProps) {
  const trunkHeight = 8.5 * scale;
  const frondCount = 9;

  return (
    <group position={position} rotation={rotation} name="palm-tree">
      {/* 1. Trunk Base Flare */}
      <mesh position={[0, 0.4 * scale, 0]} castShadow material={SHARED_MATERIALS.palmBark}>
        <cylinderGeometry args={[0.35 * scale, 0.55 * scale, 0.8 * scale, 8]} />
      </mesh>

      {/* 2. Curved Trunk Segments */}
      <mesh
        position={[0.2 * scale, trunkHeight * 0.5, 0]}
        rotation={[0, 0, -0.06]}
        castShadow
        material={SHARED_MATERIALS.palmBark}
      >
        <cylinderGeometry args={[0.24 * scale, 0.35 * scale, trunkHeight, 8]} />
      </mesh>

      {/* 3. Crown Head & Coconuts */}
      <group position={[0.42 * scale, trunkHeight, 0]}>
        {/* Crown Core */}
        <mesh material={SHARED_MATERIALS.palmBark}>
          <sphereGeometry args={[0.4 * scale, 8, 8]} />
        </mesh>

        {/* Coconuts Cluster */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((ang, ci) => (
          <mesh
            key={ci}
            position={[Math.cos(ang) * 0.3 * scale, -0.25 * scale, Math.sin(ang) * 0.3 * scale]}
            material={SHARED_MATERIALS.treeTrunk}
          >
            <sphereGeometry args={[0.18 * scale, 6, 6]} />
          </mesh>
        ))}

        {/* 4. Arching Palm Fronds */}
        {Array.from({ length: frondCount }).map((_, i) => {
          const angle = (i / frondCount) * Math.PI * 2;
          const droop = 0.55 + (i % 2) * 0.15;

          return (
            <group key={i} rotation={[0, angle, 0]}>
              <group position={[0, 0, 0]} rotation={[droop, 0, 0]}>
                {/* Central Leaf Rib */}
                <mesh
                  position={[0, 0, 1.8 * scale]}
                  castShadow
                  material={SHARED_MATERIALS.palmFrond}
                >
                  <boxGeometry args={[0.08 * scale, 0.04 * scale, 3.6 * scale]} />
                </mesh>
                {/* Arching Frond Blade */}
                <mesh
                  position={[0, -0.05 * scale, 1.8 * scale]}
                  castShadow
                  material={SHARED_MATERIALS.palmFrond}
                >
                  <planeGeometry args={[1.2 * scale, 3.4 * scale]} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}
