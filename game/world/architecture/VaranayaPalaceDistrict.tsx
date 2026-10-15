"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { ambientAudioSystem } from "@/game/audio";
import { InteractableTarget, interactionStore } from "@/game/interaction";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { BannersAndFlags } from "./BannersAndFlags";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { JharokhaBalcony } from "./JharokhaBalcony";
import { PillarModule } from "./PillarModule";

export interface VaranayaPalaceProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  variant?: "royal-palace" | "merchant-haveli" | "temple-hall";
}

/**
 * Varanaya Palatial Multi-Tiered Architecture Module.
 * Features:
 * - Monumental sandstone plinth and ground colonnade
 * - Enterable shaded Haveli courtyard with interactive merchant archives
 * - Ivory marble upper residential and ceremonial floors
 * - Projecting carved Jharokha balconies with stone screens
 * - Crowning rooftop Chhatri pavilions with golden kalashas
 * - Ceremonial silk banners
 * - Solid colliders with walkable interior courtyards for havelis
 */
export function VaranayaPalace({
  position,
  rotation = [0, 0, 0],
  width = 16.0,
  height = 14.0,
  depth = 14.0,
  variant = "merchant-haveli",
}: VaranayaPalaceProps) {
  const halfW = width / 2;
  const halfD = depth / 2;
  const groundH = height * 0.45;
  const upperH = height * 0.55;

  const isRoyal = variant === "royal-palace";
  const isEnterableHaveli = variant === "merchant-haveli";

  return (
    <group position={position} rotation={rotation} name={`palace-${variant}`}>
      {/* 1. Ground Floor Tier: Enterable Courtyard for Havelis, Solid Plinth for Palaces */}
      {isEnterableHaveli ? (
        <group name="haveli-enterable-courtyard">
          {/* Courtyard Walkable Sandstone Floor */}
          <RigidBody type="fixed" colliders={false} position={[0, 0.05, 0]}>
            <CuboidCollider args={[halfW, 0.05, halfD]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.plazaCobble}>
              <boxGeometry args={[width, 0.1, depth]} />
            </mesh>
          </RigidBody>

          {/* Left Wing Flanking Wall */}
          <RigidBody type="fixed" colliders={false} position={[-halfW * 0.65, groundH / 2, 0]}>
            <CuboidCollider args={[halfW * 0.35, groundH / 2, halfD]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[halfW * 0.7, groundH, depth]} />
            </mesh>
          </RigidBody>

          {/* Right Wing Flanking Wall */}
          <RigidBody type="fixed" colliders={false} position={[halfW * 0.65, groundH / 2, 0]}>
            <CuboidCollider args={[halfW * 0.35, groundH / 2, halfD]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[halfW * 0.7, groundH, depth]} />
            </mesh>
          </RigidBody>

          {/* Rear Courtyard Boundary Wall */}
          <RigidBody type="fixed" colliders={false} position={[0, groundH / 2, -halfD * 0.7]}>
            <CuboidCollider args={[halfW * 0.4, groundH / 2, halfD * 0.3]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[halfW * 0.8, groundH, depth * 0.6]} />
            </mesh>
          </RigidBody>

          {/* Courtyard Entrance Arch Lintel */}
          <RigidBody type="fixed" colliders={false} position={[0, groundH - 0.4, halfD * 0.9]}>
            <CuboidCollider args={[halfW * 0.4, 0.4, 0.5]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
              <boxGeometry args={[halfW * 0.8, 0.8, 1.0]} />
            </mesh>
          </RigidBody>

          {/* Inner Shaded Courtyard Colonnade Pillars */}
          {[-1.8, 1.8].map((px, i) => (
            <group key={`inner-pillar-${i}`} position={[px, 0, 0]}>
              <PillarModule height={groundH} radius={0.25} materialColor="sandstone" />
            </group>
          ))}

          {/* Hanging Brass Oil Lantern in Courtyard Center */}
          <group position={[0, groundH - 0.5, 0]}>
            <mesh material={SHARED_MATERIALS.goldOrnament}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.8} />
            </mesh>
          </group>

          {/* Interactive Merchant Registry Archive Stele inside Courtyard */}
          <InteractableTarget
            id={`haveli-registry-${position[0]}-${position[2]}`}
            name="HAVELI ARCHIVE STELE"
            type="READ"
            promptLabel="READ MERCHANT ARCHIVES"
            position={[0, 1.0, -1.8]}
            range={3.6}
            priority={7}
            action={() => {
              ambientAudioSystem.playDiscoveryChime();
              interactionStore.openReadable({
                title: "HAVELI MERCHANT REGISTRY",
                subtitle: "Archives of the Guild of the Azure Sea",
                location: "Merchant Haveli Courtyard",
                content:
                  "Preserved copper plates and palm-leaf manuscripts record centuries of maritime trade:\n\n" +
                  "• 400 sacks of Malabar tellicherry pepper consigned to western ports.\n" +
                  "• 12 crates of Ceylon pearls and lapis lazuli deposited in the royal treasury.\n" +
                  "• 8 dhow charters scheduled for the monsoon trade winds.",
              });
            }}
          >
            <group position={[0, 0.6, -1.8]}>
              <mesh castShadow material={SHARED_MATERIALS.carvedStone}>
                <boxGeometry args={[0.8, 1.2, 0.3]} />
              </mesh>
              <mesh position={[0, 0.4, 0.16]}>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 12]} />
                <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} />
              </mesh>
            </group>
          </InteractableTarget>
        </group>
      ) : (
        <RigidBody type="fixed" colliders={false} position={[0, groundH / 2, 0]}>
          <CuboidCollider args={[halfW, groundH / 2, halfD]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[width, groundH, depth]} />
          </mesh>
        </RigidBody>
      )}

      {/* Decorative Carved Base Molding */}
      <mesh position={[0, groundH, 0]} material={SHARED_MATERIALS.carvedStone}>
        <boxGeometry args={[width + 0.6, 0.4, depth + 0.6]} />
      </mesh>

      {/* Front Colonnade Pillars along Ground Facade */}
      {[-halfW * 0.7, -halfW * 0.25, halfW * 0.25, halfW * 0.7].map((px, i) => (
        <PillarModule
          key={i}
          position={[px, 0, halfD + 0.2]}
          height={groundH}
          radius={0.3}
          materialColor={isRoyal ? "ivory" : "sandstone"}
        />
      ))}

      {/* 2. Upper Floor Tier (Ivory Marble Facade) */}
      <RigidBody type="fixed" colliders={false} position={[0, groundH + upperH / 2, 0]}>
        <CuboidCollider args={[halfW * 0.9, upperH / 2, halfD * 0.9]} />
        <mesh
          castShadow
          receiveShadow
          material={isRoyal ? SHARED_MATERIALS.ivoryMarble : SHARED_MATERIALS.warmSandstone}
        >
          <boxGeometry args={[width * 0.9, upperH, depth * 0.9]} />
        </mesh>
      </RigidBody>

      {/* Upper Cornice & Terracotta Parapet */}
      <mesh position={[0, height, 0]} castShadow material={SHARED_MATERIALS.templeTerracotta}>
        <boxGeometry args={[width * 0.95, 0.4, depth * 0.95]} />
      </mesh>

      {/* 3. Projecting Jharokha Balconies on Upper Facade */}
      <JharokhaBalcony position={[-halfW * 0.45, groundH + 1.2, halfD * 0.9]} scale={0.9} />
      <JharokhaBalcony position={[halfW * 0.45, groundH + 1.2, halfD * 0.9]} scale={0.9} />
      {isRoyal && <JharokhaBalcony position={[0, groundH + 1.6, halfD * 0.9 + 0.4]} scale={1.1} />}

      {/* 4. Rooftop Chhatri Pavilions on Terraces */}
      <ChhatriPavilion
        position={[-halfW * 0.35, height, -halfD * 0.35]}
        scale={0.9}
        materialType={isRoyal ? "ivory" : "sandstone"}
      />
      <ChhatriPavilion
        position={[halfW * 0.35, height, -halfD * 0.35]}
        scale={0.9}
        materialType={isRoyal ? "ivory" : "sandstone"}
      />
      {isRoyal && <ChhatriPavilion position={[0, height, 0]} scale={1.3} materialType="ivory" />}

      {/* 5. Silk Banners fluttering on Roof Corners */}
      <BannersAndFlags
        position={[-halfW * 0.4, height + 3.0, halfD * 0.4]}
        height={5.0}
        color={isRoyal ? "saffron" : "blue"}
        scale={0.8}
      />
      <BannersAndFlags
        position={[halfW * 0.4, height + 3.0, halfD * 0.4]}
        height={5.0}
        color={isRoyal ? "gold" : "saffron"}
        scale={0.8}
      />
    </group>
  );
}
