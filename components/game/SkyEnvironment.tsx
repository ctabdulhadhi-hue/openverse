"use client";

import { Sky } from "@react-three/drei";

/**
 * Atmospheric sky and distance fog for the 3D environment.
 * Provides visual depth and seamless horizon blending.
 */
export function SkyEnvironment() {
  return (
    <>
      <color attach="background" args={["#82a8c7"]} />
      <fog attach="fog" args={["#89b2d0", 180, 1600]} />
      <Sky
        distance={450000}
        sunPosition={[120, 85, 100]}
        inclination={0.52}
        azimuth={0.22}
        turbidity={4}
        rayleigh={0.5}
        mieCoefficient={0.003}
        mieDirectionalG={0.8}
      />
    </>
  );
}
