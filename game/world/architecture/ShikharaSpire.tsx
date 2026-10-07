"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface ShikharaSpireProps {
  position?: [number, number, number];
  height?: number;
  baseWidth?: number;
  scale?: number;
  hasBanner?: boolean;
}

/**
 * Monumental Shikhara Spire (Sacred Temple/Palace Tower).
 * The defining silhouette of ancient coastal Indian monumental architecture.
 * Features:
 * - Multi-tiered stepped receding body with carved stone cornices
 * - Corner miniature turrets (urushringas)
 * - Ribbed stone amalaka crown disk
 * - Gleaming golden kalasha finial and summit flagpole
 */
export function ShikharaSpire({
  position = [0, 0, 0],
  height = 36.0,
  baseWidth = 14.0,
  scale = 1.0,
  hasBanner = true,
}: ShikharaSpireProps) {
  const bw = baseWidth * scale;
  const h = height * scale;

  // 6 receding stepped tiers
  const tiers = [
    { y: 0.1, w: bw, h: h * 0.22 },
    { y: h * 0.22, w: bw * 0.86, h: h * 0.18 },
    { y: h * 0.4, w: bw * 0.72, h: h * 0.16 },
    { y: h * 0.56, w: bw * 0.58, h: h * 0.14 },
    { y: h * 0.7, w: bw * 0.44, h: h * 0.12 },
    { y: h * 0.82, w: bw * 0.3, h: h * 0.1 },
  ];

  const spireTopY = h * 0.92;

  return (
    <group position={position} name="shikhara-spire">
      {/* 1. Receding Stepped Body Tiers */}
      {tiers.map((tier, idx) => (
        <group key={idx} position={[0, tier.y + tier.h / 2, 0]}>
          {/* Main Tier Block */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[tier.w, tier.h, tier.w]} />
          </mesh>

          {/* Ornamental Belt / Cornice molding */}
          <mesh position={[0, tier.h / 2, 0]} castShadow material={SHARED_MATERIALS.carvedStone}>
            <boxGeometry args={[tier.w * 1.06, tier.h * 0.15, tier.w * 1.06]} />
          </mesh>

          {/* Corner Miniature Turrets on Lower 3 Tiers */}
          {idx < 3 &&
            (
              [
                [-tier.w * 0.48, tier.w * 0.48],
                [tier.w * 0.48, tier.w * 0.48],
                [-tier.w * 0.48, -tier.w * 0.48],
                [tier.w * 0.48, -tier.w * 0.48],
              ] as [number, number][]
            ).map(([cx, cz], ci) => (
              <mesh
                key={ci}
                position={[cx, tier.h * 0.2, cz]}
                castShadow
                material={SHARED_MATERIALS.deepSandstone}
              >
                <boxGeometry args={[tier.w * 0.22, tier.h * 0.8, tier.w * 0.22]} />
              </mesh>
            ))}
        </group>
      ))}

      {/* 2. Ribbed Amalaka Crowning Stone Disk */}
      <mesh
        position={[0, spireTopY + 0.6 * scale, 0]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <cylinderGeometry args={[bw * 0.28, bw * 0.32, 1.2 * scale, 24]} />
      </mesh>

      {/* 3. Golden Kalasha Pot & Spire Finial */}
      <group position={[0, spireTopY + 1.8 * scale, 0]}>
        {/* Pot Base */}
        <mesh material={SHARED_MATERIALS.goldOrnament}>
          <sphereGeometry args={[bw * 0.16, 16, 16]} />
        </mesh>
        {/* Upper Needle */}
        <mesh position={[0, 1.2 * scale, 0]} material={SHARED_MATERIALS.goldOrnament}>
          <coneGeometry args={[bw * 0.08, 2.4 * scale, 12]} />
        </mesh>
      </group>

      {/* 4. Summit Flagpole & Fluttering Saffron Banner */}
      {hasBanner && (
        <group position={[0, spireTopY + 3.6 * scale, 0]}>
          <mesh material={SHARED_MATERIALS.goldOrnament}>
            <cylinderGeometry args={[0.06 * scale, 0.06 * scale, 4.0 * scale, 8]} />
          </mesh>
          <mesh
            position={[0.8 * scale, 1.0 * scale, 0]}
            rotation={[0, 0, 0]}
            material={SHARED_MATERIALS.bannerSaffron}
          >
            <planeGeometry args={[1.6 * scale, 1.2 * scale]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
