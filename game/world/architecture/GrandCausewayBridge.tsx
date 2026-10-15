"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { ambientAudioSystem } from "@/game/audio";
import { dayNightStore } from "@/game/dayNight";
import { discoveryStore } from "@/game/discovery";
import { InteractableTarget, interactionStore } from "@/game/interaction";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { BannersAndFlags } from "./BannersAndFlags";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { DhowBoat } from "./DhowBoat";
import { PillarModule } from "./PillarModule";
import { ToranaArch } from "./ToranaArch";

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

      {/* Western Entrance Ceremonial Torana Archway (x = 2.0) */}
      <ToranaArch
        position={[2.0, deckHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.05}
        hasBanners={true}
      />

      {/* Ancient Seafarers Guild Inscribed Basalt Stele at Bridge Approach */}
      <group position={[4.5, deckHeight, bridgeWidth / 2 - 1.2]}>
        <mesh position={[0, 0.6, 0]} castShadow material={SHARED_MATERIALS.deepSandstone}>
          <boxGeometry args={[0.7, 1.2, 0.45]} />
        </mesh>
        {/* Carved Gold Epigraph Plaque */}
        <mesh position={[0, 0.65, -0.23]} material={SHARED_MATERIALS.goldOrnament}>
          <planeGeometry args={[0.5, 0.7]} />
        </mesh>
        {/* Brass Diya Vessel on Stele Pedestal */}
        <mesh position={[0, 1.25, 0]} material={SHARED_MATERIALS.goldOrnament}>
          <cylinderGeometry args={[0.12, 0.08, 0.14, 8]} />
        </mesh>
        <mesh position={[0, 1.34, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>

        <InteractableTarget
          id="causeway-seafarer-stele"
          name="SEAFARER GUILD STELE"
          type="READ"
          promptLabel="READ SEAFARERS STELE"
          position={[0, 0.8, 0]}
          range={3.6}
          priority={8}
          chunkKey="0,0"
          action={() => {
            ambientAudioSystem.playDiscoveryChime();
            interactionStore.openReadable({
              title: "CHRONICLE OF THE OCEAN CAUSEWAY",
              subtitle: "Royal Epigraph of the Marthanda Guild",
              location: "Western Causeway Approach",
              content:
                "Carved upon weathered basalt in ancient Grantha script:\n\n" +
                "'Let this stone artery withstand the fury of the southwest monsoon. Built by the guilds of master stonemasons and pearl divers to bind the sacred mainland of Varanaya to the Outer Ocean Sanctuary.\n\n" +
                "May every traveler who walks above these turquoise depths remember that the sea belongs to those who revere her calm and respect her tempest.'",
            });
          }}
        >
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} />
          </mesh>
        </InteractableTarget>
      </group>

      {/* Craggy Coastal Sea Reef Rocks Rising Beside Pylons */}
      {[
        { px: 20, z: -bridgeWidth / 2 - 4.5, scale: 2.2 },
        { px: 60, z: bridgeWidth / 2 + 5.2, scale: 2.8 },
        { px: 100, z: -bridgeWidth / 2 - 4.8, scale: 2.4 },
        { px: 130, z: bridgeWidth / 2 + 6.0, scale: 3.2 },
      ].map((rock, ri) => (
        <group key={`sea-rock-${ri}`} position={[rock.px, -0.4, rock.z]}>
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.deepSandstone}>
            <dodecahedronGeometry args={[rock.scale, 1]} />
          </mesh>
          {/* Breaking Shoreline Sea Foam Ring */}
          <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[rock.scale * 0.9, rock.scale * 1.35, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

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

        {/* North Belvedere Panoramic Lagoon Lookout */}
        <InteractableTarget
          id="causeway-belvedere-lookout"
          name="BELVEDERE OCEAN LOOKOUT"
          type="READ"
          promptLabel="SURVEY AZURE LAGOON"
          position={[0, 0.8, -bridgeWidth / 2 - 2.5]}
          range={4.0}
          priority={8}
          chunkKey="0,0"
          action={() => {
            ambientAudioSystem.playDiscoveryChime();
            discoveryStore.discoverById("grand-causeway-bridge");
            interactionStore.openReadable({
              title: "AZURE LAGOON PANORAMA",
              subtitle: "Mid-Span Ocean Lookout",
              location: "North Belvedere Balcony",
              content:
                "From this elevated vantage point midway between the mainland and the outer sea, the full majesty of Varanaya is revealed.\n\n" +
                "To the West, the golden spires of the Grand Sanctuary and the palace district rise above the palm canopy. Below the bridge pylons, cruising dhows and outrigger catamarans navigate the glistening coastal currents.",
            });
          }}
        >
          <group position={[0, 0.4, -bridgeWidth / 2 - 2.5]}>
            <mesh castShadow material={SHARED_MATERIALS.warmSandstone}>
              <cylinderGeometry args={[0.3, 0.35, 0.85, 8]} />
            </mesh>
            <mesh position={[0, 0.5, 0]} material={SHARED_MATERIALS.goldOrnament}>
              <sphereGeometry args={[0.14, 8, 8]} />
            </mesh>
          </group>
        </InteractableTarget>

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

        {/* South Belvedere Carved Sandstone Resting Bench */}
        <group position={[0, 0, bridgeWidth / 2 + 2.5]}>
          <RigidBody type="fixed" colliders={false} position={[0, 0.28, 0]}>
            <CuboidCollider args={[1.5, 0.28, 0.45]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[3.0, 0.56, 0.9]} />
            </mesh>
          </RigidBody>
          {/* Bench Backrest */}
          <mesh position={[0, 0.85, 0.35]} castShadow material={SHARED_MATERIALS.carvedStone}>
            <boxGeometry args={[3.0, 0.6, 0.18]} />
          </mesh>

          <InteractableTarget
            id="bench-causeway-belvedere"
            name="CAUSEWAY BELVEDERE BENCH"
            type="USE"
            promptLabel="REST ON CAUSEWAY BENCH"
            position={[0, 0.6, 0]}
            range={3.6}
            priority={7}
            chunkKey="0,0"
            action={() => {
              dayNightStore.advanceHours(3);
              ambientAudioSystem.playDiscoveryChime();
              interactionStore.openReadable({
                title: "BELVEDERE OCEAN RESPITE",
                subtitle: "Contemplation Above Azure Bay",
                location: "Mid-Span Belvedere Balcony",
                content:
                  "You rest upon the cool sandstone bench of the mid-span pavilion.\n\n" +
                  "Hours pass peacefully as the sun sweeps across the coastal sky. The turquoise water beneath the arches shifts in hue, and the cooling maritime breeze rejuvenates your spirit.",
              });
            }}
          >
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} />
            </mesh>
          </InteractableTarget>
        </group>
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

        {/* Promontory Horizon Vista Stone & Discovery Point */}
        <group position={[10.0, deckHeight, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow material={SHARED_MATERIALS.buildingWhite}>
            <cylinderGeometry args={[0.4, 0.5, 1.0, 8]} />
          </mesh>
          <mesh position={[0, 1.08, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <octahedronGeometry args={[0.18, 0]} />
          </mesh>

          <InteractableTarget
            id="causeway-outer-vista"
            name="OUTER HORIZON PROMONTORY"
            type="READ"
            promptLabel="CONTEMPLATE OCEAN HORIZON"
            position={[0, 0.8, 0]}
            range={4.2}
            priority={9}
            chunkKey="0,0"
            action={() => {
              ambientAudioSystem.playSeafarerConch();
              ambientAudioSystem.playDiscoveryChime();
              discoveryStore.discoverById("outer-island-sanctuary");
              interactionStore.openReadable({
                title: "OUTER ISLAND SANCTUARY",
                subtitle: "Threshold of the Boundless Ocean",
                location: "Easternmost Promontory Terrace",
                content:
                  "Standing on the sacred ivory terrace at the very edge of the world, nothing lies between you and the endless expanse of the Indian Ocean.\n\n" +
                  "Fluttering saffron silk banners snap in the offshore gale. A deep, resonant sea conch echoes across the waters, sealing your discovery of the Outer Island Sanctuary.",
              });
            }}
          >
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.2} />
            </mesh>
          </InteractableTarget>
        </group>
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
