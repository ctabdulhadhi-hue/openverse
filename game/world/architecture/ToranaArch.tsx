"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { PillarModule } from "./PillarModule";

export interface ToranaArchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  scale?: number;
  hasBanners?: boolean;
}

/**
 * Monumental Torana Arch (Ceremonial Gateway Arch).
 * Features:
 * - Flanking carved twin pillars with decorative brackets
 * - Arched multi-foil lintel beam with carved scrolls
 * - Crowning finials and ceremonial gold disks
 * - Hanging silk banners
 */
export function ToranaArch({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 6.0,
  height = 7.0,
  scale = 1.0,
  hasBanners = true,
}: ToranaArchProps) {
  const halfW = (width / 2) * scale;
  const h = height * scale;

  return (
    <group position={position} rotation={rotation} name="torana-arch">
      {/* 1. Left Pillar */}
      <PillarModule
        position={[-halfW, 0, 0]}
        height={h * 0.75}
        radius={0.38 * scale}
        materialColor="sandstone"
      />

      {/* 2. Right Pillar */}
      <PillarModule
        position={[halfW, 0, 0]}
        height={h * 0.75}
        radius={0.38 * scale}
        materialColor="sandstone"
      />

      {/* 3. Lower Horizontal Arch Beam */}
      <mesh position={[0, h * 0.75, 0]} castShadow material={SHARED_MATERIALS.warmSandstone}>
        <boxGeometry args={[width * scale + 1.2 * scale, 0.45 * scale, 0.9 * scale]} />
      </mesh>

      {/* 4. Upper Cusped Archway & Medallion */}
      <mesh position={[0, h * 0.88, 0]} castShadow material={SHARED_MATERIALS.carvedStone}>
        <boxGeometry args={[width * scale * 0.85, 0.4 * scale, 0.7 * scale]} />
      </mesh>

      {/* Central Ornamental Sun Crest / Medallion */}
      <mesh position={[0, h * 0.95, 0]} material={SHARED_MATERIALS.goldOrnament}>
        <cylinderGeometry args={[0.5 * scale, 0.5 * scale, 0.2 * scale, 16]} />
      </mesh>

      {/* Crowning Kalashas on Pillars */}
      {[-halfW, halfW].map((px, i) => (
        <group key={i} position={[px, h * 0.75 + 0.4 * scale, 0]}>
          <mesh material={SHARED_MATERIALS.goldOrnament}>
            <sphereGeometry args={[0.35 * scale, 12, 12]} />
          </mesh>
          <mesh position={[0, 0.4 * scale, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <coneGeometry args={[0.15 * scale, 0.5 * scale, 8]} />
          </mesh>
        </group>
      ))}

      {/* Hanging Saffron Banners on Sides */}
      {hasBanners && (
        <>
          <mesh
            position={[-halfW - 0.4 * scale, h * 0.4, 0]}
            material={SHARED_MATERIALS.bannerSaffron}
          >
            <planeGeometry args={[0.4 * scale, 2.8 * scale]} />
          </mesh>
          <mesh
            position={[halfW + 0.4 * scale, h * 0.4, 0]}
            material={SHARED_MATERIALS.bannerRoyalBlue}
          >
            <planeGeometry args={[0.4 * scale, 2.8 * scale]} />
          </mesh>
        </>
      )}
    </group>
  );
}
