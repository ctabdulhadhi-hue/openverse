"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type * as THREE from "three";

import { WestportNPCs } from "@/game/npcs";

import { IslandAirport } from "../airport/IslandAirport";
import {
  AmbientBirds,
  GrandCausewayBridge,
  GrandSanctuary,
  GrandSeaGate,
  PalaceGardens,
  PalmTree,
  PillarModule,
  ToranaArch,
  VaranayaPalace,
  WaterfrontHarbor,
} from "../architecture";
import { OutpostDoor, TownKiosk, TownSign } from "../interactables";
import { ClockTower } from "../landmarks/ClockTower";
import { SHARED_MATERIALS } from "../WorldMaterials";

export interface TownRegionProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * Varanaya Royal Promenade & Waterfront City Center (Phase 8.5 World Reconstruction).
 *
 * The primary settlement and player spawn location [0, 1.2, 8].
 * Replaces the prototype gray structures with an authentic, monumental coastal civilization:
 * - Central Royal Promenade with sandstone & ivory paving, gold mandala inlay, and carved pillars
 * - Hero Landmark: Colossal Grand Sanctuary (62m shikhara spire, corner chhatris, monumental stairs)
 * - Monumental Grand Sea Gate (twin bastion towers, golden domes, open traversable arch)
 * - 120-meter Grand Causeway Bridge spanning across the turquoise ocean to an outer island
 * - Vibrant Royal Waterfront Harbor (quay promenade, ghat steps descending to water, piers, dhow boats)
 * - Multi-tiered Palatial havelis, colonnades, and jharokha balconies
 * - Royal terrace gardens with lotus fountains, marigolds, palm trees, and peacocks
 * - Ambient soaring seagulls and fluttering silk banners
 * - Fully preserves Phase 6 interactables (Sign, Kiosk, Door) and Phase 7/8 NPCs
 */
