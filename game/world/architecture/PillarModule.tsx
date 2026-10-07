"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface PillarModuleProps {
  position?: [number, number, number];
  height?: number;
  radius?: number;
  hasBrackets?: boolean;
  materialColor?: "ivory" | "sandstone" | "carved";
}

/**
 * Monumental Carved Stone Pillar Module.
 * Features:
 * - Square stepped plinth base
 * - Faceted octagonal column shaft
 * - Carved bell capital and four-way bracket support
 * - Polished gold ornamental accent band
 */
export function PillarModule({
  position = [0, 0, 0],
  height = 5.0,
  radius = 0.35,
  hasBrackets = true,
  materialColor = "sandstone",
}: PillarModuleProps) {
  const stoneMat =
    materialColor === "ivory"
      ? SHARED_MATERIALS.ivoryMarble
      : materialColor === "carved"
        ? SHARED_MATERIALS.carvedStone
        : SHARED_MATERIALS.warmSandstone;

  const shaftHeight = height - 1.2;

  return (
    <group position={position} name="pillar-module">
      {/* 1. Stepped Plinth Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow material={stoneMat}>
        <boxGeometry args={[radius * 2.8, 0.4, radius * 2.8]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow material={SHARED_MATERIALS.deepSandstone}>
        <cylinderGeometry args={[radius * 1.3, radius * 1.4, 0.2, 12]} />
      </mesh>

      {/* 2. Column Shaft */}
      <mesh position={[0, 0.6 + shaftHeight / 2, 0]} castShadow material={stoneMat}>
        <cylinderGeometry args={[radius, radius * 1.1, shaftHeight, 12]} />
      </mesh>

      {/* Gold Ring Accent */}
      <mesh position={[0, 0.6 + shaftHeight * 0.75, 0]} material={SHARED_MATERIALS.goldOrnament}>
        <cylinderGeometry args={[radius * 1.12, radius * 1.12, 0.12, 12]} />
      </mesh>

      {/* 3. Carved Capital & Necking */}
      <mesh position={[0, height - 0.4, 0]} castShadow material={SHARED_MATERIALS.carvedStone}>
        <cylinderGeometry args={[radius * 1.5, radius, 0.3, 12]} />
      </mesh>

      {/* 4. Four-Way Bracket Supports (chhajja brackets) */}
      {hasBrackets && (
        <group position={[0, height - 0.15, 0]}>
          <mesh castShadow material={stoneMat}>
            <boxGeometry args={[radius * 3.4, 0.3, radius * 1.4]} />
          </mesh>
          <mesh castShadow material={stoneMat}>
            <boxGeometry args={[radius * 1.4, 0.3, radius * 3.4]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
