"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";

import { missionStore } from "@/game/missions/MissionStore";

import type { NPCController } from "./NPCController";

export interface NPCVisualProps {
  controller: NPCController;
  showDebug?: boolean;
}

/**
 * Reusable Stylized Humanoid Visual Component for NPCs in OPENVERSE (Phase 7).
 *
 * Provides:
 * - Deterministic visual styling (shirt, pants, skin, hair/cap, backpack, height/width scale)
 * - Procedural idle breathing and head-turn toward player
 * - Procedural walking locomotion (alternating legs/arms swing + body bob)
 * - Simulation tier LOD optimization (suspends limb animation for distant NPCs)
 * - Phase 9 Mission overhead indicator badge (! available, ? active target)
 */
export function NPCVisual({ controller, showDebug = false }: NPCVisualProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const missionMarkerRef = useRef<THREE.Mesh>(null);

  const [missionIndicator, setMissionIndicator] = useState<"AVAILABLE" | "ACTIVE_TARGET" | "NONE">(
    "NONE",
  );
  const lastIndicatorCheckRef = useRef<number>(0);

  const { appearance } = controller.def;

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;

    const now = performance.now();
    if (now - lastIndicatorCheckRef.current > 200) {
      lastIndicatorCheckRef.current = now;
      const nextIndicator = missionStore.getNpcMissionIndicator(controller.id);
      if (nextIndicator !== missionIndicator) {
        setMissionIndicator(nextIndicator);
      }
    }

    if (missionMarkerRef.current) {
      missionMarkerRef.current.rotation.y += delta * 1.5;
    }

    const tier = controller.simulationTier;
    if (tier === "UNLOADED") {
      rootGroupRef.current.visible = false;
      return;
    }
    rootGroupRef.current.visible = true;

    // Update root position and orientation
    rootGroupRef.current.position.set(
      controller.position[0],
      controller.position[1],
      controller.position[2],
    );
    rootGroupRef.current.rotation.y = controller.yaw;

    // Head orientation (look-at player)
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = controller.headYaw;
    }

    // Skip detailed limb animation if far away
    if (tier === "FAR") {
      return;
    }

    // Procedural animation
    if (controller.state === "WALKING") {
      const swing = Math.sin(controller.walkClock) * 0.45;
      const armSwing = Math.sin(controller.walkClock) * 0.35;
      const bob = Math.abs(Math.sin(controller.walkClock)) * 0.04;

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;
      if (torsoRef.current) torsoRef.current.position.y = 1.05 + bob;
    } else {
      // IDLE / WAITING: subtle breathing, natural weight shifts, and gentle arm postures
      const breathe = Math.sin(controller.breatheClock * 2.0) * 0.02;
      const weightShift = Math.sin(controller.breatheClock * 0.7) * 0.05;
      const armSway = Math.cos(controller.breatheClock * 0.9) * 0.04;

      if (leftLegRef.current) leftLegRef.current.rotation.z = weightShift * 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.z = -weightShift * 0.5;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = armSway;
        leftArmRef.current.rotation.z = 0.08 + Math.abs(weightShift) * 0.2;
      }
      if (rightArmRef.current) {
        if (controller.isAcknowledgingPlayer) {
          // Subtle warm greeting gesture (hand raised respectfully toward player)
          rightArmRef.current.rotation.x = -0.45 + armSway * 0.2;
          rightArmRef.current.rotation.z = -0.25;
        } else {
          rightArmRef.current.rotation.x = -armSway * 0.8;
          rightArmRef.current.rotation.z = -0.08 - Math.abs(weightShift) * 0.2;
        }
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 1.05;
        torsoRef.current.rotation.z = weightShift * 0.3;
        torsoRef.current.scale.set(1.0 + breathe, 1.0 + breathe * 0.5, 1.0 + breathe);
      }
    }
  });

  return (
    <group
      ref={rootGroupRef}
      scale={[appearance.widthScale, appearance.heightScale, appearance.widthScale]}
    >
      {/* 1. Head and Hat/Hair */}
      <group ref={headGroupRef} position={[0, 1.7, 0]}>
        {/* Head Mesh */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={appearance.skinColor} roughness={0.7} />
        </mesh>

        {/* Hair or Cap */}
        {appearance.hasHat ? (
          <group position={[0, 0.1, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.22, 0.1, 16]} />
              <meshStandardMaterial color={appearance.hatColor ?? "#1e293b"} roughness={0.6} />
            </mesh>
            {/* Cap Visor Bill */}
            <mesh position={[0, -0.02, 0.18]} rotation={[0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.22, 0.02, 0.14]} />
              <meshStandardMaterial color={appearance.hatColor ?? "#1e293b"} roughness={0.6} />
            </mesh>
          </group>
        ) : (
          /* Natural Hair Style */
          <mesh position={[0, 0.08, -0.02]} castShadow>
            <boxGeometry args={[0.22, 0.14, 0.22]} />
            <meshStandardMaterial color={appearance.hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Subtle Face Visor / Eyes Accent */}
        <mesh position={[0, 0.01, 0.16]}>
          <boxGeometry args={[0.14, 0.04, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* 2. Torso (Shirt / Jacket) */}
      <mesh ref={torsoRef} position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.65, 0.26]} />
        <meshStandardMaterial color={appearance.shirtColor} roughness={0.7} />
      </mesh>

      {/* 3. Optional Backpack */}
      {appearance.hasBackpack && (
        <mesh position={[0, 1.15, -0.18]} castShadow>
          <boxGeometry args={[0.28, 0.36, 0.16]} />
          <meshStandardMaterial color={appearance.backpackColor ?? "#334155"} roughness={0.8} />
        </mesh>
      )}

      {/* 4. Left Arm (Pivot at shoulder) */}
      <group ref={leftArmRef} position={[-0.28, 1.3, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.14]} />
          <meshStandardMaterial color={appearance.shirtColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={appearance.skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* 5. Right Arm (Pivot at shoulder) */}
      <group ref={rightArmRef} position={[0.28, 1.3, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.14]} />
          <meshStandardMaterial color={appearance.shirtColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={appearance.skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* 6. Left Leg (Pivot at hip) */}
      <group ref={leftLegRef} position={[-0.13, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.72, 0.16]} />
          <meshStandardMaterial color={appearance.pantsColor} roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.74, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.22]} />
          <meshStandardMaterial color={appearance.shoesColor} roughness={0.6} />
        </mesh>
      </group>

      {/* 7. Right Leg (Pivot at hip) */}
      <group ref={rightLegRef} position={[0.13, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.72, 0.16]} />
          <meshStandardMaterial color={appearance.pantsColor} roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.74, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.22]} />
          <meshStandardMaterial color={appearance.shoesColor} roughness={0.6} />
        </mesh>
      </group>

      {/* 8. Optional F3 Debug Visualization */}
      {showDebug && (
        <group position={[0, 2.1, 0]}>
          {/* Awareness radius ring on ground */}
          <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[
                controller.config.playerAwarenessRadius - 0.05,
                controller.config.playerAwarenessRadius,
                24,
              ]}
            />
            <meshBasicMaterial
              color={controller.isAcknowledgingPlayer ? "#10b981" : "#38bdf8"}
              transparent
              opacity={0.3}
            />
          </mesh>
          {/* Overhead state indicator badge */}
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial
              color={
                controller.state === "WALKING"
                  ? "#22c55e"
                  : controller.state === "IDLE"
                    ? "#38bdf8"
                    : "#f59e0b"
              }
            />
          </mesh>
        </group>
      )}

      {/* 9. Mission Overhead Indicator Badge (Phase 9) */}
      {missionIndicator !== "NONE" && (
        <group position={[0, 2.18 * appearance.heightScale, 0]}>
          <mesh ref={missionMarkerRef}>
            <octahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial
              color={missionIndicator === "AVAILABLE" ? "#38bdf8" : "#fbbf24"}
              emissive={missionIndicator === "AVAILABLE" ? "#0284c7" : "#d97706"}
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
