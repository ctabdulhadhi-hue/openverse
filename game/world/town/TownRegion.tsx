"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type * as THREE from "three";

import { WestportNPCs } from "@/game/npcs";

import { OutpostDoor, TownKiosk, TownSign } from "../interactables";
import { ClockTower } from "../landmarks/ClockTower";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { TownBuilding } from "./TownBuildings";

export interface TownRegionProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * Westport Town Region for OPENVERSE.
 *
 * The primary settlement and player spawn location.
 * Features:
 * - Central cobblestone plaza disk with compass inlay
 * - Historic Clock Tower landmark at North edge ([0, 0, -28])
 * - Multi-block town layout: Market Street, Residential Lane, and Civic Hall
 * - Streetlamps, benches, static utility rover, and perimeter vegetation
 * - Interactive world objects: Town Sign, Civic Kiosk, and Outpost Door
 * - Living NPC population: pedestrians, workers, travelers, and outpost sentries
 */
export function TownRegion({ playerPosRef }: TownRegionProps = {}) {
  return (
    <group name="town-region">
      {/* Westport NPC Population (Phase 7) */}
      <WestportNPCs playerPosRef={playerPosRef} />

      {/* ======================================================== */}
      {/* 1. CENTRAL TOWN SQUARE PLAZA (Player Spawns: [0, 1.2, 8])*/}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Plaza Paving Disk Foundation */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.05, 0]}>
          <CuboidCollider args={[22, 0.05, 22]} />
          <mesh receiveShadow material={SHARED_MATERIALS.plazaCobble}>
            <cylinderGeometry args={[26, 26.5, 0.1, 40]} />
          </mesh>
        </RigidBody>

        {/* Interactive World Objects (Phase 6) */}
        {/* A. Westport Welcome Sign: located front-left of spawn */}
        <TownSign position={[-3.5, 0, 3.5]} rotation={[0, 0.15, 0]} chunkKey="0,0" />

        {/* B. Civic Bulletin Kiosk: located front-right of spawn */}
        <TownKiosk position={[4.5, 0, 4.0]} rotation={[0, -0.25, 0]} chunkKey="0,0" />

        {/* C. Outpost Archway Door: located West of plaza entrance */}
        <OutpostDoor position={[-16, 0, 0]} rotation={[0, Math.PI / 2, 0]} chunkKey="0,0" />

        {/* Decorative Compass Rose Inlay on Plaza Floor */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[6, 6.4, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>

        {/* Central Town Landmark: Clock Tower positioned North of plaza */}
        <ClockTower />

        {/* Plaza Perimeter Benches (placed safely at radius 16m from center) */}
        {[
          { pos: [15, 0.3, 14] as const, rot: [0, -Math.PI / 4, 0] as const },
          { pos: [-15, 0.3, 14] as const, rot: [0, Math.PI / 4, 0] as const },
          { pos: [16, 0.3, -12] as const, rot: [0, Math.PI / 4, 0] as const },
          { pos: [-16, 0.3, -12] as const, rot: [0, -Math.PI / 4, 0] as const },
        ].map((bench, i) => (
          <RigidBody
            key={i}
            type="fixed"
            colliders={false}
            position={[bench.pos[0], bench.pos[1], bench.pos[2]]}
            rotation={[bench.rot[0], bench.rot[1], bench.rot[2]]}
          >
            <CuboidCollider args={[1.2, 0.3, 0.3]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[2.4, 0.6, 0.6]} />
            </mesh>
          </RigidBody>
        ))}

        {/* Plaza Streetlamps */}
        {[
          [-18, 0, 16] as const,
          [18, 0, 16] as const,
          [-18, 0, -16] as const,
          [18, 0, -16] as const,
        ].map((lamp, i) => (
          <group key={i} position={[lamp[0], lamp[1], lamp[2]]}>
            <RigidBody type="fixed" colliders={false} position={[0, 2.0, 0]}>
              <CuboidCollider args={[0.15, 2.0, 0.15]} />
              <mesh castShadow material={SHARED_MATERIALS.curbConcrete}>
                <cylinderGeometry args={[0.1, 0.15, 4.0, 8]} />
              </mesh>
            </RigidBody>
            <mesh position={[0, 4.1, 0]}>
              <sphereGeometry args={[0.35, 12, 12]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#fde047"
                emissiveIntensity={1.2}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Static Parked Exploration Rover (Plaza South East side) */}
        <group position={[18, 0.45, 6]} rotation={[0, -0.4, 0]}>
          <RigidBody type="fixed" colliders={false} position={[0, 0.5, 0]}>
            <CuboidCollider args={[1.2, 0.6, 2.2]} />
            {/* Chassis */}
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingBlue}>
              <boxGeometry args={[2.2, 0.9, 4.0]} />
            </mesh>
            {/* Cabin */}
            <mesh position={[0, 0.8, -0.2]} castShadow material={SHARED_MATERIALS.glassWindow}>
              <boxGeometry args={[1.9, 0.8, 2.2]} />
            </mesh>
          </RigidBody>
          {/* 4 Wheels */}
          {[
            [-1.15, 0.1, 1.2] as const,
            [1.15, 0.1, 1.2] as const,
            [-1.15, 0.1, -1.2] as const,
            [1.15, 0.1, -1.2] as const,
          ].map((w, wi) => (
            <mesh
              key={wi}
              position={[w[0], w[1], w[2]]}
              rotation={[0, 0, Math.PI / 2]}
              material={SHARED_MATERIALS.roofSlate}
            >
              <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 2. MARKET STREET & COMMERCIAL SHOPS (East of Square)      */}
      {/* ======================================================== */}
      <TownBuilding position={[44, 0, 16]} rotation={[0, -Math.PI / 2, 0]} variant="shop" />
      <TownBuilding position={[44, 0, 36]} rotation={[0, -Math.PI / 2, 0]} variant="shop" />
      <TownBuilding position={[44, 0, -8]} rotation={[0, -Math.PI / 2, 0]} variant="townhouse" />

      {/* ======================================================== */}
      {/* 3. RESIDENTIAL LANE & COTTAGES (West of Square)          */}
      {/* ======================================================== */}
      <TownBuilding position={[-44, 0, 16]} rotation={[0, Math.PI / 2, 0]} variant="cottage" />
      <TownBuilding position={[-44, 0, 36]} rotation={[0, Math.PI / 2, 0]} variant="cottage" />
      <TownBuilding position={[-44, 0, -8]} rotation={[0, Math.PI / 2, 0]} variant="townhouse" />

      {/* ======================================================== */}
      {/* 4. WESTPORT CIVIC DISTRICT (North-East)                  */}
      {/* ======================================================== */}
      <TownBuilding position={[36, 0, -48]} rotation={[0, 0, 0]} variant="civic" />
      <TownBuilding position={[-36, 0, -48]} rotation={[0, 0, 0]} variant="townhouse" />

      {/* ======================================================== */}
      {/* 5. SOUTH SUBURBAN TRANSITION COTTAGES                    */}
      {/* ======================================================== */}
      <TownBuilding position={[-28, 0, 68]} rotation={[0, Math.PI, 0]} variant="cottage" />
      <TownBuilding position={[28, 0, 68]} rotation={[0, Math.PI, 0]} variant="cottage" />
    </group>
  );
}
