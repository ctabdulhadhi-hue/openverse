"use client";

import { Sky } from "@react-three/drei";

/**
 * Atmospheric sky and distance fog for the 3D environment.
 * Provides visual depth and seamless horizon blending.
 */
export function SkyEnvironment() {
  return (
    <>
      <color attach="background" args={["#7eb3d8"]} />
      <fog attach="fog" args={["#9bc1dc", 140, 1800]} />
      <Sky
        distance={450000}
        sunPosition={[140, 75, 90]}
        inclination={0.5}
        azimuth={0.25}
        turbidity={3.5}
        rayleigh={0.65}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />
    </>
  );
}
