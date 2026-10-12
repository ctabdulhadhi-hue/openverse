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
      <hemisphereLight args={["#bae6fd", "#c48446", 0.72]} />

      <ambientLight intensity={0.38} color="#e0f2fe" />

      {/* Main directional sun light casting real-time shadows and golden highlights */}
      <directionalLight
        ref={sunRef}
        position={[65, 75, 48]}
        intensity={2.35}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={280}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-bias={-0.00012}
        shadow-normalBias={0.035}
      />

      {/* Coastal turquoise sea bounce light reflecting onto waterfront quays and under arches */}
      <directionalLight position={[70, 12, 28]} intensity={0.4} color="#38bdf8" />

      {/* Subtle warm rim light for architectural edge definition and depth */}
      <directionalLight position={[-50, 35, -40]} intensity={0.5} color="#fed7aa" />
    </>
  );
}
