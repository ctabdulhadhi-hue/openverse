import { InteractableTarget } from "@/game/interaction";
import { missionManager } from "@/game/missions/MissionManager";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { AmbientPeacock } from "./AmbientPeacock";
import { PalmTree } from "./PalmTree";

export interface PalaceGardensProps {
  position?: [number, number, number];
}

/**
 * PalaceGardens Component.
 * Features:
 * - Octagonal carved stone lotus fountain basin
 * - Flowing turquoise water surface
 * - Ornamental palm clusters
 * - Saffron marigold garland flower planters
 * - Decorative ornamental peacocks
 */
export function PalaceGardens({ position = [0, 0, 0] }: PalaceGardensProps) {
  return (
    <group position={position} name="palace-gardens">
      {/* 1. Central Octagonal Lotus Fountain */}
      <group position={[0, 0, 0]}>
        {/* Fountain Outer Basin Wall */}
        <mesh
          position={[0, 0.45, 0]}
          castShadow
          receiveShadow
          material={SHARED_MATERIALS.ivoryMarble}
        >
          <cylinderGeometry args={[4.2, 4.6, 0.9, 8]} />
        </mesh>
        {/* Fountain Water Surface */}
        <mesh
          position={[0, 0.82, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={SHARED_MATERIALS.oceanTurquoise}
        >
          <circleGeometry args={[3.8, 16]} />
        </mesh>
        {/* Central Tiered Lotus Spire */}
        <mesh position={[0, 1.2, 0]} castShadow material={SHARED_MATERIALS.carvedStone}>
          <cylinderGeometry args={[1.2, 1.5, 0.8, 8]} />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow material={SHARED_MATERIALS.ivoryMarble}>
          <sphereGeometry args={[0.7, 8, 8]} />
        </mesh>
        <mesh position={[0, 2.5, 0]} material={SHARED_MATERIALS.goldOrnament}>
          <coneGeometry args={[0.25, 0.6, 6]} />
        </mesh>
      </group>

      {/* Phase 10 Mission 4 Objective: Ancient Lotus Stele */}
      <InteractableTarget
        id="stele-garden-whispers"
        name="Ancient Lotus Stele"
        type="READ"
        promptLabel="[E] INSPECT ANCIENT STELE"
        position={[0, 1.0, -4.5]}
        range={4.5}
        priority={10}
        chunkKey="0,0"
        action={() => {
          missionManager.handleInteraction("stele-garden-whispers");
        }}
      >
        <mesh position={[0, 1.0, -4.5]} castShadow material={SHARED_MATERIALS.carvedStone}>
          <boxGeometry args={[0.9, 1.8, 0.35]} />
        </mesh>
        {/* Carved lotus medallion relief */}
        <mesh position={[0, 1.45, -4.3]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 12]} />
          <meshStandardMaterial color="#fef08a" emissive="#d97706" emissiveIntensity={0.6} />
        </mesh>
      </InteractableTarget>

      {/* 2. Palm Trees Framing the Garden */}
      <PalmTree position={[-7.5, 0, -6.5]} scale={0.9} />
      <PalmTree position={[7.5, 0, -6.5]} scale={0.95} />
      <PalmTree position={[-8.5, 0, 6.0]} scale={0.85} />
      <PalmTree position={[8.5, 0, 6.0]} scale={0.9} />

      {/* 3. Flower Beds with Marigolds and Lotuses */}
      {(
        [
          [-5.5, 0.25, 0],
          [5.5, 0.25, 0],
          [0, 0.25, -6.0],
          [0, 0.25, 6.0],
        ] as const
      ).map((pos, idx) => (
        <group key={idx} position={[pos[0], pos[1], pos[2]]}>
          {/* Planter Box */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[3.2, 0.5, 1.6]} />
          </mesh>
          {/* Marigold Blooms */}
          <mesh position={[0, 0.35, 0]} material={SHARED_MATERIALS.flowerGarland}>
            <boxGeometry args={[2.8, 0.3, 1.2]} />
          </mesh>
        </group>
      ))}

      {/* 4. Ambient Peacocks roaming the garden */}
      <AmbientPeacock position={[-3.5, 0, 2.5]} rotation={[0, 0.6, 0]} scale={0.85} />
      <AmbientPeacock position={[4.0, 0, -3.0]} rotation={[0, -2.1, 0]} scale={0.9} />
    </group>
  );
}
