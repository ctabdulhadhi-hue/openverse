"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { BannersAndFlags } from "./BannersAndFlags";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { DhowBoat } from "./DhowBoat";
import { PillarModule } from "./PillarModule";

export interface GrandCausewayBridgeProps {
  position?: [number, number, number];
}

/**
 * Grand Causeway Bridge of Varanaya (Ceremonial Ocean Bridge).
 *
 * A massive, 120-meter long stone causeway connecting the royal waterfront
 * to the outer island sanctuary.
 * Features:
 * - Wide traversable stone deck with solid Rapier collider
 * - Submerged monumental stone pylon arches rising from the turquoise ocean
 * - Ornate carved balustrades preventing falling, with periodic lantern pillars
 * - Fluttering royal silk banners and golden finials
 * - Mid-span octagonal ceremonial belvedere pavilion
 * - Moored sailing dhow boats in the turquoise waters below
 * - Spectacular views of the open ocean on both sides and city skyline
 */
export function GrandCausewayBridge({ position = [45, 0, 30] }: GrandCausewayBridgeProps) {
  const bridgeLength = 120.0;
  const bridgeWidth = 9.0;
  const deckHeight = 2.2;
  const pylonSpacing = 20.0;
  const numPylons = Math.floor(bridgeLength / pylonSpacing);

  return (
    <group position={position} name="grand-causeway-bridge">
      {/* ======================================================== */}
      {/* 1. TRAVERSABLE BRIDGE DECK (Continuous RigidBody Collider)*/}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[bridgeLength / 2, deckHeight - 0.2, 0]}>
        <CuboidCollider args={[bridgeLength / 2, 0.2, bridgeWidth / 2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.plazaCobble}>
          <boxGeometry args={[bridgeLength, 0.4, bridgeWidth]} />
        </mesh>
      </RigidBody>

      {/* Decorative Gold & Sandstone Central Inlay Band along Deck */}
      <mesh
        position={[bridgeLength / 2, deckHeight + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.warmSandstone}
      >
        <planeGeometry args={[bridgeLength, 1.8]} />
      </mesh>

      {/* Flagstone Border Trim on Bridge Margins */}
      <mesh
        position={[bridgeLength / 2, deckHeight + 0.025, -bridgeWidth / 2 + 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.warmSandstone}
      >
        <planeGeometry args={[bridgeLength, 0.8]} />
      </mesh>
      <mesh
        position={[bridgeLength / 2, deckHeight + 0.025, bridgeWidth / 2 - 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.warmSandstone}
      >
        <planeGeometry args={[bridgeLength, 0.8]} />
      </mesh>

      {/* Ceremonial Gold Mandala Inlay Discs every 15m along bridge deck */}
      {Array.from({ length: 8 }).map((_, mi) => (
        <mesh
          key={`mandala-${mi}`}
          position={[12 + mi * 14, deckHeight + 0.03, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <ringGeometry args={[0.6, 0.9, 24]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#b45309"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 2. SUBMERGED STONE ARCH PYLONS IN TURQUOISE OCEAN        */}
      {/* ======================================================== */}
      {Array.from({ length: numPylons + 1 }).map((_, i) => {
        const px = i * pylonSpacing;
        return (
          <group key={`pylon-${i}`} position={[px, 0, 0]}>
            {/* Deep foundation pylon extending into water */}
            <mesh
              position={[0, deckHeight / 2 - 0.8, 0]}
              castShadow
              material={SHARED_MATERIALS.deepSandstone}
            >
              <boxGeometry args={[4.2, deckHeight + 1.6, bridgeWidth + 2.0]} />
            </mesh>
            {/* Cutwater Pointed Piers facing incoming waves */}
            <mesh
              position={[0, deckHeight / 2 - 0.8, bridgeWidth / 2 + 1.2]}
              castShadow
              material={SHARED_MATERIALS.deepSandstone}
            >
              <cylinderGeometry args={[0.2, 1.4, deckHeight + 1.6, 4]} />
            </mesh>
            <mesh
              position={[0, deckHeight / 2 - 0.8, -bridgeWidth / 2 - 1.2]}
              castShadow
              material={SHARED_MATERIALS.deepSandstone}
            >
              <cylinderGeometry args={[0.2, 1.4, deckHeight + 1.6, 4]} />
            </mesh>
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 3. CARVED STONE BALUSTRADES & LANTERN PILLARS             */}
      {/* ======================================================== */}
      {/* North Edge Balustrade (Z = -bridgeWidth / 2) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[bridgeLength / 2, deckHeight + 0.5, -bridgeWidth / 2]}
      >
        <CuboidCollider args={[bridgeLength / 2, 0.5, 0.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
          <boxGeometry args={[bridgeLength, 1.0, 0.4]} />
        </mesh>
      </RigidBody>

      {/* South Edge Balustrade (Z = bridgeWidth / 2) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[bridgeLength / 2, deckHeight + 0.5, bridgeWidth / 2]}
      >
        <CuboidCollider args={[bridgeLength / 2, 0.5, 0.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
          <boxGeometry args={[bridgeLength, 1.0, 0.4]} />
        </mesh>
      </RigidBody>

      {/* Repeated Pillar Lanterns & Banners along Railings */}
      {Array.from({ length: 9 }).map((_, i) => {
        const lx = 6 + i * 13.5;
        const isAlternate = i % 2 === 0;

        return (
          <group key={`lantern-pair-${i}`}>
            {/* North Lantern */}
            <group position={[lx, deckHeight, -bridgeWidth / 2 - 0.2]}>
              <PillarModule height={3.2} radius={0.25} materialColor="sandstone" />
              {/* Lantern Glow Sphere */}
              <mesh position={[0, 3.4, 0]}>
                <sphereGeometry args={[0.28, 12, 12]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.2} />
              </mesh>
              {/* Banners on every other pylon */}
              {isAlternate && (
                <BannersAndFlags
                  position={[0, 3.4, 0]}
                  height={5.0}
                  color={i % 4 === 0 ? "saffron" : "blue"}
                  scale={0.8}
                />
              )}
            </group>

            {/* South Lantern */}
            <group position={[lx, deckHeight, bridgeWidth / 2 + 0.2]}>
              <PillarModule height={3.2} radius={0.25} materialColor="sandstone" />
              <mesh position={[0, 3.4, 0]}>
                <sphereGeometry args={[0.28, 12, 12]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.2} />
              </mesh>
              {!isAlternate && (
                <BannersAndFlags
                  position={[0, 3.4, 0]}
                  height={5.0}
                  color={i % 4 === 1 ? "saffron" : "gold"}
                  scale={0.8}
                />
              )}
            </group>
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 4. MID-SPAN CEREMONIAL BELVEDERE PLATFORM                */}
      {/* ======================================================== */}
      <group position={[bridgeLength / 2, deckHeight, 0]}>
        {/* Outward Flaring Platform Balcony North */}
        <RigidBody type="fixed" colliders={false} position={[0, -0.2, -bridgeWidth / 2 - 2.5]}>
          <CuboidCollider args={[4.5, 0.2, 2.5]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <cylinderGeometry args={[5.0, 5.2, 0.4, 8]} />
          </mesh>
        </RigidBody>
        <ChhatriPavilion
          position={[0, 0, -bridgeWidth / 2 - 2.5]}
          scale={0.9}
          materialType="sandstone"
        />

        {/* Outward Flaring Platform Balcony South */}
        <RigidBody type="fixed" colliders={false} position={[0, -0.2, bridgeWidth / 2 + 2.5]}>
          <CuboidCollider args={[4.5, 0.2, 2.5]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <cylinderGeometry args={[5.0, 5.2, 0.4, 8]} />
          </mesh>
        </RigidBody>
        <ChhatriPavilion
          position={[0, 0, bridgeWidth / 2 + 2.5]}
          scale={0.9}
          materialType="sandstone"
        />
      </group>

      {/* ======================================================== */}
      {/* 5. OUTER ISLAND TERMINUS PLATFORM & SANCTUARY (At x=120) */}
      {/* ======================================================== */}
      <group position={[bridgeLength + 12, 0, 0]}>
        {/* Island Foundation Terrace */}
        <RigidBody type="fixed" colliders={false} position={[0, deckHeight / 2, 0]}>
          <CuboidCollider args={[14, deckHeight / 2, 14]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <cylinderGeometry args={[20, 22, deckHeight, 16]} />
          </mesh>
        </RigidBody>

        {/* Island Royal Chhatri Pavilion */}
        <ChhatriPavilion position={[0, deckHeight, 0]} scale={1.8} materialType="ivory" />

        {/* Outer Flagstaffs */}
        <BannersAndFlags position={[-6, deckHeight, -6]} height={8} color="saffron" />
        <BannersAndFlags position={[6, deckHeight, -6]} height={8} color="blue" />
        <BannersAndFlags position={[-6, deckHeight, 6]} height={8} color="blue" />
        <BannersAndFlags position={[6, deckHeight, 6]} height={8} color="gold" />
      </group>

      {/* ======================================================== */}
      {/* 6. DHOW SAILING BOATS FLOATING IN TURQUOISE WATER        */}
      {/* ======================================================== */}
      <DhowBoat position={[25, 0.1, -24]} rotation={[0, 0.4, 0]} scale={1.1} sailColor="ivory" />
      <DhowBoat position={[65, 0.1, 26]} rotation={[0, -0.6, 0]} scale={1.2} sailColor="saffron" />
      <DhowBoat position={[105, 0.1, -24]} rotation={[0, 0.8, 0]} scale={1.0} sailColor="blue" />
    </group>
  );
}