export function TownRegion({ playerPosRef }: TownRegionProps = {}) {
  return (
    <group name="varanaya-town-region">
      {/* 1. Westport Living NPC Population (Phase 7 & 8) */}
      <WestportNPCs playerPosRef={playerPosRef} />

      {/* 2. Ambient Coastal Birds Circling High Above Harbor & Bay */}
      <AmbientBirds center={[18, 42, -5]} radius={52} birdCount={9} />

      {/* ======================================================== */}
      {/* 3. CENTRAL ROYAL PROMENADE PLAZA (Player Spawns: [0, 1.2, 8])*/}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Plaza Paving Foundation (Walkable Solid Floor) */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.05, 0]}>
          <CuboidCollider args={[24, 0.05, 24]} />
          <mesh receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <cylinderGeometry args={[28, 28.5, 0.1, 48]} />
          </mesh>
        </RigidBody>

        {/* Polished Ivory Inner Medallion */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[8, 12, 36]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Ceremonial Gold Mandala Inlay */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[4.2, 4.8, 36]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#b45309"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* ======================================================== */}
        {/* Phase 6 Interactive World Objects (Exact coordinates preserved) */}
        {/* ======================================================== */}
        {/* A. Royal Welcome Stele: front-left of spawn */}
        <TownSign position={[-3.5, 0, 3.5]} rotation={[0, 0.15, 0]} chunkKey="0,0" />

        {/* B. Civic Proclamation Kiosk: front-right of spawn */}
        <TownKiosk position={[4.5, 0, 4.0]} rotation={[0, -0.25, 0]} chunkKey="0,0" />

        {/* C. Gatehouse Outpost Door: West entrance to the Grand Sea Gate */}
        <OutpostDoor position={[-16, 0, 0]} rotation={[0, Math.PI / 2, 0]} chunkKey="0,0" />

        {/* Ceremonial Torana Archway framing the North Avenue to Grand Sanctuary */}
        <ToranaArch position={[0, 0, -14]} width={9} height={8.5} scale={1.1} />

        {/* Historic Clock & Sundial Landmark Chamber */}
        <ClockTower />

        {/* Carved Stone Promenade Benches */}
        {[
          { pos: [14, 0.3, 14] as const, rot: [0, -Math.PI / 4, 0] as const },
          { pos: [-14, 0.3, 14] as const, rot: [0, Math.PI / 4, 0] as const },
          { pos: [15, 0.3, -10] as const, rot: [0, Math.PI / 4, 0] as const },
          { pos: [-15, 0.3, -10] as const, rot: [0, -Math.PI / 4, 0] as const },
        ].map((bench, i) => (
          <RigidBody
            key={`bench-${i}`}
            type="fixed"
            colliders={false}
            position={[bench.pos[0], bench.pos[1], bench.pos[2]]}
            rotation={[bench.rot[0], bench.rot[1], bench.rot[2]]}
          >
            <CuboidCollider args={[1.2, 0.3, 0.35]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
              <boxGeometry args={[2.4, 0.6, 0.7]} />
            </mesh>
          </RigidBody>
        ))}

        {/* Carved Stone Lantern Columns around Promenade */}
        {[
          [-17, 0, 15] as const,
          [17, 0, 15] as const,
          [-17, 0, -15] as const,
          [17, 0, -15] as const,
        ].map((lamp, i) => (
          <group key={`lamp-${i}`} position={[lamp[0], lamp[1], lamp[2]]}>
            <RigidBody type="fixed" colliders={false} position={[0, 2.0, 0]}>
              <CuboidCollider args={[0.3, 2.0, 0.3]} />
              <PillarModule height={4.2} radius={0.24} materialColor="sandstone" />
            </RigidBody>
            <mesh position={[0, 4.3, 0]}>
              <sphereGeometry args={[0.36, 12, 12]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={1.4}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Royal Palm Clusters Framing the Plaza */}
        <PalmTree position={[-16, 0, 22]} scale={1.05} />
        <PalmTree position={[16, 0, 22]} scale={1.0} />
        <PalmTree position={[-20, 0, -20]} scale={0.95} />
        <PalmTree position={[20, 0, -20]} scale={1.0} />

        {/* Royal Terrace Garden (Lotus fountain, peacocks, flower beds) at South-West */}
        <PalaceGardens position={[-12, 0, 18]} />
      </group>

      {/* ======================================================== */}
      {/* 4. HERO LANDMARK: GRAND CENTRAL SANCTUARY (North Horizon) */}
      {/* ======================================================== */}
      <GrandSanctuary position={[0, 0, -68]} />

      {/* ======================================================== */}
      {/* 5. MONUMENTAL GRAND SEA GATE (West Entrance)              */}
      {/* ======================================================== */}
      <GrandSeaGate position={[-28, 0, 2]} rotation={[0, 0, 0]} />

      {/* ======================================================== */}
      {/* 6. ROYAL WATERFRONT & HARBOR DISTRICT (East Side)         */}
      {/* ======================================================== */}
      <WaterfrontHarbor position={[28, 0, 4]} />

      {/* ======================================================== */}
      {/* 7. GRAND CAUSEWAY BRIDGE (Spanning Ocean to Outer Island) */}
      {/* ======================================================== */}
      <GrandCausewayBridge position={[44, 0, 16]} />

      {/* ======================================================== */}
      {/* 8. PALATIAL RESIDENCES & MERCHANT HAVELIS (Avenues)      */}
      {/* ======================================================== */}
      {/* East Market / Merchant Haveli Blocks */}
      <VaranayaPalace
        position={[42, 0, -32]}
        rotation={[0, -Math.PI / 2, 0]}
        width={18}
        height={15}
        depth={16}
        variant="merchant-haveli"
      />
      <VaranayaPalace
        position={[42, 0, 56]}
        rotation={[0, -Math.PI / 2, 0]}
        width={18}
        height={14}
        depth={16}
        variant="merchant-haveli"
      />

      {/* West Residential & Royal Havelis */}
      <VaranayaPalace
        position={[-44, 0, -32]}
        rotation={[0, Math.PI / 2, 0]}
        width={18}
        height={15}
        depth={16}
        variant="royal-palace"
      />
      <VaranayaPalace
        position={[-44, 0, 36]}
        rotation={[0, Math.PI / 2, 0]}
        width={18}
        height={14}
        depth={16}
        variant="royal-palace"
      />

      {/* Civic & Administrative Court Halls */}
      <VaranayaPalace
        position={[32, 0, -66]}
        rotation={[0, 0, 0]}
        width={20}
        height={16}
        depth={16}
        variant="temple-hall"
      />
      <VaranayaPalace
        position={[-32, 0, -66]}
        rotation={[0, 0, 0]}
        width={20}
        height={16}
        depth={16}
        variant="royal-palace"
      />

      {/* South Outer Gatehouse / Suburban Havelis */}
      <VaranayaPalace
        position={[-26, 0, 68]}
        rotation={[0, Math.PI, 0]}
        width={16}
        height={13}
        depth={14}
        variant="merchant-haveli"
      />
      <VaranayaPalace
        position={[26, 0, 68]}
        rotation={[0, Math.PI, 0]}
        width={16}
        height={13}
        depth={14}
        variant="merchant-haveli"
      />

      {/* 9. AGATTI ISLAND AERODROME & REGIONAL PASSENGER AIRLINER */}
      <IslandAirport />
    </group>
  );
}
