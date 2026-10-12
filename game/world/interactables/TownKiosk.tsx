"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { InteractableTarget, interactionStore } from "@/game/interaction";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface TownKioskProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  chunkKey?: string;
}

/**
 * Interactive Civic Terminal / Notice Board in Varanaya Royal Promenade.
 * Prompts: [E] READ PROCLAMATION
 * Displays civic announcements and environmental lore.
 */
export function TownKiosk({
  position = [4.5, 0, 4.0],
  rotation = [0, -Math.PI / 6, 0],
  chunkKey = "0,0",
}: TownKioskProps) {
  const handleUseKiosk = () => {
    interactionStore.openReadable({
      title: "ROYAL PROCLAMATION & GUILD DISPATCH",
      subtitle: "COUNCIL OF VARANAYA",
      location: "Royal Promenade Civic Kiosk",
      content:
        "ROYAL EDICT & MARITIME DISPATCH:\n\n" +
        "• Harbor Guild: All arriving dhows and spice barques must register manifest with Samuel at the East Quay.\n" +
        "• Grand Causeway Bridge: Open to pilgrims journeying across the bay to the Outer Sea Sanctuary.\n" +
        "• Grand Sanctuary: Scholar Maya requests astronomical observations and terrace field notes.\n" +
        "• West Approach: Caravan routes through the Grand Sea Gate remain open and guarded.\n" +
        "• Market Square: Clara's spice and dye pavilion offering fresh saffron and lapis pigment.",
    });
  };

  return (
    <InteractableTarget
      id="kiosk-westport-bulletin"
      name="PROCLAMATION BOARD"
      type="READ"
      promptLabel="READ PROCLAMATIONS"
      position={position}
      range={3.5}
      priority={5}
      chunkKey={chunkKey}
      action={handleUseKiosk}
    >
      <group rotation={rotation}>
        {/* Physical Kiosk Base Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.1, 0]}>
          <CuboidCollider args={[0.65, 1.1, 0.45]} />
          {/* Main Carved Sandstone Column */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
            <boxGeometry args={[1.2, 2.2, 0.7]} />
          </mesh>
        </RigidBody>

        {/* Slanted Polished Brass Notice Tablet */}
        <group position={[0, 1.45, 0.32]} rotation={[-0.32, 0, 0]}>
          <mesh material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[1.05, 0.7, 0.12]} />
          </mesh>
          {/* Inlaid Gilded Parchment Plate */}
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[0.92, 0.58]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#f59e0b"
              emissiveIntensity={0.25}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
        </group>

        {/* Decorative Ornamental Pillar Cresting */}
        <mesh position={[0, 2.28, 0]} material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[1.35, 0.18, 0.85]} />
        </mesh>

        {/* Pillar Brass Lantern Finial */}
        <mesh position={[0, 2.5, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
      </group>
    </InteractableTarget>
  );
}
