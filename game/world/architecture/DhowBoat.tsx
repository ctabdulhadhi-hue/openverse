"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface DhowBoatProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  sailColor?: "saffron" | "ivory" | "blue";
}

/**
 * Traditional Coastal Dhow / Sailing Ship.
 * Features:
 * - Swept wooden hull with curved bow and transom
 * - Tall raked wooden mast
 * - Triangular lateen sail
 * - Deck cargo crates and barrels
 * - Subtle harmonic wave roll and pitch in useFrame
 */
export function DhowBoat({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  sailColor = "ivory",
}: DhowBoatProps) {
  const boatRef = useRef<THREE.Group>(null);
  const sailMat =
    sailColor === "saffron"
      ? SHARED_MATERIALS.bannerSaffron
      : sailColor === "blue"
        ? SHARED_MATERIALS.bannerRoyalBlue
        : SHARED_MATERIALS.buildingWhite;

  useFrame((state) => {
    if (!boatRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle oceanic bobbing & rolling
    boatRef.current.position.y = position[1] + Math.sin(t * 1.4 + position[0]) * 0.08;
    boatRef.current.rotation.z = rotation[2] + Math.sin(t * 1.1 + position[2]) * 0.04;
    boatRef.current.rotation.x = rotation[0] + Math.cos(t * 0.9) * 0.03;
  });

  return (
    <group ref={boatRef} position={position} rotation={rotation} name="dhow-boat">
      {/* 1. Boat Hull Base */}
      <mesh
        position={[0, 0.4 * scale, 0]}
        castShadow
        receiveShadow
        material={SHARED_MATERIALS.pierWood}
      >
        <boxGeometry args={[3.2 * scale, 1.2 * scale, 8.4 * scale]} />
      </mesh>

      {/* Pointed Bow */}
      <mesh
        position={[0, 0.6 * scale, 4.8 * scale]}
        rotation={[-Math.PI / 4, 0, 0]}
        castShadow
        material={SHARED_MATERIALS.pierWood}
      >
        <coneGeometry args={[1.6 * scale, 2.6 * scale, 4]} />
      </mesh>

      {/* Hull Deck Rim / Gunwale */}
      <mesh position={[0, 0.95 * scale, 0]} material={SHARED_MATERIALS.treeTrunk}>
        <boxGeometry args={[3.4 * scale, 0.2 * scale, 8.6 * scale]} />
      </mesh>

      {/* 2. Wooden Mast */}
      <mesh
        position={[0, 4.6 * scale, 0.4 * scale]}
        rotation={[-0.08, 0, 0]}
        castShadow
        material={SHARED_MATERIALS.treeTrunk}
      >
        <cylinderGeometry args={[0.12 * scale, 0.18 * scale, 8.0 * scale, 8]} />
      </mesh>

      {/* 3. Lateen Yardarm & Triangular Sail */}
      <group position={[0, 5.0 * scale, 0.4 * scale]} rotation={[-0.35, 0.25, 0]}>
        {/* Yardarm Pole */}
        <mesh position={[0, 0, 0]} material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[0.08 * scale, 0.08 * scale, 9.2 * scale, 6]} />
        </mesh>
        {/* Triangular Canvas Lateen Sail */}
        <mesh
          position={[0.1 * scale, -1.2 * scale, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={sailMat}
        >
          <coneGeometry args={[2.6 * scale, 5.8 * scale, 3]} />
        </mesh>
      </group>

      {/* 4. Deck Cargo Barrels & Crates */}
      <mesh
        position={[0.6 * scale, 1.3 * scale, -1.6 * scale]}
        castShadow
        material={SHARED_MATERIALS.curbConcrete}
      >
        <cylinderGeometry args={[0.35 * scale, 0.35 * scale, 0.8 * scale, 8]} />
      </mesh>
      <mesh
        position={[-0.5 * scale, 1.3 * scale, -1.4 * scale]}
        castShadow
        material={SHARED_MATERIALS.curbConcrete}
      >
        <boxGeometry args={[0.7 * scale, 0.7 * scale, 0.7 * scale]} />
      </mesh>
    </group>
  );
}
