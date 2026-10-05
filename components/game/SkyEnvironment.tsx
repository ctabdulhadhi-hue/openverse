"use client";

import { Sky } from "@react-three/drei";

/**
 * Atmospheric sky and distance fog for the 3D environment.
 * Provides visual depth and seamless horizon blending.
 */
export function SkyEnvironment() {
  return (
    <>
      <color attach="background" args={["#182330"]} />
      <fog attach="fog" args={["#182330", 35, 180]} />
      <Sky
        distance={450000}
        sunPosition={[60, 45, 50]}
        inclination={0.55}
        azimuth={0.25}
        turbidity={6}
        rayleigh={0.6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
    </>
  );
}
