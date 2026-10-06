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
 * Interactive Civic Terminal / Notice Board in Westport.
 * Prompts: [E] USE KIOSK
 * Displays civic announcements and environmental intel.
 */
export function TownKiosk({
  position = [8, 0, 10],
  rotation = [0, -Math.PI / 6, 0],
  chunkKey = "0,0",
}: TownKioskProps) {
  const handleUseKiosk = () => {
    interactionStore.openReadable({
      title: "WESTPORT NOTICE BOARD",
      subtitle: "MUNICIPAL TERMINAL",
      location: "Town Plaza Civic Station",
      content:
        "CIVIC NOTICE — ADVISORY:\n\n" +
        "• Road maintenance active along the Eastern Highway transition.\n" +
        "• Mountain route to Mount Aethel Summit remains fully accessible.\n" +
        "• Weather surveillance: Clear skies and stable barometric pressure recorded.\n" +
        "• Local merchants at Westport Market Street report new inventory arrivals.",
    });
  };

  return (
    <InteractableTarget
      id="kiosk-westport-bulletin"
      name="KIOSK"
      type="USE"
      promptLabel="USE KIOSK"
      position={position}
      range={3.5}
      priority={5}
      chunkKey={chunkKey}
      action={handleUseKiosk}
    >
      <group rotation={rotation}>
        {/* Physical Kiosk Base Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.1, 0]}>
          <CuboidCollider args={[0.6, 1.1, 0.4]} />
          {/* Main Terminal Column */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingBlue}>
            <boxGeometry args={[1.1, 2.2, 0.6]} />
          </mesh>
        </RigidBody>

        {/* Angled Interactive Screen Panel */}
        <group position={[0, 1.4, 0.25]} rotation={[-0.3, 0, 0]}>
          <mesh material={SHARED_MATERIALS.roofSlate}>
            <boxGeometry args={[0.9, 0.6, 0.1]} />
          </mesh>
          {/* Glowing Terminal Display */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Pillar Top Light Indicator */}
        <mesh position={[0, 2.25, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </InteractableTarget>
  );
}
