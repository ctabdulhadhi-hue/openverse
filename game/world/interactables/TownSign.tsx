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
      title: "VARANAYA",
      subtitle: "ROYAL PROCLAMATION STELE",
      location: "Royal Promenade Plaza",
      content:
        "Welcome to Varanaya — the sovereign coastal civilization of the sapphire bay.\n\n" +
        "• North: The monumental Grand Central Sanctuary, crowned by a 62-meter Shikhara spire.\n" +
        "• East: The Royal Waterfront, bustling spice markets, ghat steps, and the 120-meter Grand Causeway Bridge leading to the Outer Island.\n" +
        "• West: The monumental Grand Sea Gate guarding the approaches to the palatial haveli avenues and royal lotus gardens.\n" +
        "• South: Ceremonial avenues flanked by royal palms and tranquil courtyard terraces.",
    });
  };

  return (
    <InteractableTarget
      id="sign-varanaya-welcome"
      name="ROYAL STELE"
      type="READ"
      promptLabel="READ STELE"
      position={position}
      range={3.8}
      priority={10}
      chunkKey={chunkKey}
      action={handleRead}
    >
      <group rotation={rotation}>
        {/* Carved Sandstone Stele Column Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.2, 0]}>
          <CuboidCollider args={[0.3, 1.2, 0.2]} />
          {/* Carved Sandstone Monolith Pillar */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[0.6, 2.4, 0.35]} />
          </mesh>
        </RigidBody>

        {/* Polished Inscription Tablet */}
        <mesh position={[0, 1.5, 0.19]} castShadow material={SHARED_MATERIALS.carvedStone}>
          <boxGeometry args={[0.5, 1.0, 0.05]} />
        </mesh>

        {/* Ceremonial Gold Lotus Emblem */}
        <mesh position={[0, 2.15, 0.2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#b45309"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Stepped Plinth Base Footer */}
        <mesh position={[0, 0.12, 0]} material={SHARED_MATERIALS.deepSandstone}>
          <boxGeometry args={[0.9, 0.24, 0.65]} />
        </mesh>
      </group>
    </InteractableTarget>
  );
}
