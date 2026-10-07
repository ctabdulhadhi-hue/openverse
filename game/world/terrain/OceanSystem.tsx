"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Cinematic Continuous Ocean System for OPENVERSE (Varanaya Coast).
 *
 * Implements:
 * - Multi-layered turquoise and deep azure coastal waters
 * - Animated wave oscillation & specular highlights via useFrame
 * - Shoreline & pier foam bands with rhythmic wave crest breathing
 * - Wide continuous coverage extending to the horizon
 */
export function OceanSystem() {
  const shallowWaterRef = useRef<THREE.Mesh>(null);
  const foamGroupRef = useRef<THREE.Group>(null);
  const deepWaterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle rhythmic undulating wave motion
    if (shallowWaterRef.current) {
      shallowWaterRef.current.position.y = 0.08 + Math.sin(t * 1.2) * 0.04;
      shallowWaterRef.current.rotation.z = Math.sin(t * 0.6) * 0.002;
    }

    if (deepWaterRef.current) {
      deepWaterRef.current.position.y = 0.04 + Math.sin(t * 0.9 + 1.0) * 0.05;
    }

    // Foam band breathing pulse
    if (foamGroupRef.current) {
      const foamPulse = 0.6 + Math.sin(t * 1.8) * 0.25;
      foamGroupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          (child.material as THREE.MeshStandardMaterial).opacity = 0.45 * foamPulse;
        }
      });
    }
  });

  return (
    <group name="varanaya-ocean-system">
      {/* 1. Deep Maritime Ocean Base (Extending to horizon) */}
      <mesh
        ref={deepWaterRef}
        position={[800, 0.04, 80]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.oceanAzure}
      >
        <planeGeometry args={[1100, 1600, 32, 32]} />
      </mesh>

      {/* 2. Coastal Shallow Bay Turquoise Water (Near docks, ghats, and causeway, X >= 30) */}
      <mesh
        ref={shallowWaterRef}
        position={[280, 0.08, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.oceanTurquoise}
      >
        <planeGeometry args={[500, 680, 24, 24]} />
      </mesh>

      {/* 3. Shoreline Foam Bands along Quay Walls, Ghats, and Causeway Piers */}
      <group ref={foamGroupRef} name="ocean-shoreline-foam">
        {/* Harbor Quay Wall Foam Ribbons */}
        {(
          [
            [35, 0.12, 10, 8, 80],
            [48, 0.12, -40, 25, 8],
            [48, 0.12, 60, 25, 8],
            [90, 0.12, 20, 10, 60],
          ] as const
        ).map((f, i) => (
          <mesh key={`foam-${i}`} position={[f[0], f[1], f[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[f[3], f[4]]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.5}
              roughness={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Circular Foam Rings around Bridge Pylons */}
        {[64, 84, 104, 124, 144].map((px, idx) => (
          <mesh key={`ring-${idx}`} position={[px, 0.11, 16]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 5.0, 24]} />
            <meshStandardMaterial
              color="#ccfbf1"
              transparent
              opacity={0.4}
              roughness={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
