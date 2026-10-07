"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface AmbientBirdsProps {
  center?: [number, number, number];
  radius?: number;
  birdCount?: number;
}

/**
 * Ambient Soaring Birds (Flock of coastal birds/seagulls).
 * Glides smoothly in wide circular arcs high above the harbor and grand sanctuary.
 */
export function AmbientBirds({
  center = [20, 48, -10],
  radius = 55,
  birdCount = 8,
}: AmbientBirdsProps) {
  const birdsGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!birdsGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Rotate entire flock orbit slowly
    birdsGroupRef.current.rotation.y = t * 0.15;

    // Wing flapping animation for individual birds
    birdsGroupRef.current.children.forEach((bird, i) => {
      const flap = Math.sin(t * 7.0 + i) * 0.35;
      const leftWing = bird.children[1];
      const rightWing = bird.children[2];
      if (leftWing) leftWing.rotation.z = flap;
      if (rightWing) rightWing.rotation.z = -flap;
    });
  });

  return (
    <group position={center} ref={birdsGroupRef} name="ambient-birds-flock">
      {Array.from({ length: birdCount }).map((_, i) => {
        const ang = (i / birdCount) * Math.PI * 2;
        const rad = radius + Math.sin(i * 1.5) * 12;
        const yOffset = Math.sin(i * 2.1) * 6;

        return (
          <group
            key={i}
            position={[Math.cos(ang) * rad, yOffset, Math.sin(ang) * rad]}
            rotation={[0, -ang + Math.PI / 2, 0]}
          >
            {/* Bird Torso */}
            <mesh material={SHARED_MATERIALS.ivoryMarble}>
              <coneGeometry args={[0.22, 0.9, 5]} />
            </mesh>
            {/* Left Wing */}
            <mesh position={[-0.45, 0.05, -0.1]} material={SHARED_MATERIALS.ivoryMarble}>
              <boxGeometry args={[0.9, 0.04, 0.35]} />
            </mesh>
            {/* Right Wing */}
            <mesh position={[0.45, 0.05, -0.1]} material={SHARED_MATERIALS.ivoryMarble}>
              <boxGeometry args={[0.9, 0.04, 0.35]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
