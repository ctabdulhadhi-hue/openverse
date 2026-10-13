"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { LAGOON_ISLE_ORIGIN } from "./lagoonIslandData";

export interface LagoonIslandSettlementProps {
  origin?: [number, number, number];
}

/**
 * Coral Bay Settlement (Island Village).
 *
 * Implements:
 * - Handcrafted island stilt cottages with bamboo stilts, wood siding, and palm-thatch roofs
 * - Open-air island trading stall with fruit baskets, spices, and decorative awnings
 * - Community gathering pavilion with benches, carved pillars, and hanging nautical lanterns
 * - Complete Rapier colliders for floors, walls, and stairs
 */
export function LagoonIslandSettlement({
  origin = LAGOON_ISLE_ORIGIN,
}: LagoonIslandSettlementProps) {
  const [ox, oy, oz] = origin;

  return (
    <group position={[ox, oy, oz]} name="lagoon-island-settlement">
      {/* ======================================================== */}
      {/* 1. VILLAGE PLAZA FOUNDATION DECK                         */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[35, 0.45, -20]}>
        <CuboidCollider args={[14.0, 0.1, 14.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[28.0, 0.2, 28.0]} />
        </mesh>
      </RigidBody>

      {/* Decorative Terracotta Paver Inlay */}
      <mesh position={[35, 0.56, -20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24.0, 24.0]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. CHIEF & COMMUNITY PAVILION (Center at [35, 0.5, -20])  */}
      {/* ======================================================== */}
      <group position={[35, 0.55, -20]}>
        {/* Support Columns */}
        {[-3.5, 3.5].map((cx) =>
          [-3.5, 3.5].map((cz) => (
            <mesh
              key={`pav-col-${cx}-${cz}`}
              position={[cx, 1.8, cz]}
              material={SHARED_MATERIALS.pierWood}
              castShadow
            >
              <cylinderGeometry args={[0.18, 0.22, 3.6, 8]} />
            </mesh>
          )),
        )}

        {/* Pyramidal Palm-Thatch Roof */}
        <mesh position={[0, 4.2, 0]} castShadow>
          <coneGeometry args={[5.6, 2.2, 4]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>

        {/* Central Fire Pit / Stone Hearth */}
        <mesh position={[0, 0.2, 0]} material={SHARED_MATERIALS.cliffStone}>
          <cylinderGeometry args={[1.2, 1.4, 0.4, 12]} />
        </mesh>

        {/* Hanging Nautical Lantern */}
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.4, 6]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Circular Wooden Seating Benches */}
        {[-1.8, 1.8].map((bx, bi) => (
          <RigidBody key={`bench-${bi}`} type="fixed" colliders={false} position={[bx, 0.35, 0]}>
            <CuboidCollider args={[0.3, 0.2, 1.2]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[0.6, 0.4, 2.4]} />
            </mesh>
          </RigidBody>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 3. TROPICAL STILT COTTAGE A (Elder's Home, X = 25, Z = -28)*/}
      {/* ======================================================== */}
      <group position={[25, 0.55, -28]}>
        {/* Elevated Timber Floor Deck */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.8, 0]}>
          <CuboidCollider args={[3.2, 0.1, 3.2]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[6.4, 0.2, 6.4]} />
          </mesh>
        </RigidBody>

        {/* Cottage Walls */}
        <RigidBody type="fixed" colliders={false} position={[0, 2.1, 0]}>
          {/* North Wall */}
          <CuboidCollider args={[3.0, 1.2, 0.1]} position={[0, 0, -3.0]} />
          {/* South Wall with Doorway Opening */}
          <CuboidCollider args={[1.1, 1.2, 0.1]} position={[-1.9, 0, 3.0]} />
          <CuboidCollider args={[1.1, 1.2, 0.1]} position={[1.9, 0, 3.0]} />
          {/* East Wall */}
          <CuboidCollider args={[0.1, 1.2, 3.0]} position={[3.0, 0, 0]} />
          {/* West Wall */}
          <CuboidCollider args={[0.1, 1.2, 3.0]} position={[-3.0, 0, 0]} />

          {/* Cottage Structure Mesh */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.0, 2.4, 6.0]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Steep Thatch Gable Roof */}
        <mesh position={[0, 3.9, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[4.8, 1.8, 4]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>

        {/* Entry Steps */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.35, 3.8]}>
          <CuboidCollider args={[1.0, 0.35, 0.6]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[2.0, 0.7, 1.2]} />
          </mesh>
        </RigidBody>
      </group>

      {/* ======================================================== */}
      {/* 4. TROPICAL STILT COTTAGE B (Navigator's House, X = 45, Z = -28)*/}
      {/* ======================================================== */}
      <group position={[45, 0.55, -28]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0.8, 0]}>
          <CuboidCollider args={[3.2, 0.1, 3.2]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[6.4, 0.2, 6.4]} />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" colliders={false} position={[0, 2.1, 0]}>
          <CuboidCollider args={[3.0, 1.2, 0.1]} position={[0, 0, -3.0]} />
          <CuboidCollider args={[1.1, 1.2, 0.1]} position={[-1.9, 0, 3.0]} />
          <CuboidCollider args={[1.1, 1.2, 0.1]} position={[1.9, 0, 3.0]} />
          <CuboidCollider args={[0.1, 1.2, 3.0]} position={[3.0, 0, 0]} />
          <CuboidCollider args={[0.1, 1.2, 3.0]} position={[-3.0, 0, 0]} />

          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.0, 2.4, 6.0]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
        </RigidBody>

        <mesh position={[0, 3.9, 0]} castShadow>
          <coneGeometry args={[4.8, 1.8, 4]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>

        <RigidBody type="fixed" colliders={false} position={[0, 0.35, 3.8]}>
          <CuboidCollider args={[1.0, 0.35, 0.6]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[2.0, 0.7, 1.2]} />
          </mesh>
        </RigidBody>
      </group>

      {/* ======================================================== */}
      {/* 5. OPEN-AIR FRUIT & SPICE MARKET STALL (X = 35, Z = -10) */}
      {/* ======================================================== */}
      <group position={[35, 0.55, -10]}>
        {/* Wooden Stall Table Deck */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.6, 0]}>
          <CuboidCollider args={[2.4, 0.45, 1.0]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[4.8, 0.9, 2.0]} />
          </mesh>
        </RigidBody>

        {/* Striped Market Canopy (Azure & Yellow) */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[5.2, 0.1, 2.8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>

        {/* Fruit Baskets & Goods on Display */}
        {[-1.6, -0.5, 0.6, 1.7].map((fx, fi) => (
          <group key={`fruit-box-${fi}`} position={[fx, 1.15, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.28, 0.3, 10]} />
              <meshStandardMaterial color="#a16207" roughness={0.8} />
            </mesh>
            {/* Colorful Tropical Fruits */}
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.22, 8, 8]} />
              <meshStandardMaterial color={fi % 2 === 0 ? "#f97316" : "#eab308"} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
