"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { LAGOON_ISLE_ORIGIN } from "./lagoonIslandData";

export interface LagoonIslandTerrainProps {
  origin?: [number, number, number];
}

/**
 * Lagoon Island Terrain Foundation.
 *
 * Implements:
 * - Coherent tropical atoll landmass with organic rounded contours
 * - Central translucent turquoise lagoon pool with sandy shallows
 * - Powder-white beach fringes and lush grassy interior
 * - Elevated rocky ridge with walkable ramp leading to panoramic summit (Y = 6.2)
 * - Safe physics colliders aligned exactly with visible terrain surfaces
 * - Perimeter water boundaries preventing infinite wandering into deep ocean
 */
export function LagoonIslandTerrain({ origin = LAGOON_ISLE_ORIGIN }: LagoonIslandTerrainProps) {
  const [ox, oy, oz] = origin;

  return (
    <group position={[ox, oy, oz]} name="lagoon-island-terrain">
      {/* ======================================================== */}
      {/* 1. CENTRAL ATOLL ISLAND MAIN GROUND SLABS (COLLIDERS)    */}
      {/* ======================================================== */}
      {/* Central Island Core Deck (Grass / Sand mix) */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.2, 0]}>
        <CuboidCollider args={[48.0, 0.25, 42.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.beachSand}>
          <boxGeometry args={[96.0, 0.5, 84.0]} />
        </mesh>
      </RigidBody>

      {/* Lush Green Tropical Turf Layer on Central Plateau */}
      <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[76.0, 68.0]} />
        <meshStandardMaterial color="#3b7a57" roughness={0.8} />
      </mesh>

      {/* Western Sand Spit (Toward Beach & Forest, X < 0) */}
      <RigidBody type="fixed" colliders={false} position={[-40, 0.15, 0]}>
        <CuboidCollider args={[24.0, 0.2, 34.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.beachSand}>
          <boxGeometry args={[48.0, 0.4, 68.0]} />
        </mesh>
      </RigidBody>

      {/* Eastern Settlement & Harbor Spit (X > 0) */}
      <RigidBody type="fixed" colliders={false} position={[36, 0.25, 12]}>
        <CuboidCollider args={[26.0, 0.25, 36.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.beachSand}>
          <boxGeometry args={[52.0, 0.5, 72.0]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 2. TRANSLUCENT TURQUOISE LAGOON POOL                      */}
      {/* ======================================================== */}
      {/* Lagoon Coral Sand Bed Base */}
      <mesh position={[0, 0.08, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[22.0, 32]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>

      {/* Shimmering Shallow Turquoise Lagoon Water Surface */}
      <mesh position={[0, 0.18, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[21.0, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.08}
          metalness={0.15}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer Shallow Turquoise Atoll Reef Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[52.0, 78.0, 48]} />
        <meshStandardMaterial
          color="#0ea5e9"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ======================================================== */}
      {/* 3. ELEVATED ROCKY RIDGE & VIEWPOINT SUMMIT               */}
      {/* ======================================================== */}
      {/* Rocky Foothills Ramp (Connecting lowlands to ridge) */}
      <RigidBody type="fixed" colliders={false} position={[42, 2.0, 28]} rotation={[0.15, -0.2, 0]}>
        <CuboidCollider args={[10.0, 1.2, 8.0]} />
        <mesh receiveShadow castShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[20.0, 2.4, 16.0]} />
        </mesh>
      </RigidBody>

      {/* Emerald Ridge Summit Outcrop (Y = 5.0 to 6.2, at X = 50, Z = 35) */}
      <RigidBody type="fixed" colliders={false} position={[50, 4.8, 35]}>
        <CuboidCollider args={[8.0, 1.2, 8.0]} />
        <mesh receiveShadow castShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[16.0, 2.4, 16.0]} />
        </mesh>
      </RigidBody>

      {/* Paved Summit Vista Lookout Terrace (Walkable Summit Deck) */}
      <RigidBody type="fixed" colliders={false} position={[50, 6.05, 35]}>
        <CuboidCollider args={[6.5, 0.1, 6.5]} />
        <mesh receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[13.0, 0.2, 13.0]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 4. NATURAL PATHWAYS CONNECTING LANDMARKS                 */}
      {/* ======================================================== */}
      {/* Path 1: Transfer Area (0, 0) to Coral Bay Village (35, -20) */}
      <mesh position={[18, 0.47, -10]} rotation={[-Math.PI / 2, 0, -0.55]} receiveShadow>
        <planeGeometry args={[4.2, 42.0]} />
        <meshStandardMaterial color="#e2d9cd" roughness={0.9} />
      </mesh>

      {/* Path 2: Transfer Area (0, 0) to Turquoise Beach (-25, 20) */}
      <mesh position={[-14, 0.47, 10]} rotation={[-Math.PI / 2, 0, 0.65]} receiveShadow>
        <planeGeometry args={[4.0, 36.0]} />
        <meshStandardMaterial color="#e2d9cd" roughness={0.9} />
      </mesh>

      {/* Path 3: Village (35, -20) to Harbor (20, 40) */}
      <mesh position={[28, 0.47, 10]} rotation={[-Math.PI / 2, 0, -0.22]} receiveShadow>
        <planeGeometry args={[3.8, 55.0]} />
        <meshStandardMaterial color="#e2d9cd" roughness={0.9} />
      </mesh>

      {/* Path 4: Harbor (20, 40) to Viewpoint Ridge Ramp (42, 28) */}
      <mesh position={[31, 0.7, 34]} rotation={[-Math.PI / 2, 0, 0.9]} receiveShadow>
        <planeGeometry args={[3.5, 24.0]} />
        <meshStandardMaterial color="#d4a373" roughness={0.85} />
      </mesh>

      {/* ======================================================== */}
      {/* 5. OCEAN SHORELINE BOUNDARY BARRIERS (PREVENT DROWNING)  */}
      {/* ======================================================== */}
      {/* Invisible ocean barriers around the island perimeter to keep player on the island */}
      <RigidBody type="fixed" colliders={false} position={[0, 1.5, -62]}>
        <CuboidCollider args={[75.0, 3.0, 1.0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[0, 1.5, 62]}>
        <CuboidCollider args={[75.0, 3.0, 1.0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[-72, 1.5, 0]}>
        <CuboidCollider args={[1.0, 3.0, 65.0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[72, 1.5, 0]}>
        <CuboidCollider args={[1.0, 3.0, 65.0]} />
      </RigidBody>
    </group>
  );
}
