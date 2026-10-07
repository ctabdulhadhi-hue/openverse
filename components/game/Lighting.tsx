"use client";

import { useRef } from "react";
import type { DirectionalLight } from "three";

/**
 * Balanced lighting setup with directional sunlight, ambient bounce,
 * and high-fidelity soft shadows.
 */
export function Lighting() {
  const sunRef = useRef<DirectionalLight>(null);

  return (
    <>
      {/* Sky/ground ambient light for natural fill and warm sandstone bounce */}
      <hemisphereLight args={["#bae6fd", "#d4a373", 0.65]} />

      <ambientLight intensity={0.4} color="#e0f2fe" />

      {/* Main directional sun light casting real-time shadows and golden highlights */}
      <directionalLight
        ref={sunRef}
        position={[65, 70, 50]}
        intensity={2.2}
        color="#fff3db"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />

      {/* Subtle warm rim light for architectural edge definition and depth */}
      <directionalLight position={[-50, 35, -40]} intensity={0.5} color="#fed7aa" />
    </>
  );
}
