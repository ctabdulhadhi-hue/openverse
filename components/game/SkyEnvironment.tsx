"use client";

import { Sky } from "@react-three/drei";

/**
 * Atmospheric sky and distance fog for the 3D environment.
 * Provides visual depth and seamless horizon blending.
 */
export function SkyEnvironment() {
  return (
    <>
      <color attach="background" args={["#93c5fd"]} />
      <fog attach="fog" args={["#bae6fd", 110, 540]} />
      <Sky
        distance={450000}
        sunPosition={[140, 75, 90]}
        inclination={0.48}
        azimuth={0.25}
        turbidity={3.8}
        rayleigh={1.25}
        mieCoefficient={0.004}
        mieDirectionalG={0.86}
      />
    </>
  );
}
