"use client";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { PillarModule } from "./PillarModule";

export interface ChhatriPavilionProps {
  position?: [number, number, number];
  scale?: number;
  pillarsCount?: 4 | 8;
  materialType?: "sandstone" | "ivory";
}

/**
 * Traditional Royal Chhatri (Domed Pavilion) Module.
 * Characteristic feature of ancient coastal palace architecture.
 * Features:
 * - Square stepped base
 * - Slender carved stone pillars
 * - Projecting cantilevered eaves (chhajja)
 * - Ribbed fluted dome
 * - Golden kalasha spire finial
 */
export function ChhatriPavilion({
  position = [0, 0, 0],
  scale = 1.0,
  pillarsCount = 4,
  materialType = "sandstone",
}: ChhatriPavilionProps) {
  const stoneMat =
    materialType === "ivory" ? SHARED_MATERIALS.ivoryMarble : SHARED_MATERIALS.warmSandstone;

  const pillarRadius = 0.22 * scale;
  const pillarHeight = 3.8 * scale;
  const span = 2.4 * scale;

  return (
    <group position={position} name="chhatri-pavilion">
      {/* 1. Stepped Plinth */}
      <mesh position={[0, 0.2 * scale, 0]} castShadow receiveShadow material={stoneMat}>
        <boxGeometry args={[span * 2 + 1.2 * scale, 0.4 * scale, span * 2 + 1.2 * scale]} />
      </mesh>

      {/* 2. Pillars */}
      {pillarsCount === 4 && (
        <>
          <PillarModule
            position={[-span, 0.4 * scale, -span]}
            height={pillarHeight}
            radius={pillarRadius}
            materialColor={materialType}
          />
          <PillarModule
            position={[span, 0.4 * scale, -span]}
            height={pillarHeight}
            radius={pillarRadius}
            materialColor={materialType}
          />
          <PillarModule
            position={[-span, 0.4 * scale, span]}
            height={pillarHeight}
            radius={pillarRadius}
            materialColor={materialType}
          />
          <PillarModule
            position={[span, 0.4 * scale, span]}
            height={pillarHeight}
            radius={pillarRadius}
            materialColor={materialType}
          />
        </>
      )}

      {/* 3. Architrave / Lintel Ring */}
      <mesh
        position={[0, (0.4 + pillarHeight) * scale, 0]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <boxGeometry args={[span * 2 + 0.6 * scale, 0.35 * scale, span * 2 + 0.6 * scale]} />
      </mesh>

      {/* 4. Projecting Sloping Eaves (Chhajja) */}
      <mesh position={[0, (0.4 + pillarHeight + 0.3) * scale, 0]} castShadow material={stoneMat}>
        <cylinderGeometry args={[span * 1.5, span * 1.1, 0.3 * scale, 8]} />
      </mesh>

      {/* 5. Drum Base for Dome */}
      <mesh
        position={[0, (0.4 + pillarHeight + 0.6) * scale, 0]}
        castShadow
        material={SHARED_MATERIALS.deepSandstone}
      >
        <cylinderGeometry args={[span * 1.1, span * 1.15, 0.4 * scale, 16]} />
      </mesh>

      {/* 6. Fluted Hemisphere Dome */}
      <mesh position={[0, (0.4 + pillarHeight + 1.6) * scale, 0]} castShadow material={stoneMat}>
        <sphereGeometry args={[span * 1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* 7. Lotus Cap & Golden Kalasha Spire Finial */}
      <mesh
        position={[0, (0.4 + pillarHeight + 2.75) * scale, 0]}
        material={SHARED_MATERIALS.goldOrnament}
      >
        <cylinderGeometry args={[0.35 * scale, 0.6 * scale, 0.25 * scale, 12]} />
      </mesh>
      <mesh
        position={[0, (0.4 + pillarHeight + 3.1) * scale, 0]}
        material={SHARED_MATERIALS.goldOrnament}
      >
        <sphereGeometry args={[0.35 * scale, 12, 12]} />
      </mesh>
      <mesh
        position={[0, (0.4 + pillarHeight + 3.65) * scale, 0]}
        material={SHARED_MATERIALS.goldOrnament}
      >
        <coneGeometry args={[0.15 * scale, 0.8 * scale, 8]} />
      </mesh>
    </group>
  );
}
