"use client";

import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import type * as THREE from "three";

import { ambientAudioSystem } from "@/game/audio";
import { InteractableTarget, interactionStore } from "@/game/interaction";
import { missionManager } from "@/game/missions/MissionManager";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { CatamaranBoat } from "./CatamaranBoat";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { DhowBoat } from "./DhowBoat";
import { GhatSteps } from "./GhatSteps";

export interface WaterfrontHarborProps {
  position?: [number, number, number];
}

/**
 * Cruising Dhow that gently traverses the coastal waters.
 */
function CruisingDhow() {
  const boatRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!boatRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth scenic cruising loop across open bay waters (X ~ 50-65, Z ~ -50 to +60)
    const z = Math.sin(t * 0.05) * 55 + 5;
    const x = 52 + Math.cos(t * 0.05) * 8;
    const heading = Math.cos(t * 0.05) >= 0 ? -Math.PI / 2 : Math.PI / 2;

    boatRef.current.position.set(x, 0.1, z);
    boatRef.current.rotation.y = heading;
  });

  return (
    <group ref={boatRef} name="cruising-dhow">
      <DhowBoat position={[0, 0, 0]} scale={1.25} sailColor="saffron" />
    </group>
  );
}

/**
 * Royal Waterfront Promenade and Merchant Harbor of Varanaya.
 *
 * Dense, vibrant waterfront maritime district.
 * Features:
 * - Elevated stone quay promenade with carved balustrades
 * - Broad monumental Ghat steps descending directly into the turquoise ocean
 * - Wooden docking piers extending out over the water with solid colliders
 * - Moored sailing dhow boats with billowing sails and cargo crates
 * - Merchant stalls with colorful fabric awnings (saffron, indigo, ivory)
 * - Maritime harbor watchtower with golden chhatri dome
 */
