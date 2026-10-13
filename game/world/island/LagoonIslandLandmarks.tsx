"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { InteractableTarget } from "@/game/interaction/InteractionTarget";

import { travelStore } from "../travel/travelStore";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { LAGOON_ISLE_ORIGIN } from "./lagoonIslandData";

export interface LagoonIslandLandmarksProps {
  origin?: [number, number, number];
  onDiscoverLandmark?: (landmarkId: string) => void;
}

/**
 * Lagoon Island Distinctive Landmarks & Return Travel Point.
 *
 * Implements:
 * 1. Island Airstrip Transfer Shelter & Return Flight Departure Station ([E] Return to Airport)
 * 2. Emerald Ridge Viewpoint Observation Platform & Binoculars
 * 3. Turquoise Lagoon Beach Scenic Loungers & Discovery Stele
 * 4. Wayfinding Signposts directing players between landmarks
 */
export function LagoonIslandLandmarks({
  origin = LAGOON_ISLE_ORIGIN,
  onDiscoverLandmark,
}: LagoonIslandLandmarksProps) {
  const [ox, oy, oz] = origin;

  // Return journey handler
  const handleReturnFlight = () => {
    if (travelStore.getTelemetry().isTraveling) return;
    void travelStore.startFlight("ROUTE_LAGOON_TO_AGATTI");
  };

  return (
    <group position={[ox, oy, oz]} name="lagoon-island-landmarks">
      {/* ======================================================== */}
      {/* 1. ARRIVAL SHELTER & RETURN TRAVEL STATION ([0, 0, 0])    */}
      {/* ======================================================== */}
      <group position={[0, 0.4, 0]}>
        {/* Arrival Wooden Pavilion Platform */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.1, 0]}>
          <CuboidCollider args={[4.5, 0.1, 3.5]} />
          <mesh receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[9.0, 0.2, 7.0]} />
          </mesh>
        </RigidBody>

        {/* Shelter Roof & Pillars */}
        {[-3.8, 3.8].map((px) =>
          [-2.8, 2.8].map((pz) => (
            <mesh
              key={`arr-col-${px}-${pz}`}
              position={[px, 1.5, pz]}
              material={SHARED_MATERIALS.pierWood}
              castShadow
            >
              <cylinderGeometry args={[0.12, 0.14, 3.0, 8]} />
            </mesh>
          )),
        )}

        {/* Shaded Canopy Roof */}
        <mesh position={[0, 3.1, 0]} castShadow>
          <boxGeometry args={[9.6, 0.25, 7.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>

        {/* Return Flight Check-in Desk */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.65, -1.8]}>
          <CuboidCollider args={[1.6, 0.45, 0.5]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[3.2, 0.9, 1.0]} />
          </mesh>
        </RigidBody>

        {/* Flight Information Schedule Board */}
        <group position={[0, 1.8, -2.1]}>
          <mesh castShadow>
            <boxGeometry args={[2.6, 1.2, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Glowing Departure Text Surface */}
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[2.4, 1.0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Illuminated Orange Windsock Pole */}
        <group position={[-6.0, 0, -2.0]}>
          <mesh position={[0, 2.8, 0]} material={SHARED_MATERIALS.metalTrim}>
            <cylinderGeometry args={[0.05, 0.06, 5.6, 8]} />
          </mesh>
          <mesh position={[0.6, 5.4, 0]} rotation={[0, 0, -0.2 + Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.35, 1.4, 10, 1, true]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>
          <mesh position={[0, 5.8, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.8} />
          </mesh>
        </group>

        {/* INTERACTION: Return Flight to Agatti Aerodrome */}
        <InteractableTarget
          id="lagoon-return-flight"
          name="Return Flight to Agatti Aerodrome"
          type="TALK"
          promptLabel="[E] RETURN TO AGATTI AIRPORT (Flight LA-103)"
          position={[0, 1.2, -0.6]}
          range={3.2}
          priority={20}
          chunkKey="4,3"
          action={handleReturnFlight}
        >
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.3, 0.45, 16]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.5}
              transparent
              opacity={0.85}
            />
          </mesh>
        </InteractableTarget>

        {/* Wayfinding Landmark Guide Post */}
        <group position={[3.2, 0, 2.5]}>
          <mesh position={[0, 1.1, 0]} material={SHARED_MATERIALS.pierWood} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
          </mesh>
          {/* Sign Boards */}
          <mesh position={[0.4, 1.9, 0]} castShadow>
            <boxGeometry args={[1.1, 0.22, 0.04]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.7} />
          </mesh>
          <mesh position={[-0.4, 1.5, 0]} castShadow>
            <boxGeometry args={[1.1, 0.22, 0.04]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 2. EMERALD RIDGE VIEWPOINT SUMMIT ([50, 6.2, 35])        */}
      {/* ======================================================== */}
      <group position={[50, 6.15, 35]}>
        {/* Perimeter Safety Railing */}
        {[-3.0, 3.0].map((rx) => (
          <mesh key={`rail-x-${rx}`} position={[rx, 0.6, 0]} material={SHARED_MATERIALS.metalTrim}>
            <boxGeometry args={[0.06, 1.2, 6.0]} />
          </mesh>
        ))}
        {[-3.0, 3.0].map((rz) => (
          <mesh key={`rail-z-${rz}`} position={[0, 0.6, rz]} material={SHARED_MATERIALS.metalTrim}>
            <boxGeometry args={[6.0, 1.2, 0.06]} />
          </mesh>
        ))}

        {/* Panoramic Vista Binoculars Stand */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.7, -1.8]}>
          <CuboidCollider args={[0.2, 0.7, 0.2]} />
          {/* Pedestal */}
          <mesh castShadow material={SHARED_MATERIALS.metalTrim}>
            <cylinderGeometry args={[0.1, 0.14, 1.4, 10]} />
          </mesh>
          {/* Binoculars Optics Head */}
          <mesh position={[0, 0.75, 0]} rotation={[-0.15, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.22, 0.55]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
        </RigidBody>

        {/* Brass Landmark Stele Plaque */}
        <InteractableTarget
          id="lagoon-viewpoint-plaque"
          name="Emerald Ridge Viewpoint Plaque"
          type="READ"
          promptLabel="[E] INSPECT PANORAMA"
          position={[0, 1.2, 0]}
          range={3.0}
          priority={10}
          chunkKey="4,3"
          action={() => onDiscoverLandmark?.("lagoon-viewpoint")}
        >
          <mesh position={[0, 0.05, 0]}>
            <ringGeometry args={[0.5, 0.65, 16]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#eab308"
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </InteractableTarget>
      </group>

      {/* ======================================================== */}
      {/* 3. TURQUOISE LAGOON BEACH LOUNGERS ([-25, 0.4, 20])      */}
      {/* ======================================================== */}
      <group position={[-25, 0.45, 20]}>
        {/* Beach Parasol Umbrella */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.4, 0]} material={SHARED_MATERIALS.pierWood} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.8, 8]} />
          </mesh>
          <mesh position={[0, 2.7, 0]} castShadow>
            <coneGeometry args={[2.0, 0.8, 8]} />
            <meshStandardMaterial color="#0ea5e9" roughness={0.5} />
          </mesh>
        </group>

        {/* Wooden Sun Recliners */}
        {[-1.2, 1.2].map((lx, li) => (
          <RigidBody
            key={`recliner-${li}`}
            type="fixed"
            colliders={false}
            position={[lx, 0.25, 0.5]}
          >
            <CuboidCollider args={[0.4, 0.2, 1.0]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[0.8, 0.35, 2.0]} />
            </mesh>
          </RigidBody>
        ))}

        {/* Discovery Stele at Beach Shore */}
        <InteractableTarget
          id="lagoon-beach-inspect"
          name="Turquoise Lagoon Beach Discovery"
          type="READ"
          promptLabel="[E] INSPECT BEACH"
          position={[0, 0.6, 2.2]}
          range={2.8}
          priority={10}
          chunkKey="4,3"
          action={() => onDiscoverLandmark?.("lagoon-beach")}
        >
          <mesh position={[0, 0.05, 0]}>
            <ringGeometry args={[0.3, 0.45, 16]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0891b2"
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </InteractableTarget>
      </group>
    </group>
  );
}
