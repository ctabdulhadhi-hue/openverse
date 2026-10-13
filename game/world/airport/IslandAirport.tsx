"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { PalmTree } from "../architecture/PalmTree";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { AircraftModel } from "./AircraftModel";
import { IslandTerminal } from "./IslandTerminal";

export interface IslandAirportProps {
  position?: [number, number, number];
}

/**
 * Agatti Island Aerodrome (Complete Airport Island Region).
 * Inspired by Agatti Airport, Lakshadweep, India.
 *
 * A realistic-feeling, playable island airport featuring:
 * - Coastal runway (Runway 09/27) with threshold piano keys, numbers, centerline, edge lights
 * - Taxiway, turning areas, and Apron Stand 1
 * - Regional passenger terminal with check-in, lounge, departure board, and staff
 * - Interactive regional turboprop airliner with walkable passenger cabin interior
 * - Ground service vehicles, baggage carts, perimeter fencing, and illuminated windsock
 * - Tropical coral sand spit, palms, and shallow turquoise lagoon waters
 */
export function IslandAirport({ position = [0, 0, 0] }: IslandAirportProps) {
  // Runway geometry parameters
  const runwayStartX = 85.0;
  const runwayEndX = 195.0;
  const runwayLength = runwayEndX - runwayStartX; // 110m
  const runwayCenterX = (runwayStartX + runwayEndX) / 2; // 140m
  const runwayZ = 68.0;
  const runwayWidth = 12.0;

  return (
    <group position={position} name="agatti-island-aerodrome">
      {/* ======================================================== */}
      {/* 1. CORAL ISLAND ATOLL FOUNDATION & SANDBAR BASE           */}
      {/* ======================================================== */}
      {/* Island Sandbar Ground Slab (Walkable Terrain) */}
      <RigidBody type="fixed" colliders={false} position={[runwayCenterX, 0.05, 52]}>
        <CuboidCollider args={[62.0, 0.1, 26.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.beachSand}>
          <boxGeometry args={[124.0, 0.2, 52.0]} />
        </mesh>
      </RigidBody>

      {/* Shallow Lagoon Coral Reef Fringe Ring */}
      <mesh
        position={[runwayCenterX, 0.02, 52]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.beachSand}
      >
        <planeGeometry args={[136.0, 64.0]} />
      </mesh>

      {/* Connecting Coral Sandbar Walkway to Mainland (West toward Harbor/Dunes) */}
      <RigidBody type="fixed" colliders={false} position={[62, 0.08, 48]}>
        <CuboidCollider args={[18.0, 0.1, 4.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.beachSand}>
          <boxGeometry args={[36.0, 0.2, 8.0]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 2. COASTAL RUNWAY 09/27 (Solid Rapier Paved Deck)        */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[runwayCenterX, 0.22, runwayZ]}>
        <CuboidCollider args={[runwayLength / 2, 0.15, runwayWidth / 2]} />
        {/* Dark Paved Runway Asphalt */}
        <mesh receiveShadow material={SHARED_MATERIALS.roadAsphalt}>
          <boxGeometry args={[runwayLength, 0.3, runwayWidth]} />
        </mesh>
      </RigidBody>

      {/* White Runway Boundary Edge Strips */}
      <mesh position={[runwayCenterX, 0.38, runwayZ - runwayWidth / 2 + 0.4]} receiveShadow>
        <boxGeometry args={[runwayLength - 4, 0.02, 0.35]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[runwayCenterX, 0.38, runwayZ + runwayWidth / 2 - 0.4]} receiveShadow>
        <boxGeometry args={[runwayLength - 4, 0.02, 0.35]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Dashed White Runway Centerline */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`rwy-center-${i}`}
          position={[runwayStartX + 10 + i * 8, 0.385, runwayZ]}
          receiveShadow
        >
          <boxGeometry args={[4.5, 0.02, 0.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      ))}

      {/* Threshold 09 Piano Keys (West Threshold, X = 92) */}
      {[-4.0, -2.8, -1.6, -0.4, 0.8, 2.0, 3.2, 4.4].map((tz, i) => (
        <mesh key={`thresh09-${i}`} position={[runwayStartX + 6, 0.39, runwayZ + tz]} receiveShadow>
          <boxGeometry args={[6.0, 0.02, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      ))}

      {/* Threshold 27 Piano Keys (East Threshold, X = 188) */}
      {[-4.0, -2.8, -1.6, -0.4, 0.8, 2.0, 3.2, 4.4].map((tz, i) => (
        <mesh key={`thresh27-${i}`} position={[runwayEndX - 6, 0.39, runwayZ + tz]} receiveShadow>
          <boxGeometry args={[6.0, 0.02, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      ))}

      {/* Runway Designation Numbers */}
      {/* Number "09" at West end */}
      <group position={[runwayStartX + 14, 0.39, runwayZ]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>
      {/* Number "27" at East end */}
      <group position={[runwayEndX - 14, 0.39, runwayZ]}>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI]}>
          <planeGeometry args={[2.4, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* Elevated Runway Edge Lights along Both Sides */}
      {Array.from({ length: 9 }).map((_, i) => {
        const lx = runwayStartX + 4 + i * 12.5;
        return (
          <group key={`rlight-${i}`}>
            {/* North Edge Light */}
            <mesh position={[lx, 0.65, runwayZ - runwayWidth / 2 - 0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[lx, 0.95, runwayZ - runwayWidth / 2 - 0.4]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={1.8}
                roughness={0.2}
              />
            </mesh>

            {/* South Edge Light */}
            <mesh position={[lx, 0.65, runwayZ + runwayWidth / 2 + 0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[lx, 0.95, runwayZ + runwayWidth / 2 + 0.4]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={1.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 3. TAXIWAY & APRON PARKING STAND                         */}
      {/* ======================================================== */}
      {/* Taxiway Connector (X = 140, Z between 54 and 62) */}
      <RigidBody type="fixed" colliders={false} position={[140, 0.22, 59]}>
        <CuboidCollider args={[4.5, 0.15, 4.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.roadAsphalt}>
          <boxGeometry args={[9.0, 0.3, 8.0]} />
        </mesh>
      </RigidBody>
      {/* Yellow Taxiway Centerline */}
      <mesh position={[140, 0.385, 59]}>
        <boxGeometry args={[0.3, 0.02, 7.8]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>

      {/* Apron Parking Stand (X = 140, Z = 52) */}
      <RigidBody type="fixed" colliders={false} position={[140, 0.22, 52]}>
        <CuboidCollider args={[15.0, 0.15, 6.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[30.0, 0.3, 12.0]} />
        </mesh>
      </RigidBody>
      {/* Yellow Aircraft Parking Box on Apron */}
      <mesh position={[140, 0.385, 52]}>
        <boxGeometry args={[18.0, 0.02, 0.25]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>
      {/* Stand 1 Designation Mark */}
      <mesh position={[134, 0.39, 52]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.8, 16]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>

      {/* ======================================================== */}
      {/* 4. GROUND SERVICE VEHICLES & EQUIPMENT                   */}
      {/* ======================================================== */}
      {/* Baggage Tug Tractor (Parked at X = 152, Z = 50) */}
      <group position={[152, 0.4, 50]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[2.4, 0.9, 1.4]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        {/* Driver Cab */}
        <mesh position={[-0.4, 1.25, 0]} castShadow>
          <boxGeometry args={[1.0, 0.6, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Tires */}
        {[-0.8, 0.8].map((tx) =>
          [-0.7, 0.7].map((tz) => (
            <mesh
              key={`tug-t-${tx}-${tz}`}
              position={[tx, 0.28, tz]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.28, 0.28, 0.2, 10]} />
              <meshStandardMaterial color="#1c1917" roughness={0.9} />
            </mesh>
          )),
        )}
      </group>

      {/* Towable Luggage Carts with Suitcases (Behind Tug) */}
      <group position={[155.5, 0.4, 50.8]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2.2, 0.4, 1.3]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Suitcases on cart */}
        <mesh position={[-0.4, 0.75, 0.1]} castShadow>
          <boxGeometry args={[0.7, 0.3, 0.5]} />
          <meshStandardMaterial color="#ea580c" roughness={0.7} />
        </mesh>
        <mesh position={[0.4, 0.75, -0.1]} castShadow>
          <boxGeometry args={[0.7, 0.3, 0.5]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
      </group>

      {/* Ground Power Unit (GPU) Cart beside Stand */}
      <group position={[132, 0.4, 49.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 0.8, 1.0]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
        {/* Cable Reel */}
        <mesh position={[0, 0.5, 0.55]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 10]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </group>

      {/* Illuminated Airport Windsock Pole */}
      <group position={[112, 0.4, 58]}>
        <mesh position={[0, 3.2, 0]} material={SHARED_MATERIALS.metalTrim}>
          <cylinderGeometry args={[0.06, 0.08, 6.4, 8]} />
        </mesh>
        {/* Swiveling Orange/White Striped Windsock Cone */}
        <group position={[0.4, 6.2, 0]} rotation={[0, 0, -0.25]}>
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.45, 1.8, 12, 1, true]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>
          {/* White Stripe */}
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.36, 0.6, 12, 1, true]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>
        </group>
        {/* Top Warning Light */}
        <mesh position={[0, 6.6, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* PAPI Approach Path Indicator Box (Threshold 09) */}
      <group position={[92, 0.4, 60]}>
        {[-0.6, -0.2, 0.2, 0.6].map((px, pi) => (
          <group key={`papi-${pi}`} position={[px, 0.2, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.25, 0.25, 0.3]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.15, -0.16]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color={pi < 2 ? "#ef4444" : "#ffffff"}
                emissive={pi < 2 ? "#dc2626" : "#f8fafc"}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Airport Perimeter Security Fence along Northern Edge */}
      <group position={[runwayCenterX, 0.4, 26]}>
        {Array.from({ length: 13 }).map((_, i) => (
          <mesh
            key={`fence-post-${i}`}
            position={[-50 + i * 8.3, 1.0, 0]}
            material={SHARED_MATERIALS.metalTrim}
          >
            <cylinderGeometry args={[0.035, 0.035, 2.0, 6]} />
          </mesh>
        ))}
        {/* Fence Wire Rail */}
        <mesh position={[0, 1.8, 0]} material={SHARED_MATERIALS.metalTrim}>
          <boxGeometry args={[100.0, 0.05, 0.05]} />
        </mesh>
        <mesh position={[0, 0.8, 0]} material={SHARED_MATERIALS.metalTrim}>
          <boxGeometry args={[100.0, 0.05, 0.05]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. TROPICAL ISLAND VEGETATION & COCONUT PALMS             */}
      {/* ======================================================== */}
      <PalmTree position={[120, 0.2, 32]} scale={1.1} />
      <PalmTree position={[160, 0.2, 32]} scale={1.05} />
      <PalmTree position={[114, 0.2, 45]} scale={0.95} />
      <PalmTree position={[168, 0.2, 44]} scale={1.0} />
      <PalmTree position={[88, 0.2, 54]} scale={0.9} />
      <PalmTree position={[192, 0.2, 54]} scale={1.0} />

      {/* ======================================================== */}
      {/* 6. PASSENGER TERMINAL & REGIONAL PASSENGER AIRLINER      */}
      {/* ======================================================== */}
      {/* Passenger Terminal Building at Apron Edge */}
      <IslandTerminal position={[140, 0, 36]} />

      {/* Regional Passenger Turboprop Airliner at Apron Stand 1 */}
      <AircraftModel basePosition={[140, 0.4, 52]} />
    </group>
  );
}
