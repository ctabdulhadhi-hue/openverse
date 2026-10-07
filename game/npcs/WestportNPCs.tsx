"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

import { WESTPORT_NPCS, WESTPORT_SPAWN_ZONES } from "@/data/npcs/westportNPCs";
import { useGame } from "@/game/core/state/GameContext";

import type { NPCController } from "./NPCController";
import { npcManager } from "./NPCManager";
import { NPCVisual } from "./NPCVisual";

export interface WestportNPCsProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * Westport Town NPC Population Controller (Phase 7).
 *
 * Coordinates:
 * - Deterministic population lifecycle for chunk (0, 0)
 * - Centralized frame tick for navigation and simulation tiers
 * - Direct scene graph transformation without frame-by-frame React state updates
 * - Clean unmount cleanup on chunk streaming unload
 */
export function WestportNPCs({ playerPosRef }: WestportNPCsProps) {
  const { state } = useGame();
  const showDebug = state.debug.enabled;

  const playerPosTupleRef = useRef<[number, number, number] | null>(null);

  const [controllers] = useState<NPCController[]>(() => {
    for (const zone of WESTPORT_SPAWN_ZONES) {
      npcManager.registerSpawnZone(zone);
    }
    const spawned: NPCController[] = [];
    for (const def of WESTPORT_NPCS) {
      const controller = npcManager.spawnNPC(def);
      spawned.push(controller);
    }
    return spawned;
  });

  // Ensure registry sync and cleanup on chunk unmount
  useEffect(() => {
    for (const zone of WESTPORT_SPAWN_ZONES) {
      npcManager.registerSpawnZone(zone);
    }
    for (const ctrl of controllers) {
      npcManager.spawnNPC(ctrl.def);
    }

    return () => {
      npcManager.despawnByChunk("0,0");
    };
  }, [controllers]);

  // Centralized frame simulation loop
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1); // Clamp dt to prevent tunneling on lag spikes
    const playerPos = playerPosRef?.current;

    if (playerPos) {
      playerPosTupleRef.current = [playerPos.x, playerPos.y, playerPos.z];
    } else {
      playerPosTupleRef.current = null;
    }

    npcManager.update(dt, playerPosTupleRef.current);
  });

  return (
    <group name="westport-npcs">
      {/* 1. Render NPC Visuals */}
      {controllers.map((ctrl) => (
        <NPCVisual key={ctrl.id} controller={ctrl} showDebug={showDebug} />
      ))}

      {/* 2. Optional Debug Spawn Zone Outlines (Only visible when F3 is active) */}
      {showDebug && (
        <group name="debug-spawn-zones">
          {WESTPORT_SPAWN_ZONES.map((zone) => (
            <group key={zone.id} position={zone.center}>
              {/* Spawn zone perimeter ring on ground */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[zone.radius - 0.2, zone.radius, 32]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}
