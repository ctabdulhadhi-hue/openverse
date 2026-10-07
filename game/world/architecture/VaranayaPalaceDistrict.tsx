"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { BannersAndFlags } from "./BannersAndFlags";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { JharokhaBalcony } from "./JharokhaBalcony";
import { PillarModule } from "./PillarModule";

export interface VaranayaPalaceProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  variant?: "royal-palace" | "merchant-haveli" | "temple-hall";
}

/**
 * Varanaya Palatial Multi-Tiered Architecture Module.
 * Features:
 * - Monumental sandstone plinth and ground colonnade
 * - Ivory marble upper residential and ceremonial floors
 * - Projecting carved Jharokha balconies with stone screens
 * - Crowning rooftop Chhatri pavilions with golden kalashas
 * - Ceremonial silk banners
 * - Solid colliders for building footprint
 */
export function VaranayaPalace({
  position,
  rotation = [0, 0, 0],
  width = 16.0,
  height = 14.0,
  depth = 14.0,
  variant = "merchant-haveli",
}: VaranayaPalaceProps) {
  const halfW = width / 2;
  const halfD = depth / 2;
  const groundH = height * 0.45;
  const upperH = height * 0.55;

  const isRoyal = variant === "royal-palace";

  return (
    <group position={position} rotation={rotation} name={`palace-${variant}`}>
      {/* 1. Ground Floor Solid Block (Sandstone) */}
      <RigidBody type="fixed" colliders={false} position={[0, groundH / 2, 0]}>
        <CuboidCollider args={[halfW, groundH / 2, halfD]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[width, groundH, depth]} />
        </mesh>
      </RigidBody>

      {/* Decorative Carved Base Molding */}
      <mesh position={[0, groundH, 0]} material={SHARED_MATERIALS.carvedStone}>
        <boxGeometry args={[width + 0.6, 0.4, depth + 0.6]} />
      </mesh>

      {/* Front Colonnade Pillars along Ground Facade */}
      {[-halfW * 0.7, -halfW * 0.25, halfW * 0.25, halfW * 0.7].map((px, i) => (
        <PillarModule
          key={i}
          position={[px, 0, halfD + 0.2]}
          height={groundH}
          radius={0.3}
          materialColor={isRoyal ? "ivory" : "sandstone"}
        />
      ))}

      {/* 2. Upper Floor Tier (Ivory Marble Facade) */}
      <RigidBody type="fixed" colliders={false} position={[0, groundH + upperH / 2, 0]}>
        <CuboidCollider args={[halfW * 0.9, upperH / 2, halfD * 0.9]} />
        <mesh
          castShadow
          receiveShadow
          material={isRoyal ? SHARED_MATERIALS.ivoryMarble : SHARED_MATERIALS.warmSandstone}
        >
          <boxGeometry args={[width * 0.9, upperH, depth * 0.9]} />
        </mesh>
      </RigidBody>

      {/* Upper Cornice & Terracotta Parapet */}
      <mesh position={[0, height, 0]} castShadow material={SHARED_MATERIALS.templeTerracotta}>
        <boxGeometry args={[width * 0.95, 0.4, depth * 0.95]} />
      </mesh>

      {/* 3. Projecting Jharokha Balconies on Upper Facade */}
      <JharokhaBalcony position={[-halfW * 0.45, groundH + 1.2, halfD * 0.9]} scale={0.9} />
      <JharokhaBalcony position={[halfW * 0.45, groundH + 1.2, halfD * 0.9]} scale={0.9} />
      {isRoyal && <JharokhaBalcony position={[0, groundH + 1.6, halfD * 0.9 + 0.4]} scale={1.1} />}

      {/* 4. Rooftop Chhatri Pavilions on Terraces */}
      <ChhatriPavilion
        position={[-halfW * 0.35, height, -halfD * 0.35]}
        scale={0.9}
        materialType={isRoyal ? "ivory" : "sandstone"}
      />
      <ChhatriPavilion
        position={[halfW * 0.35, height, -halfD * 0.35]}
        scale={0.9}
        materialType={isRoyal ? "ivory" : "sandstone"}
      />
      {isRoyal && <ChhatriPavilion position={[0, height, 0]} scale={1.3} materialType="ivory" />}

      {/* 5. Silk Banners fluttering on Roof Corners */}
      <BannersAndFlags
        position={[-halfW * 0.4, height + 3.0, halfD * 0.4]}
        height={5.0}
        color={isRoyal ? "saffron" : "blue"}
        scale={0.8}
      />
      <BannersAndFlags
        position={[halfW * 0.4, height + 3.0, halfD * 0.4]}
        height={5.0}
        color={isRoyal ? "gold" : "saffron"}
        scale={0.8}
      />
    </group>
  );
}
