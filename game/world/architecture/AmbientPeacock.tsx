"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface AmbientPeacockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Ambient Ornamental Peacock.
 * Royal garden fauna characteristic of palace courtyards.
 * Features:
 * - Iridescent royal blue neck and body
 * - Fan of emerald/turquoise tail feathers
 * - Golden crest feathers
 */
export function AmbientPeacock({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}: AmbientPeacockProps) {
  const s = scale;

  return (
    <group position={position} rotation={rotation} name="ambient-peacock">
      {/* 1. Body & Torso */}
      <mesh position={[0, 0.45 * s, 0]} castShadow material={SHARED_MATERIALS.bannerRoyalBlue}>
        <sphereGeometry args={[0.25 * s, 8, 8]} />
      </mesh>

      {/* 2. Slender Curved Neck */}
      <mesh
        position={[0, 0.75 * s, 0.15 * s]}
        rotation={[0.3, 0, 0]}
        castShadow
        material={SHARED_MATERIALS.bannerRoyalBlue}
      >
        <cylinderGeometry args={[0.08 * s, 0.14 * s, 0.6 * s, 8]} />
      </mesh>

      {/* 3. Head & Golden Crest */}
      <mesh
        position={[0, 1.05 * s, 0.22 * s]}
        castShadow
        material={SHARED_MATERIALS.bannerRoyalBlue}
      >
        <sphereGeometry args={[0.12 * s, 8, 8]} />
      </mesh>
      {/* Golden Beak */}
      <mesh
        position={[0, 1.02 * s, 0.35 * s]}
        rotation={[Math.PI / 2, 0, 0]}
        material={SHARED_MATERIALS.goldOrnament}
      >
        <coneGeometry args={[0.05 * s, 0.16 * s, 4]} />
      </mesh>
      {/* Crest Fan */}
      <mesh position={[0, 1.2 * s, 0.22 * s]} material={SHARED_MATERIALS.goldOrnament}>
        <cylinderGeometry args={[0.12 * s, 0.02 * s, 0.18 * s, 6]} />
      </mesh>

      {/* 4. Elegant Emerald / Turquoise Tail Plumes */}
      <group position={[0, 0.4 * s, -0.2 * s]} rotation={[-0.4, 0, 0]}>
        <mesh castShadow material={SHARED_MATERIALS.turquoiseStone}>
          <cylinderGeometry args={[0.05 * s, 0.6 * s, 1.6 * s, 8]} />
        </mesh>
        {/* Tail Eye Accents */}
        {[-0.2 * s, 0, 0.2 * s].map((ox, oi) => (
          <mesh
            key={oi}
            position={[ox, -0.6 * s, 0.1 * s]}
            material={SHARED_MATERIALS.goldOrnament}
          >
            <sphereGeometry args={[0.08 * s, 6, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
