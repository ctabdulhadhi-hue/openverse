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
      {/* Sky/ground ambient light for natural fill */}
      <hemisphereLight args={["#dbeafe", "#182320", 0.55]} />

      <ambientLight intensity={0.35} color="#cfe2f3" />

      {/* Main directional sun light casting real-time shadows */}
      <directionalLight
        ref={sunRef}
        position={[60, 65, 45]}
        intensity={1.75}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />
    </>
  );
}
