"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { ClockTower } from "../landmarks/ClockTower";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { TownBuilding } from "./TownBuildings";

/**
 * Westport Town Region for OPENVERSE (Phase 4).
 * The primary settlement and default player spawn location.
 */
export function TownRegion() {
  return (
    <group name="town-region">
      {/* ======================================================== */}
      {/* 1. CENTRAL TOWN SQUARE PLAZA (Player Spawn: [0, 1.2, 0]) */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Plaza Paving Disk with Solid Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.05, 0]}>
          <CuboidCollider args={[18, 0.05, 18]} />
          <mesh receiveShadow material={SHARED_MATERIALS.plazaCobble}>
            <cylinderGeometry args={[22, 22.5, 0.1, 40]} />
          </mesh>
        </RigidBody>

        {/* Decorative Compass Rose Inlay on Plaza Floor */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[6, 6.3, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
        </mesh>

        {/* Central Town Landmark: Clock Tower */}
        <ClockTower />

        {/* Plaza Perimeter Benches & Planters */}
        {[
          {
            pos: [12, 0.3, 12] as [number, number, number],
            rot: [0, -Math.PI / 4, 0] as [number, number, number],
          },
          {
            pos: [-12, 0.3, 12] as [number, number, number],
            rot: [0, Math.PI / 4, 0] as [number, number, number],
          },
          {
            pos: [12, 0.3, -12] as [number, number, number],
            rot: [0, Math.PI / 4, 0] as [number, number, number],
          },
          {
            pos: [-12, 0.3, -12] as [number, number, number],
            rot: [0, -Math.PI / 4, 0] as [number, number, number],
          },
        ].map((bench, i) => (
          <RigidBody
            key={i}
            type="fixed"
            colliders={false}
            position={bench.pos}
            rotation={bench.rot}
          >
            <CuboidCollider args={[1.2, 0.3, 0.4]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[2.4, 0.6, 0.8]} />
            </mesh>
          </RigidBody>
        ))}

        {/* Plaza Street Lamps */}
        {(
          [
            [15, 2.5, 0],
            [-15, 2.5, 0],
            [0, 2.5, 15],
            [0, 2.5, -15],
          ] as const
        ).map((lamp, idx) => (
          <group key={idx} position={[lamp[0], lamp[1], lamp[2]]}>
            <mesh castShadow material={SHARED_MATERIALS.curbConcrete}>
              <cylinderGeometry args={[0.08, 0.12, 5, 8]} />
            </mesh>
            <mesh position={[0, 2.6, 0]}>
              <sphereGeometry args={[0.35, 12, 12]} />
              <meshStandardMaterial color="#fef08a" emissive="#ca8a04" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 2. TOWN BUILDINGS & STREETSCAPE                          */}
      {/* ======================================================== */}
      {/* Municipal Hall */}
      <TownBuilding position={[-28, 0, 20]} rotation={[0, Math.PI / 2, 0]} variant="civic" />

      {/* Main Street Shops (East side of plaza) */}
      <TownBuilding position={[26, 0, 16]} rotation={[0, -Math.PI / 2, 0]} variant="shop" />
      <TownBuilding position={[26, 0, -18]} rotation={[0, -Math.PI / 2, 0]} variant="shop" />
      <TownBuilding position={[26, 0, 52]} rotation={[0, -Math.PI / 2, 0]} variant="shop" />

      {/* Townhouses (West side of avenue) */}
      <TownBuilding position={[-26, 0, -22]} rotation={[0, Math.PI / 2, 0]} variant="townhouse" />
      <TownBuilding position={[-26, 0, 54]} rotation={[0, Math.PI / 2, 0]} variant="townhouse" />
      <TownBuilding position={[-26, 0, 92]} rotation={[0, Math.PI / 2, 0]} variant="townhouse" />

      {/* Residential Cottages (Outer neighborhood perimeter) */}
      <TownBuilding position={[-62, 0, 12]} rotation={[0, 0.1, 0]} variant="cottage" />
      <TownBuilding position={[62, 0, 12]} rotation={[0, -0.1, 0]} variant="cottage" />
      <TownBuilding position={[-62, 0, 54]} rotation={[0, 0.2, 0]} variant="cottage" />
      <TownBuilding position={[62, 0, 54]} rotation={[0, -0.2, 0]} variant="cottage" />
      <TownBuilding position={[-62, 0, 98]} rotation={[0, 0, 0]} variant="cottage" />
      <TownBuilding position={[62, 0, 98]} rotation={[0, 0, 0]} variant="cottage" />

      {/* ======================================================== */}
      {/* 3. STATIC PARKED EXPLORATION VEHICLES                    */}
      {/* ======================================================== */}
      {/* Parked Utility Rover (Near shop street) */}
      <group position={[18, 0, 36]} rotation={[0, 0.15, 0]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0.9, 0]}>
          <CuboidCollider args={[1.2, 0.8, 2.2]} />
          {/* Chassis */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingBlue}>
            <boxGeometry args={[2.4, 1.2, 4.4]} />
          </mesh>
          {/* Cabin */}
          <mesh position={[0, 0.8, -0.3]} castShadow material={SHARED_MATERIALS.roofSlate}>
            <boxGeometry args={[2.1, 0.9, 2.4]} />
          </mesh>
        </RigidBody>
        {/* Wheels */}
        {(
          [
            [-1.25, 0.45, 1.4],
            [1.25, 0.45, 1.4],
            [-1.25, 0.45, -1.4],
            [1.25, 0.45, -1.4],
          ] as const
        ).map((w, wIdx) => (
          <mesh key={wIdx} position={[w[0], w[1], w[2]]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.4, 16]} />
            <meshStandardMaterial color="#171717" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
