"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface BannersAndFlagsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
  color?: "saffron" | "blue" | "gold";
  scale?: number;
}

/**
 * Fluttering Ceremonial Banners and Flagpoles.
 * Adds vibrant color, movement, and festival grandeur to bridges, gates, and towers.
 */
export function BannersAndFlags({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 8.0,
  color = "saffron",
  scale = 1.0,
}: BannersAndFlagsProps) {
  const bannerMeshRef = useRef<THREE.Mesh>(null);

  const bannerMat =
    color === "blue"
      ? SHARED_MATERIALS.bannerRoyalBlue
      : color === "gold"
        ? SHARED_MATERIALS.bannerGold
        : SHARED_MATERIALS.bannerSaffron;

  useFrame((state) => {
    if (!bannerMeshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle fluttering wave motion
    bannerMeshRef.current.rotation.y = Math.sin(t * 3.2 + position[0]) * 0.18;
    bannerMeshRef.current.rotation.z = Math.cos(t * 2.4 + position[2]) * 0.08;
  });

  const poleHeight = height * scale;

  return (
    <group position={position} rotation={rotation} name="ceremonial-banner">
      {/* 1. Flagpole Mast */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow material={SHARED_MATERIALS.goldOrnament}>
        <cylinderGeometry args={[0.08 * scale, 0.12 * scale, poleHeight, 8]} />
      </mesh>

      {/* 2. Top Spearhead / Finial */}
      <mesh position={[0, poleHeight + 0.3 * scale, 0]} material={SHARED_MATERIALS.goldOrnament}>
        <coneGeometry args={[0.18 * scale, 0.6 * scale, 8]} />
      </mesh>

      {/* 3. Fluttering Fabric Banner */}
      <mesh
        ref={bannerMeshRef}
        position={[0.9 * scale, poleHeight - 1.8 * scale, 0]}
        castShadow
        material={bannerMat}
      >
        <planeGeometry args={[1.8 * scale, 3.2 * scale]} />
      </mesh>
    </group>
  );
}
