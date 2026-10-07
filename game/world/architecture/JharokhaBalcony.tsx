"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface JharokhaBalconyProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  scale?: number;
  hasRoofDome?: boolean;
}

/**
 * Jharokha Balcony (Projecting Carved Oriel Balcony).
 * Adds dense architectural depth to palace and residence facades.
 * Features:
 * - Cantilevered stepped bracket console
 * - Pierced stone lattice parapet (jali railing)
 * - Cusped arch window opening
 * - Fluted chhatri canopy roof with golden spire
 */
export function JharokhaBalcony({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.4,
  scale = 1.0,
  hasRoofDome = true,
}: JharokhaBalconyProps) {
  const w = width * scale;
  const d = 1.2 * scale;

  return (
    <group position={position} rotation={rotation} name="jharokha-balcony">
      {/* 1. Cantilevered Support Brackets Below Floor */}
      <mesh
        position={[0, -0.4 * scale, d * 0.4]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <boxGeometry args={[w * 0.9, 0.6 * scale, d * 0.8]} />
      </mesh>

      {/* 2. Balcony Floor Slab */}
      <mesh
        position={[0, 0.05 * scale, d * 0.5]}
        castShadow
        receiveShadow
        material={SHARED_MATERIALS.warmSandstone}
      >
        <boxGeometry args={[w, 0.2 * scale, d]} />
      </mesh>

      {/* 3. Carved Stone Lattice Parapet (Jali Screen) */}
      <mesh position={[0, 0.55 * scale, d]} castShadow material={SHARED_MATERIALS.carvedStone}>
        <boxGeometry args={[w, 0.8 * scale, 0.12 * scale]} />
      </mesh>
      {/* Side Parapets */}
      <mesh
        position={[-w / 2, 0.55 * scale, d * 0.5]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <boxGeometry args={[0.12 * scale, 0.8 * scale, d]} />
      </mesh>
      <mesh
        position={[w / 2, 0.55 * scale, d * 0.5]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <boxGeometry args={[0.12 * scale, 0.8 * scale, d]} />
      </mesh>

      {/* 4. Slender Front Pillars */}
      {[-w * 0.4, w * 0.4].map((px, idx) => (
        <mesh
          key={idx}
          position={[px, 1.4 * scale, d * 0.95]}
          castShadow
          material={SHARED_MATERIALS.ivoryMarble}
        >
          <cylinderGeometry args={[0.08 * scale, 0.08 * scale, 1.5 * scale, 8]} />
        </mesh>
      ))}

      {/* 5. Cusped Arch Cornice */}
      <mesh
        position={[0, 2.2 * scale, d * 0.6]}
        castShadow
        material={SHARED_MATERIALS.warmSandstone}
      >
        <boxGeometry args={[w * 1.1, 0.25 * scale, d * 1.2]} />
      </mesh>

      {/* 6. Canopy Roof Dome & Kalasha */}
      {hasRoofDome && (
        <group position={[0, 2.35 * scale, d * 0.6]}>
          <mesh castShadow material={SHARED_MATERIALS.templeTerracotta}>
            <sphereGeometry args={[w * 0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, w * 0.58, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <cylinderGeometry args={[0.08 * scale, 0.2 * scale, 0.4 * scale, 8]} />
          </mesh>
          <mesh position={[0, w * 0.58 + 0.3 * scale, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <sphereGeometry args={[0.15 * scale, 8, 8]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
