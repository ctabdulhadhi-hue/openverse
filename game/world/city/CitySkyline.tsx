"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface CityTowerProps {
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  materialColor?: "blue" | "white" | "tan";
}

export function CityTower({
  position,
  width = 16,
  height = 24,
  depth = 16,
  materialColor = "blue",
}: CityTowerProps) {
  const halfW = width / 2;
  const halfH = height / 2;
  const halfD = depth / 2;

  const mat =
    materialColor === "white"
      ? SHARED_MATERIALS.buildingWhite
      : materialColor === "tan"
        ? SHARED_MATERIALS.buildingTan
        : SHARED_MATERIALS.buildingBlue;

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false} position={[0, halfH, 0]}>
        <CuboidCollider args={[halfW, halfH, halfD]} />
        {/* Main Tower Body */}
        <mesh castShadow receiveShadow material={mat}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
      </RigidBody>
      {/* Rooftop Parapet / HVAC Box */}
      <mesh position={[0, height + 1.2, 0]} castShadow material={SHARED_MATERIALS.roofSlate}>
        <boxGeometry args={[width * 0.7, 2.4, depth * 0.7]} />
      </mesh>
    </group>
  );
}