export function WaterfrontHarbor({ position = [28, 0, 10] }: WaterfrontHarborProps) {
  return (
    <group position={position} name="waterfront-harbor">
      {/* ======================================================== */}
      {/* 1. ELEVATED QUAY PROMENADE (Stone Esplanade)             */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.7, 10]}>
        <CuboidCollider args={[8.0, 0.7, 35.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[16.0, 1.4, 70.0]} />
        </mesh>
      </RigidBody>

      {/* Decorative Paved Promenade Surface */}
      <mesh
        position={[0, 1.42, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.plazaCobble}
      >
        <planeGeometry args={[15.6, 69.6]} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. SACRED GHAT STEPS (Descending into the Water)         */}
      {/* ======================================================== */}
      {/* Ghat Flight 1 (Leading down to sea level) */}
      <GhatSteps
        position={[14.0, 0, -8]}
        rotation={[0, -Math.PI / 2, 0]}
        width={18}
        stepCount={8}
        stepDepth={1.0}
        stepHeight={0.2}
      />

      {/* Ghat Flight 2 (Second descent) */}
      <GhatSteps
        position={[14.0, 0, 26]}
        rotation={[0, -Math.PI / 2, 0]}
        width={18}
        stepCount={8}
        stepDepth={1.0}
        stepHeight={0.2}
      />

      {/* ======================================================== */}
      {/* 3. EXTENDING WOODEN MOORING PIERS (Walkable onto water)   */}
      {/* ======================================================== */}
      {/* Pier 1 (North Dock at Z = -16, X extending to +28) */}
      <group position={[14, 0.4, -20]}>
        <RigidBody type="fixed" colliders={false} position={[10, 0.2, 0]}>
          <CuboidCollider args={[10, 0.2, 2.0]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[20, 0.4, 4.0]} />
          </mesh>
        </RigidBody>
        {/* Support Pilings */}
        {[2, 7, 12, 17].map((px) => (
          <group key={px} position={[px, 0, 0]}>
            <mesh position={[0, -0.4, 1.8]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
            <mesh position={[0, -0.4, -1.8]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
          </group>
        ))}

        {/* Pier 1 Viewpoint Lookout */}
        <InteractableTarget
          id="harbor-pier-lookout"
          name="NORTH PIER LOOKOUT"
          type="READ"
          promptLabel="SURVEY AZURE BAY"
          position={[19, 0.8, 0]}
          range={4.0}
          priority={8}
          chunkKey="0,0"
          action={() => {
            ambientAudioSystem.playDiscoveryChime();
            interactionStore.openReadable({
              title: "AZURE BAY HARBOR LOOKOUT",
              subtitle: "Panoramic Ocean Vantage",
              location: "North Mooring Pier",
              content:
                "Standing at the furthest edge of the wooden pier, the open ocean unfolds before you. Traditional lateen-rigged dhows cut gently through the turquoise swells, their sails glowing warm in the sun.\n\n" +
                "To the Southeast, the monumental spans of the Grand Causeway Bridge stretch out across the azure lagoon toward the outer island sanctuary.",
            });
          }}
        >
          {/* Carved Lookout Post & Mooring Bollard */}
          <group position={[19, 0.4, 0]}>
            <mesh castShadow material={SHARED_MATERIALS.pierWood}>
              <cylinderGeometry args={[0.25, 0.3, 0.9, 8]} />
            </mesh>
            <mesh position={[0, 0.55, 0]} material={SHARED_MATERIALS.goldOrnament}>
              <sphereGeometry args={[0.16, 8, 8]} />
            </mesh>
          </group>
        </InteractableTarget>
      </group>

      {/* Pier 2 (South Dock at Z = 42, X extending to +30) */}
      <group position={[14, 0.4, 38]}>
        <RigidBody type="fixed" colliders={false} position={[11, 0.2, 0]}>
          <CuboidCollider args={[11, 0.2, 2.2]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[22, 0.4, 4.4]} />
          </mesh>
        </RigidBody>
        {[3, 9, 15, 20].map((px) => (
          <group key={px} position={[px, 0, 0]}>
            <mesh position={[0, -0.4, 2.0]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
            <mesh position={[0, -0.4, -2.0]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
          </group>
        ))}

        {/* Pier 2 Shoreline Angling Spot */}
        <InteractableTarget
          id="harbor-fishing-jetty"
          name="SOUTH PIER JETTY"
          type="READ"
          promptLabel="CAST FISHING LINE"
          position={[21, 0.8, 0]}
          range={4.0}
          priority={8}
          chunkKey="0,0"
          action={() => {
            ambientAudioSystem.playWaterSplash();
            ambientAudioSystem.playDiscoveryChime();
            interactionStore.openReadable({
              title: "COASTAL FISHING JETTY",
              subtitle: "Harbor Shoreline Angling",
              location: "South Mooring Pier",
              content:
                "You cast your line into the emerald-turquoise ocean. Gentle rhythmic waves lap against the salt-weathered timber pilings below.\n\n" +
                "Schools of silver pomfret and reef fish shimmer beneath the crystal-clear water surface. A tranquil maritime pause amidst the bustling city.",
            });
          }}
        >
          {/* Wooden Tackle Box & Angling Rod */}
          <group position={[21, 0.4, 0]}>
            <mesh castShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[0.5, 0.4, 0.6]} />
            </mesh>
            <mesh position={[0.2, 0.6, 0.4]} rotation={[0.6, 0, 0.4]}>
              <cylinderGeometry args={[0.02, 0.03, 2.2, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>
        </InteractableTarget>
      </group>

      {/* ======================================================== */}
      {/* 4. MOORED SHIPS, CATAMARANS & CRUISING BAY TRAFFIC       */}
      {/* ======================================================== */}
      <DhowBoat position={[28, 0.1, -26]} rotation={[0, -0.2, 0]} scale={1.15} sailColor="ivory" />
      <DhowBoat position={[30, 0.1, 46]} rotation={[0, 0.35, 0]} scale={1.2} sailColor="saffron" />
      <DhowBoat position={[36, 0.1, -12]} rotation={[0, 1.4, 0]} scale={1.05} sailColor="blue" />

      {/* Traditional Kettu-maram Outrigger Crafts */}
      <CatamaranBoat position={[22, 0.1, 14]} rotation={[0, 0.35, 0]} scale={1.1} sailColor="saffron" />
      <CatamaranBoat position={[25, 0.1, -34]} rotation={[0, -0.4, 0]} scale={0.95} sailColor="indigo" />

      {/* Cruising Dhow navigating the outer coastal waters */}
      <CruisingDhow />

      {/* Interactive Catamaran Inspection at South Dock Margin */}
      <InteractableTarget
        id="harbor-catamaran-craft"
        name="KETTU-MARAM OUTRIGGER"
        type="READ"
        promptLabel="EXAMINE KETTU-MARAM CRAFT"
        position={[20, 0.8, 14]}
        range={4.2}
        priority={8}
        chunkKey="0,0"
        action={() => {
          ambientAudioSystem.playWaterSplash();
          ambientAudioSystem.playDiscoveryChime();
          interactionStore.openReadable({
            title: "TRADITIONAL KETTU-MARAM CRAFT",
            subtitle: "Heritage of Malabar Lash-Timber Boatbuilding",
            location: "Azure Bay Mooring Basin",
            content:
              "Hand-hewn timber logs bound tightly with resilient coir cordage, preserved by coats of boiled fish oil and tree resin.\n\n" +
              "The outrigger boom (kollu-maram) acts as an oceanic stabilizer, allowing solitary fishermen to navigate reef shallows and heavy coastal surf with remarkable agility. A design honed across thousands of years of Arabian Sea seamanship.",
          });
        }}
      >
        <group position={[20, 0.4, 14]}>
          <mesh castShadow material={SHARED_MATERIALS.pierWood}>
            <cylinderGeometry args={[0.2, 0.25, 0.8, 8]} />
          </mesh>
          <mesh position={[0, 0.48, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <sphereGeometry args={[0.12, 8, 8]} />
          </mesh>
        </group>
      </InteractableTarget>

      {/* ======================================================== */}
      {/* 4B. DOCKSIDE FISH-DRYING RACKS & MARITIME CRAFT AREA     */}
      {/* ======================================================== */}
      <group position={[6.8, 1.4, 8.0]}>
        {/* Wooden Trestle Support Posts */}
        {[-1.8, 0, 1.8].map((tx) => (
          <group key={`trestle-${tx}`} position={[0, 0, tx]}>
            <mesh position={[-0.4, 0.75, 0]} material={SHARED_MATERIALS.pierWood}>
              <cylinderGeometry args={[0.04, 0.05, 1.5, 6]} />
            </mesh>
            <mesh position={[0.4, 0.75, 0]} material={SHARED_MATERIALS.pierWood}>
              <cylinderGeometry args={[0.04, 0.05, 1.5, 6]} />
            </mesh>
          </group>
        ))}
        {/* Horizontal Drying Rails */}
        <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[0.035, 0.035, 4.2, 6]} />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[0.035, 0.035, 4.2, 6]} />
        </mesh>

        {/* Woven Coir Net Drapery hanging from rails */}
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, 0.1]} material={SHARED_MATERIALS.deepSandstone}>
          <boxGeometry args={[0.04, 0.85, 3.8]} />
        </mesh>

        {/* Salt Curing Timber Barrels */}
        <mesh position={[-0.8, 0.45, -1.2]} castShadow material={SHARED_MATERIALS.pierWood}>
          <cylinderGeometry args={[0.35, 0.38, 0.9, 8]} />
        </mesh>
        <mesh position={[-0.8, 0.4, 1.4]} castShadow material={SHARED_MATERIALS.pierWood}>
          <cylinderGeometry args={[0.32, 0.35, 0.8, 8]} />
        </mesh>

        {/* Coiled Mooring Hawser on Quayside */}
        <mesh position={[0.7, 0.12, 0.6]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.35, 0.1, 6, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>

        {/* Interactive Coir Net Inspection */}
        <InteractableTarget
          id="harbor-dockside-nets"
          name="COIR FISHING NETS"
          type="READ"
          promptLabel="INSPECT COIR NETS"
          position={[0, 1.0, 0]}
          range={3.6}
          priority={7}
          chunkKey="0,0"
          action={() => {
            ambientAudioSystem.playDiscoveryChime();
            interactionStore.openReadable({
              title: "COCONUT FIBER NETS",
              subtitle: "Artisanal Weaving & Saltwater Preservation",
              location: "Harbor Drying Trestles",
              content:
                "Hand-spun fibers extracted from retting coconut husks, woven into pliable mesh and steeped in tannin-rich cashew resin to withstand the briny sea water.\n\n" +
                "Fishermen inspect and mend the mesh between tides, preparing for the dusk run when mackerel and kingfish follow the currents along the causeway reefs.",
            });
          }}
        >
          <mesh position={[0, 1.0, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} />
          </mesh>
        </InteractableTarget>
      </group>

      {/* Interactive Harbor Elder Lore Seat */}
      <group position={[6.5, 1.4, -6.0]}>
        <mesh position={[0, 0.3, 0]} castShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[1.2, 0.6, 1.8]} />
        </mesh>
        {/* Hanging Brass Lamp on Wooden Stanchion */}
        <mesh position={[-0.4, 1.2, 0]} material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[0.04, 0.05, 1.8, 6]} />
        </mesh>
        <mesh position={[-0.4, 2.1, 0.3]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.4} />
        </mesh>

        <InteractableTarget
          id="harbor-elder-story"
          name="HARBOR WATCHMAN'S BENCH"
          type="READ"
          promptLabel="LISTEN TO HARBOR TALE"
          position={[0, 0.8, 0]}
          range={3.8}
          priority={8}
          chunkKey="0,0"
          action={() => {
            ambientAudioSystem.playSeafarerConch();
            interactionStore.openReadable({
              title: "CHRONICLES OF THE MONSOON SEA",
              subtitle: "Recollections of the Waterfront Elder",
              location: "Harbor Watchman's Seat",
              content:
                "'When the golden hour settles over Azure Bay, you can hear the deep bell of the Grand Sanctuary answering the sea conch of incoming dhows,' the old watchman murmurs.\n\n" +
                "'For seven centuries, our sailors have steered by the Southern Cross and the beacon atop the causeway. Keep your eyes open as you cross toward the Outer Island; ancient stones tell tales that even the sea cannot wash away.'",
            });
          }}
        >
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} />
          </mesh>
        </InteractableTarget>
      </group>

      {/* ======================================================== */}
      {/* 5. HARBOR WATCHTOWER & LIGHT BEACON                      */}
      {/* ======================================================== */}
      <group position={[6.0, 1.4, -22]}>
        {/* Tower Body */}
        <RigidBody type="fixed" colliders={false} position={[0, 6.0, 0]}>
          <CuboidCollider args={[2.5, 6.0, 2.5]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <cylinderGeometry args={[2.4, 2.8, 12.0, 8]} />
          </mesh>
        </RigidBody>
        {/* Crowning Chhatri with Beacon Light */}
        <ChhatriPavilion position={[0, 12.0, 0]} scale={1.1} materialType="sandstone" />
        <mesh position={[0, 14.5, 0]}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>

        {/* Phase 10 Mission 3 Objective: Harbor Beacon Mechanism */}
        <InteractableTarget
          id="beacon-harbor-light"
          name="Harbor Beacon Mechanism"
          type="USE"
          promptLabel="[E] INSPECT HARBOR BEACON"
          position={[0, 1.0, 2.6]}
          range={4.5}
          priority={10}
          chunkKey="0,0"
          action={() => {
            missionManager.handleInteraction("beacon-harbor-light");
          }}
        >
          <mesh position={[0, 1.0, 2.6]} castShadow material={SHARED_MATERIALS.goldOrnament}>
            <cylinderGeometry args={[0.3, 0.4, 0.9, 8]} />
          </mesh>
          <mesh position={[0, 1.55, 2.6]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.5} />
          </mesh>
        </InteractableTarget>
      </group>

      {/* ======================================================== */}
      {/* 6. WATERFRONT MARKET STALLS & FABRIC CANOPIES            */}
      {/* ======================================================== */}
      {[
        { z: -2, col: SHARED_MATERIALS.bannerSaffron },
        { z: 6, col: SHARED_MATERIALS.bannerRoyalBlue },
        { z: 14, col: SHARED_MATERIALS.bannerGold },
        { z: 22, col: SHARED_MATERIALS.buildingWhite },
      ].map((stall, si) => (
        <group key={`stall-${si}`} position={[-2.5, 1.4, stall.z]}>
          {/* Stall Counter Table */}
          <RigidBody type="fixed" colliders={false} position={[0, 0.5, 0]}>
            <CuboidCollider args={[1.5, 0.5, 1.0]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[3.0, 1.0, 2.0]} />
            </mesh>
          </RigidBody>
          {/* Corner Awning Posts */}
          {[-1.3, 1.3].map((ax) =>
            [-0.8, 0.8].map((az) => (
              <mesh
                key={`${ax}-${az}`}
                position={[ax, 1.6, az]}
                material={SHARED_MATERIALS.treeTrunk}
              >
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
              </mesh>
            )),
          )}
          {/* Sloped Fabric Awning Canopy */}
          <mesh position={[0, 2.7, 0]} rotation={[0.15, 0, 0]} material={stall.col}>
            <boxGeometry args={[3.2, 0.08, 2.2]} />
          </mesh>

          {/* Hanging Brass Oil Lanterns from Awning Corners */}
          {[-1.25, 1.25].map((lx) => (
            <group key={`lantern-${lx}`} position={[lx, 2.35, 0.9]}>
              <mesh material={SHARED_MATERIALS.goldOrnament}>
                <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
              </mesh>
              <mesh position={[0, -0.15, 0]} material={SHARED_MATERIALS.warmSandstone}>
                <octahedronGeometry args={[0.1, 0]} />
              </mesh>
              <mesh position={[0, -0.15, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.5} />
              </mesh>
            </group>
          ))}

          {/* === BAZAAR GOODS: SPICE MOUNDS, AMPHORA JARS & TEXTILES === */}
          {/* 1. Mounded Powdered Spice Bowls on Counter */}
          <group position={[-0.8, 1.05, -0.2]}>
            {/* Wooden / Brass Bowl */}
            <mesh castShadow material={SHARED_MATERIALS.warmSandstone}>
              <cylinderGeometry args={[0.22, 0.14, 0.12, 12]} />
            </mesh>
            {/* Saffron / Turmeric Mound */}
            <mesh position={[0, 0.07, 0]}>
              <coneGeometry args={[0.2, 0.14, 12]} />
              <meshStandardMaterial color={si % 2 === 0 ? "#ea580c" : "#f59e0b"} roughness={0.9} />
            </mesh>
          </group>

          <group position={[-0.2, 1.05, -0.2]}>
            <mesh castShadow material={SHARED_MATERIALS.warmSandstone}>
              <cylinderGeometry args={[0.22, 0.14, 0.12, 12]} />
            </mesh>
            {/* Paprika / Indigo / Sumac Mound */}
            <mesh position={[0, 0.07, 0]}>
              <coneGeometry args={[0.2, 0.14, 12]} />
              <meshStandardMaterial color={si % 2 === 0 ? "#dc2626" : "#2563eb"} roughness={0.9} />
            </mesh>
          </group>

          {/* 2. Terracotta Amphora Oil / Wine Jug on Stall Flank */}
          <group position={[0.9, 1.05, 0.3]}>
            <mesh castShadow material={SHARED_MATERIALS.deepSandstone}>
              <cylinderGeometry args={[0.14, 0.18, 0.38, 10]} />
            </mesh>
            <mesh position={[0, 0.22, 0]} castShadow material={SHARED_MATERIALS.deepSandstone}>
              <cylinderGeometry args={[0.06, 0.09, 0.16, 10]} />
            </mesh>
          </group>

          {/* 3. Stacked Fabric / Silk Textile Bolts */}
          <group position={[0.7, 1.05, -0.3]}>
            <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.45, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.16, 0.04]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.055, 0.055, 0.42, 8]} />
              <meshStandardMaterial color="#ea580c" roughness={0.7} />
            </mesh>
          </group>

          {/* 4. Woven Grain / Almond Sacks on Ground beside Counter */}
          <group position={[-1.6, 0.3, 0.8]}>
            <mesh castShadow material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.28, 0.32, 0.55, 8]} />
            </mesh>
          </group>

          {/* 5. Woven Artisan Bazaar Carpet Runner in front of Stall */}
          <mesh position={[0, 0.02, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[2.8, 1.2]} />
            <meshStandardMaterial
              color={si % 2 === 0 ? "#7f1d1d" : "#1e3a8a"}
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>

          {/* Interactive Spice Tasting Table on Stall 0 */}
          {si === 0 && (
            <InteractableTarget
              id="spice-market-tasting"
              name="SPICE BAZAAR TABLE"
              type="READ"
              promptLabel="SAMPLE COASTAL SPICES"
              position={[0, 1.25, 0]}
              range={3.8}
              priority={7}
              chunkKey="0,0"
              action={() => {
                ambientAudioSystem.playDiscoveryChime();
                interactionStore.openReadable({
                  title: "VARANAYA SPICE BAZAAR",
                  subtitle: "Aromas of the Malabar Trade Routes",
                  location: "Royal Waterfront Merchant Stalls",
                  content:
                    "Heaping terracotta bowls of freshly ground golden turmeric, sun-dried Tellicherry black pepper, and crushed green cardamom fill the maritime air with intoxicating fragrance.\n\n" +
                    "A friendly merchant offers a sample: 'The ocean brings the trade winds, and the hills yield the black gold. Travelers from across the world come to these quays for the harvests of the Malabar coast.'",
                });
              }}
            >
              <mesh position={[0, 1.15, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} />
              </mesh>
            </InteractableTarget>
          )}

          {/* Phase 9 Mission Objective 3: Surveying Shipment Crate */}
          {si === 1 && (
            <InteractableTarget
              id="crate-waterfront-supplies"
              name="Surveying Shipment Crate"
              type="PICKUP"
              promptLabel="[E] TAKE SHIPMENT"
              position={[0, 1.25, 0]}
              range={4.0}
              priority={10}
              chunkKey="0,0"
              action={() => {
                missionManager.handleInteraction("crate-waterfront-supplies");
              }}
            >
              <mesh position={[0, 1.25, 0]} castShadow material={SHARED_MATERIALS.goldOrnament}>
                <boxGeometry args={[0.7, 0.5, 0.7]} />
              </mesh>
              {/* Golden Ribbon Accent */}
              <mesh position={[0, 1.55, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.2} />
              </mesh>
            </InteractableTarget>
          )}

          {/* Phase 10 Mission 2 Objective: Misplaced Trade Ledger Pouch */}
          {si === 3 && (
            <InteractableTarget
              id="clue-missing-ledger"
              name="Misplaced Ledger Pouch"
              type="PICKUP"
              promptLabel="[E] EXAMINE TRADE LEDGER"
              position={[0, 1.25, 0]}
              range={4.0}
              priority={10}
              chunkKey="0,0"
              action={() => {
                missionManager.handleInteraction("clue-missing-ledger");
              }}
            >
              <mesh position={[0, 1.25, 0]} castShadow material={SHARED_MATERIALS.pierWood}>
                <boxGeometry args={[0.55, 0.25, 0.4]} />
              </mesh>
              {/* Parchment roll accent */}
              <mesh position={[0, 1.42, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.45, 8]} />
                <meshStandardMaterial color="#fef3c7" emissive="#d97706" emissiveIntensity={0.8} />
              </mesh>
            </InteractableTarget>
          )}
        </group>
      ))}

      {/* Stacked Cargo Crates and Spice Urns */}
      {(
        [
          [-5.0, 1.4, -10],
          [-5.0, 1.4, 30],
          [8.0, 1.4, 34],
        ] as const
      ).map((cPos, ci) => (
        <group key={`cargo-${ci}`} position={[cPos[0], cPos[1], cPos[2]]}>
          <mesh position={[0, 0.45, 0]} castShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[1.2, 0.9, 1.2]} />
          </mesh>
          <mesh position={[0.7, 0.35, 0.4]} castShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
          </mesh>
          <mesh position={[-0.4, 0.5, 0.8]} castShadow material={SHARED_MATERIALS.deepSandstone}>
            <cylinderGeometry args={[0.35, 0.4, 1.0, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
