"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

import { registerLagoonDialogues } from "@/data/dialogue";
import { registerAllMissions } from "@/data/missions";
import { LAGOON_ISLE_NPCS, LAGOON_SPAWN_ZONES } from "@/data/npcs/lagoonNPCs";
import { useGame } from "@/game/core/state/GameContext";
import { dialogueManager } from "@/game/dialogue";
import { InteractableTarget } from "@/game/interaction/InteractionTarget";
import { missionManager } from "@/game/missions/MissionManager";
import type { NPCController } from "@/game/npcs/NPCController";
import { npcManager } from "@/game/npcs/NPCManager";
import { NPCVisual } from "@/game/npcs/NPCVisual";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { LAGOON_ISLE_COORDINATES, LAGOON_ISLE_ORIGIN } from "./lagoonIslandData";
import { LagoonIslandHarbor } from "./LagoonIslandHarbor";
import { LagoonIslandLandmarks } from "./LagoonIslandLandmarks";
import { LagoonIslandSettlement } from "./LagoonIslandSettlement";
import { LagoonIslandTerrain } from "./LagoonIslandTerrain";
import { LagoonIslandVegetation } from "./LagoonIslandVegetation";

export interface LagoonIslandRegionProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * Lagoon Island Region (Stage 2 Expansion).
 *
 * Assembles:
 * - Natural atoll terrain, central turquoise lagoon, and elevated viewpoint ridge
 * - Tropical coconut palm groves and beach flora
 * - Coral Bay Village settlement (stilt houses, fruit/spice market)
 * - Fisherman's Jetty with traditional outrigger boats
 * - Interactive landmarks (Arrival shelter, return flight station, viewpoint binoculars)
 * - Stage 2 NPCs (Maya, Kaelen, Taran) with full dialogue and mission support
 * - Clean lifecycle integration with chunk (4, 3) streaming
 */
export function LagoonIslandRegion({ playerPosRef }: LagoonIslandRegionProps) {
  const { state, pushNotification, showLocationBanner } = useGame();
  const showDebug = state.debug.enabled;

  const playerPosTupleRef = useRef<[number, number, number] | null>(null);
  const [salvageCollected, setSalvageCollected] = useState(false);

  // Initialize dialogues, missions, spawn zones, and NPCs for chunk (4, 3)
  const [controllers] = useState<NPCController[]>(() => {
    registerLagoonDialogues();
    registerAllMissions();

    for (const zone of LAGOON_SPAWN_ZONES) {
      npcManager.registerSpawnZone(zone);
    }

    const spawned: NPCController[] = [];
    for (const def of LAGOON_ISLE_NPCS) {
      const controller = npcManager.spawnNPC(def);
      spawned.push(controller);
    }
    return spawned;
  });

  // Region mount notification and unmount cleanup
  useEffect(() => {
    showLocationBanner("Lagoon Isle", "Tropical Atoll");
    registerLagoonDialogues();
    registerAllMissions();

    for (const zone of LAGOON_SPAWN_ZONES) {
      npcManager.registerSpawnZone(zone);
    }

    for (const ctrl of controllers) {
      npcManager.spawnNPC(ctrl.def);
    }

    return () => {
      dialogueManager.handleChunkUnload("4,3");
      npcManager.despawnByChunk("4,3");
    };
  }, [controllers, showLocationBanner]);

  // Centralized frame simulation loop for Island NPCs
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const pPos = playerPosRef?.current;
    if (pPos) {
      playerPosTupleRef.current = [pPos.x, pPos.y, pPos.z];
    } else {
      playerPosTupleRef.current = null;
    }
    npcManager.update(dt, playerPosTupleRef.current);
  });

  // Handle landmark discovery
  const handleDiscoverLandmark = (landmarkId: string) => {
    const loc = Object.values(LAGOON_ISLE_COORDINATES).find((c) => c.id === landmarkId);
    pushNotification({
      type: "location",
      title: "LANDMARK DISCOVERED",
      subtitle: loc?.name ?? "Lagoon Isle Landmark",
    });

    // Advance viewpoint mission if active
    if (landmarkId === "lagoon-viewpoint") {
      missionManager.completeObjective("lagoon_viewpoint_challenge", "survey_ridge");
    }
  };

  // Handle salvage collection on Turquoise Beach
  const handleCollectSalvage = () => {
    if (salvageCollected) return;
    setSalvageCollected(true);

    missionManager.completeObjective("lagoon_harbor_salvage", "collect_drift_crate");

    pushNotification({
      type: "item",
      title: "ITEM RECOVERED",
      subtitle: "Lost Harbor Drift Tackle Crate",
    });
  };

  return (
    <group position={[0, 0, 0]} name="lagoon-island-region">
      {/* 1. Atoll Terrain, Central Lagoon & Ocean Colliders */}
      <LagoonIslandTerrain origin={LAGOON_ISLE_ORIGIN} />

      {/* 2. Palm Forests, Shoreline Trees & Vegetation */}
      <LagoonIslandVegetation origin={LAGOON_ISLE_ORIGIN} />

      {/* 3. Coral Bay Settlement (Stilt Cottages & Village Market) */}
      <LagoonIslandSettlement origin={LAGOON_ISLE_ORIGIN} />

      {/* 4. Fisherman's Jetty, Outrigger Canoes & Harbor */}
      <LagoonIslandHarbor origin={LAGOON_ISLE_ORIGIN} />

      {/* 5. Landmarks, Arrival Pavilion, & Return Flight Desk */}
      <LagoonIslandLandmarks
        origin={LAGOON_ISLE_ORIGIN}
        onDiscoverLandmark={handleDiscoverLandmark}
      />

      {/* 6. Interactive Drift Crate on Turquoise Beach for Harbor Mission */}
      {!salvageCollected && (
        <InteractableTarget
          id="lagoon-drift-crate"
          name="Lost Harbor Drift Crate"
          type="PICKUP"
          promptLabel="[E] RETRIEVE DRIFT CRATE"
          position={LAGOON_ISLE_COORDINATES.beach.global}
          range={3.0}
          priority={15}
          chunkKey="4,3"
          action={handleCollectSalvage}
        >
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
          </mesh>
        </InteractableTarget>
      )}

      {/* 7. Island NPCs (Maya, Kaelen, Taran) */}
      <group name="lagoon-island-npcs">
        {controllers.map((ctrl) => (
          <NPCVisual key={ctrl.id} controller={ctrl} showDebug={showDebug} />
        ))}
      </group>
    </group>
  );
}
