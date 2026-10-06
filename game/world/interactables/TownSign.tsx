"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { InteractableTarget, interactionStore } from "@/game/interaction";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface TownSignProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  chunkKey?: string;
}

/**
 * Interactive Town Welcome Sign in Westport Town.
 * Prompts: [E] READ SIGN
 * Displays lore archive when activated.
 */
export function TownSign({
  position = [0, 0, 14],
  rotation = [0, 0, 0],
  chunkKey = "0,0",
}: TownSignProps) {
  const handleRead = () => {
    interactionStore.openReadable({
      title: "WESTPORT",
      subtitle: "DISTRICT WELCOME SIGN",
      location: "Westport Town Square",
      content:
        "Welcome to the first district of OPENVERSE.\n\n" +
        "Explore the town square and historic clock tower.\n" +
        "Head North along the cobblestone road toward Pine Crest Forest and Mount Aethel, " +
        "or journey East along the highway to reach Central City.",
    });
  };

  return (
    <InteractableTarget
      id="sign-westport-welcome"
      name="SIGN"
      type="READ"
      promptLabel="READ SIGN"
      position={position}
      range={3.8}
      priority={10}
      chunkKey={chunkKey}
      action={handleRead}
    >
      <group rotation={rotation}>
        {/* Physical Sign Post Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.2, 0]}>
          <CuboidCollider args={[0.15, 1.2, 0.15]} />
          {/* Wooden Post */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[0.2, 2.4, 0.2]} />
          </mesh>
        </RigidBody>

        {/* Signboard Plaque */}
        <mesh position={[0, 1.8, 0.12]} castShadow material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[1.6, 0.8, 0.08]} />
        </mesh>

        {/* Emissive Decorative Border */}
        <mesh position={[0, 1.8, 0.16]}>
          <planeGeometry args={[1.4, 0.6]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Stone Base Footer */}
        <mesh position={[0, 0.15, 0]} material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[0.6, 0.3, 0.6]} />
        </mesh>
      </group>
    </InteractableTarget>
  );
}
