"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { ambientAudioSystem } from "@/game/audio";
import { InteractableTarget, interactionStore } from "@/game/interaction";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { BannersAndFlags } from "./BannersAndFlags";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { PillarModule } from "./PillarModule";
import { ShikharaSpire } from "./ShikharaSpire";

export interface GrandSanctuaryProps {
  position?: [number, number, number];
}

/**
 * Grand Central Sanctuary of Varanaya (Hero Landmark).
 *
 * The monumental crowning landmark of the civilization, towering over the skyline.
 * Features:
 * - Monumental stepped terrace plinth with traversable ceremonial staircase
 * - Multi-tiered sacred Shikhara tower reaching 62m into the sky
 * - Four corner royal Chhatri pavilions with polished golden kalasha finials
 * - Grand arched entrance mandapa with carved colonnade
 * - Enterable sacred Garbhagriha (Inner Sanctum) with consecrated lotus flame altar
 * - Fluttering saffron and royal blue ceremonial banners
 * - Solid Rapier colliders for plinths, stairs, and structural columns
 */
export function GrandSanctuary({ position = [0, 0, -65] }: GrandSanctuaryProps) {
  return (
    <group position={position} name="grand-sanctuary-hero-landmark">
      {/* ======================================================== */}
      {/* 1. MONUMENTAL STEPPED PLINTH FOUNDATION (Walkable)       */}
      {/* ======================================================== */}
      {/* Tier 1 Lower Podium (36m x 36m x 1.6m) */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.8, 0]}>
        <CuboidCollider args={[18, 0.8, 18]} />
        <mesh receiveShadow castShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[36, 1.6, 36]} />
        </mesh>
      </RigidBody>

      {/* Tier 2 Upper Podium (28m x 28m x 1.6m) at Y = 2.4 */}
      <RigidBody type="fixed" colliders={false} position={[0, 2.4, 0]}>
        <CuboidCollider args={[14, 0.8, 14]} />
        <mesh receiveShadow castShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[28, 1.6, 28]} />
        </mesh>
      </RigidBody>

      {/* Decorative Carved Frieze Molding on Podium */}
      <mesh position={[0, 3.25, 0]} material={SHARED_MATERIALS.carvedStone}>
        <boxGeometry args={[28.6, 0.2, 28.6]} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. CEREMONIAL ACCESS STAIRCASE (South Facing towards Spawn)*/}
      {/* ======================================================== */}
      {/* Stepped Ramp 1: Ground to Tier 1 - Incline Ramp Collider */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, 0.8, 19.5]}
        rotation={[-Math.atan2(1.6, 3.0), 0, 0]}
      >
        <CuboidCollider args={[5.0, 0.2, 1.7]} />
      </RigidBody>
      {[0, 1, 2, 3].map((step) => (
        <mesh
          key={`st1-${step}`}
          castShadow
          receiveShadow
          position={[0, 0.2 + step * 0.4, 18 + (3 - step) * 1.0]}
          material={SHARED_MATERIALS.warmSandstone}
        >
          <boxGeometry args={[10.0, 0.4, 1.2]} />
        </mesh>
      ))}

      {/* Stepped Ramp 2: Tier 1 to Tier 2 - Incline Ramp Collider */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, 2.4, 15.35]}
        rotation={[-Math.atan2(1.6, 2.7), 0, 0]}
      >
        <CuboidCollider args={[4.5, 0.2, 1.6]} />
      </RigidBody>
      {[0, 1, 2, 3].map((step) => (
        <mesh
          key={`st2-${step}`}
          castShadow
          receiveShadow
          position={[0, 1.8 + step * 0.4, 14 + (3 - step) * 0.9]}
          material={SHARED_MATERIALS.warmSandstone}
        >
          <boxGeometry args={[9.0, 0.4, 1.1]} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 3. FOUR CORNER ROYAL CHHATRI PAVILIONS                   */}
      {/* ======================================================== */}
      <ChhatriPavilion position={[-11, 3.2, -11]} scale={1.2} materialType="sandstone" />
      <ChhatriPavilion position={[11, 3.2, -11]} scale={1.2} materialType="sandstone" />
      <ChhatriPavilion position={[-11, 3.2, 11]} scale={1.2} materialType="sandstone" />
      <ChhatriPavilion position={[11, 3.2, 11]} scale={1.2} materialType="sandstone" />

      {/* ======================================================== */}
      {/* 4. ENTRANCE MANDAPA (Pillared Hall on South Side)        */}
      {/* ======================================================== */}
      <group position={[0, 3.2, 8]}>
        {/* Mandapa Roof Canopy with Solid Ceiling Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 6.4, 0]}>
          <CuboidCollider args={[6.5, 0.4, 5.0]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[13, 0.8, 10]} />
          </mesh>
        </RigidBody>
        <mesh position={[0, 7.2, 0]} castShadow material={SHARED_MATERIALS.templeTerracotta}>
          <coneGeometry args={[5.5, 2.2, 4]} />
        </mesh>

        {/* Mandapa Colonnade Pillars */}
        {[-4.8, -1.6, 1.6, 4.8].map((px, idx) => (
          <group key={idx}>
            <RigidBody type="fixed" colliders={false} position={[px, 3.0, 4.0]}>
              <CuboidCollider args={[0.4, 3.0, 0.4]} />
              <PillarModule position={[0, -3.0, 0]} height={6.0} radius={0.4} />
            </RigidBody>
            <RigidBody type="fixed" colliders={false} position={[px, 3.0, -2.0]}>
              <CuboidCollider args={[0.4, 3.0, 0.4]} />
              <PillarModule position={[0, -3.0, 0]} height={6.0} radius={0.4} />
            </RigidBody>
          </group>
        ))}

        {/* Ceremonial Saffron & Royal Blue Banners on Mandapa Facade */}
        <BannersAndFlags position={[-5.8, 0, 4.5]} height={9.0} color="saffron" />
        <BannersAndFlags position={[5.8, 0, 4.5]} height={9.0} color="blue" />
      </group>

      {/* ======================================================== */}
      {/* 5. SACRED GARBHAGRIHA SANCTUM (Enterable Sacred Chamber)  */}
      {/* ======================================================== */}
      {/* Left Flank Wall */}
      <RigidBody type="fixed" colliders={false} position={[-6.25, 10.2, -2]}>
        <CuboidCollider args={[2.75, 7.0, 9.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[5.5, 14, 18]} />
        </mesh>
      </RigidBody>

      {/* Right Flank Wall */}
      <RigidBody type="fixed" colliders={false} position={[6.25, 10.2, -2]}>
        <CuboidCollider args={[2.75, 7.0, 9.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[5.5, 14, 18]} />
        </mesh>
      </RigidBody>

      {/* Rear Boundary Wall */}
      <RigidBody type="fixed" colliders={false} position={[0, 10.2, -7.5]}>
        <CuboidCollider args={[3.5, 7.0, 3.5]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[7.0, 14, 7.0]} />
        </mesh>
      </RigidBody>

      {/* Ceiling over Inner Sanctum */}
      <RigidBody type="fixed" colliders={false} position={[0, 9.2, 0]}>
        <CuboidCollider args={[3.5, 1.0, 4.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
          <boxGeometry args={[7.0, 2.0, 8.0]} />
        </mesh>
      </RigidBody>

      {/* Walkable Polished Ivory Plinth Floor inside Sanctum */}
      <RigidBody type="fixed" colliders={false} position={[0, 3.25, 0]}>
        <CuboidCollider args={[3.5, 0.05, 4.0]} />
        <mesh receiveShadow material={SHARED_MATERIALS.ivoryMarble}>
          <boxGeometry args={[7.0, 0.1, 8.0]} />
        </mesh>
      </RigidBody>

      {/* Interior Sacred Altar & Consecrated Flame */}
      <InteractableTarget
        id="sanctum-altar-offering"
        name="CONSECRATED SANCTUM ALTAR"
        type="USE"
        promptLabel="OFFER LOTUS & MEDITATE"
        position={[0, 4.2, -2.5]}
        range={4.0}
        priority={10}
        chunkKey="0,0"
        action={() => {
          ambientAudioSystem.playSacredBell();
          interactionStore.openReadable({
            title: "GARBHAGRIHA INNER SANCTUM",
            subtitle: "Heart of the Sovereign Temple of Varanaya",
            location: "Grand Central Sanctuary",
            content:
              "You step onto the cool polished ivory floor of the inner sanctum. The thick sandstone walls absorb the noise of the outside world, creating a profound, sacred silence.\n\n" +
              "You offer a fresh lotus petal at the consecrated black granite altar. As your hands part, the deep bronze ghanta bell resonates through the chamber with rich harmonic overtones.\n\n" +
              "A timeless sense of peace and clarity surrounds you.",
          });
        }}
      >
        <group position={[0, 3.3, -2.5]} name="sacred-altar">
          {/* Black Granite Altar Pedestal */}
          <mesh position={[0, 0.5, 0]} castShadow material={SHARED_MATERIALS.deepSandstone}>
            <cylinderGeometry args={[1.2, 1.5, 1.0, 12]} />
          </mesh>

          {/* Carved Ivory Plinth Cap */}
          <mesh position={[0, 1.05, 0]} castShadow material={SHARED_MATERIALS.ivoryMarble}>
            <cylinderGeometry args={[1.3, 1.1, 0.15, 12]} />
          </mesh>

          {/* Ceremonial Bronze Lotus Vessel */}
          <mesh position={[0, 1.3, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <cylinderGeometry args={[0.45, 0.25, 0.4, 8]} />
          </mesh>

          {/* Sacred Consecrated Flame */}
          <mesh position={[0, 1.7, 0]}>
            <coneGeometry args={[0.16, 0.55, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={2.5}
              roughness={0.1}
            />
          </mesh>

          {/* Flanking Brass Oil Diya Lamps in Wall Niches */}
          {[-2.8, 2.8].map((lx, li) => (
            <group key={`diya-${li}`} position={[lx, 1.8, 0]}>
              <mesh material={SHARED_MATERIALS.goldOrnament}>
                <cylinderGeometry args={[0.2, 0.1, 0.15, 8]} />
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={2.0} />
              </mesh>
            </group>
          ))}
        </group>
      </InteractableTarget>

      {/* Carved Wall Relieves & Ivory Pilasters */}
      {[-8.5, 8.5].map((wx, wi) => (
        <mesh key={wi} position={[wx, 10.2, -2]} castShadow material={SHARED_MATERIALS.carvedStone}>
          <boxGeometry args={[0.8, 13.6, 17.6]} />
        </mesh>
      ))}

      {/* Colossal Shikhara Spire Tower reaching 62m */}
      <ShikharaSpire position={[0, 17.2, -2]} height={46} baseWidth={16} hasBanner={true} />

      {/* Golden Kalasha Accent Beacons at Roof Corners */}
      {(
        [
          [-8.2, 17.2, -10.2],
          [8.2, 17.2, -10.2],
          [-8.2, 17.2, 6.2],
          [8.2, 17.2, 6.2],
        ] as const
      ).map((kpos, ki) => (
        <group key={ki} position={[kpos[0], kpos[1], kpos[2]]}>
          <mesh material={SHARED_MATERIALS.goldOrnament}>
            <sphereGeometry args={[0.6, 12, 12]} />
          </mesh>
          <mesh position={[0, 0.8, 0]} material={SHARED_MATERIALS.goldOrnament}>
            <coneGeometry args={[0.25, 1.2, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
