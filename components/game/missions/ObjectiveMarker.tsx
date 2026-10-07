"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import { MISSION_CONFIG } from "@/game/missions/MissionConfig";
import { missionStore } from "@/game/missions/MissionStore";
import type { MissionObjectiveDefinition } from "@/game/missions/MissionTypes";
import {
  getChunkChebyshevDistance,
  worldToChunkCoord,
} from "@/game/world/streaming/ChunkCoordinates";
import { streamingStore } from "@/game/world/streaming/StreamingStore";

export interface ObjectiveMarkerProps {
  playerPosRef?: React.RefObject<THREE.Vector3 | null>;
}

/**
 * 3D World Objective Marker (Phase 9).
 *
 * Renders a subtle holographic beacon in the game world at the location of
 * the currently tracked active objective.
 *
 * Streaming-Safe:
 * - Computes target chunk coordinates.
 * - Hides the 3D marker when the target chunk is outside active streaming distance.
 * - Restores automatically when the player approaches and the chunk streams back in.
 */
export function ObjectiveMarker({ playerPosRef }: ObjectiveMarkerProps) {
  const beaconGroupRef = useRef<THREE.Group>(null);
  const diamondRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const [activeObjective, setActiveObjective] = useState<MissionObjectiveDefinition | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [isChunkLoaded, setIsChunkLoaded] = useState<boolean>(true);

  const lastCheckTimeRef = useRef<number>(0);

  useFrame((state, delta) => {
    const now = performance.now();

    // Throttle store checks to ~10 times per second
    if (now - lastCheckTimeRef.current > 100) {
      lastCheckTimeRef.current = now;

      const tracked = missionStore.getTrackedMission();
      if (!tracked || tracked.state !== "ACTIVE") {
        if (activeObjective !== null) setActiveObjective(null);
        return;
      }

      const currentObjDef = tracked.definition.objectives[tracked.currentObjectiveIndex];
      if (!currentObjDef || !currentObjDef.target?.position) {
        if (activeObjective !== null) setActiveObjective(null);
        return;
      }

      if (activeObjective?.id !== currentObjDef.id) {
        setActiveObjective(currentObjDef);
      }

      const targetPos = currentObjDef.target.position;

      // 1. Check Streaming Safety
      const targetChunk = worldToChunkCoord(targetPos[0], targetPos[2]);
      const currentStats = streamingStore.getStats();
      const chunkDist = getChunkChebyshevDistance(
        { chunkX: currentStats.currentChunkX, chunkZ: currentStats.currentChunkZ },
        targetChunk,
      );
      const inRange = chunkDist <= currentStats.loadRadius;
      if (inRange !== isChunkLoaded) {
        setIsChunkLoaded(inRange);
      }

      // 2. Calculate Distance
      if (playerPosRef?.current) {
        const dx = playerPosRef.current.x - targetPos[0];
        const dz = playerPosRef.current.z - targetPos[2];
        const dist = Math.hypot(dx, dz);
        setDistanceMeters(Math.round(dist));
      }
    }

    // Visual idle animation (bobbing and rotation)
    if (beaconGroupRef.current && isChunkLoaded && activeObjective?.target?.position) {
      const pos = activeObjective.target.position;
      const bob =
        Math.sin(state.clock.elapsedTime * MISSION_CONFIG.MARKER.BOB_SPEED) *
        MISSION_CONFIG.MARKER.BOB_AMPLITUDE;
      beaconGroupRef.current.position.set(
        pos[0],
        pos[1] + MISSION_CONFIG.MARKER.FLOAT_HEIGHT + bob,
        pos[2],
      );

      if (diamondRef.current) {
        diamondRef.current.rotation.y += delta * MISSION_CONFIG.MARKER.ROTATION_SPEED;
      }

      if (ringRef.current) {
        const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
        ringRef.current.scale.set(pulse, pulse, pulse);
      }
    }
  });

  if (!activeObjective || !activeObjective.target?.position || !isChunkLoaded) {
    return null;
  }

  const targetPos = activeObjective.target.position;

  return (
    <group name="mission-objective-marker">
      {/* Ground Pulse Ring at Objective Anchor */}
      <mesh
        ref={ringRef}
        position={[targetPos[0], targetPos[1] + 0.1, targetPos[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshBasicMaterial
          color={MISSION_CONFIG.MARKER.COLOR}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Holographic Beacon */}
      <group ref={beaconGroupRef}>
        {/* Rotating Cyan Octahedron / Diamond */}
        <mesh ref={diamondRef} castShadow={false}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color={MISSION_CONFIG.MARKER.COLOR}
            emissive={MISSION_CONFIG.MARKER.PULSE_COLOR}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Vertical Beam Cylinder */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshBasicMaterial color={MISSION_CONFIG.MARKER.PULSE_COLOR} transparent opacity={0.35} />
        </mesh>

        {/* 3D World Space Badge with HTML UI */}
        <Html position={[0, 0.75, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <div className="pointer-events-none flex flex-col items-center select-none">
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/60 bg-black/60 px-3 py-1 text-[11px] font-bold tracking-widest text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] backdrop-blur-md">
              <span className="text-[10px] text-amber-300">◆</span>
              <span className="whitespace-nowrap uppercase">{activeObjective.title}</span>
            </div>
            {distanceMeters > 0 && (
              <span className="mt-0.5 font-mono text-[10px] font-semibold text-cyan-200 drop-shadow">
                {distanceMeters} m
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}
