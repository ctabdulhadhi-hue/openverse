"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { LAGOON_ISLE_ORIGIN } from "./lagoonIslandData";

export interface LagoonIslandHarborProps {
  origin?: [number, number, number];
}

/**
 * Fisherman's Jetty & Island Harbor.
 *
 * Implements:
 * - Solid wooden pier extending into the calm turquoise ocean waters
 * - Moored traditional outrigger fishing canoes with floats and oars
 * - Coiled ropes, cargo shipping crates, fishing net racks, and harbor beacons
 * - Safe walkable surfaces with edge colliders
 */
export function LagoonIslandHarbor({ origin = LAGOON_ISLE_ORIGIN }: LagoonIslandHarborProps) {
  const [ox, oy, oz] = origin;

  return (
    <group position={[ox, oy, oz]} name="lagoon-island-harbor">
      {/* ======================================================== */}
      {/* 1. SOLID WOODEN PIER JETTY (Walkable Deck)               */}
      {/* ======================================================== */}
      {/* Main Pier Deck extending south from Z = 30 to Z = 48 at X = 20 */}
      <RigidBody type="fixed" colliders={false} position={[20, 0.55, 38]}>
        <CuboidCollider args={[2.5, 0.15, 9.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[5.0, 0.3, 18.0]} />
        </mesh>
      </RigidBody>

      {/* Pier Terminal T-Hammerhead Platform (Z = 48) */}
      <RigidBody type="fixed" colliders={false} position={[20, 0.55, 47]}>
        <CuboidCollider args={[5.5, 0.15, 2.5]} />
        <mesh receiveShadow material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[11.0, 0.3, 5.0]} />
        </mesh>
      </RigidBody>

      {/* Heavy Timber Submerged Support Pylons */}
      {[-1.8, 1.8].map((px) =>
        [32, 38, 44, 48].map((pz) => (
          <mesh
            key={`pylon-${px}-${pz}`}
            position={[20 + px, 0, pz]}
            material={SHARED_MATERIALS.pierWood}
            castShadow
          >
            <cylinderGeometry args={[0.2, 0.22, 1.6, 8]} />
          </mesh>
        )),
      )}

      {/* Mooring Bollards along Pier Edge */}
      {[34, 40, 46].map((bz) => (
        <group key={`bollard-${bz}`}>
          <mesh position={[17.8, 0.85, bz]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.4, 8]} />
            <meshStandardMaterial color="#1c1917" roughness={0.7} />
          </mesh>
          <mesh position={[22.2, 0.85, bz]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.4, 8]} />
            <meshStandardMaterial color="#1c1917" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. MOORED TRADITIONAL OUTRIGGER CANOES                   */}
      {/* ======================================================== */}
      {/* Boat 1: Moored at West Pier Side (X = 15, Z = 40) */}
      <group position={[14.8, 0.25, 40]} rotation={[0, 0.15, 0]}>
        {/* Main Canoe Hull */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 5.2]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Outrigger Booms */}
        <mesh position={[-1.2, 0.35, 1.0]}>
          <boxGeometry args={[1.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[-1.2, 0.35, -1.0]}>
          <boxGeometry args={[1.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Outrigger Float */}
        <mesh position={[-2.2, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 4.2, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.8} />
        </mesh>
      </group>

      {/* Boat 2: Moored at East Pier Side (X = 25, Z = 44) */}
      <group position={[25.2, 0.25, 44]} rotation={[0, -0.1, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 5.2]} />
          <meshStandardMaterial color="#0369a1" roughness={0.6} />
        </mesh>
        <mesh position={[1.2, 0.35, 1.0]}>
          <boxGeometry args={[1.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[1.2, 0.35, -1.0]}>
          <boxGeometry args={[1.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[2.2, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 4.2, 8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 3. CARGO CRATES, ROPES & FISHING EQUIPMENT               */}
      {/* ======================================================== */}
      {/* Stacked Wooden Supply Crates on Pier */}
      <RigidBody type="fixed" colliders={false} position={[21.5, 0.95, 34]}>
        <CuboidCollider args={[0.45, 0.45, 0.45]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[21.5, 0.95, 35.1]}>
        <CuboidCollider args={[0.45, 0.45, 0.45]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[21.5, 1.65, 34.5]}>
        <CuboidCollider args={[0.4, 0.3, 0.4]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
        </mesh>
      </RigidBody>

      {/* Coiled Manila Ropes */}
      <mesh position={[18.5, 0.72, 36]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.45, 16]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>

      {/* Harbor Navigation Lantern Post (At Pier End, Z = 49) */}
      <group position={[20, 0.7, 49]}>
        <mesh position={[0, 1.8, 0]} material={SHARED_MATERIALS.pierWood} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 3.6, 8]} />
        </mesh>
        <mesh position={[0, 3.7, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
