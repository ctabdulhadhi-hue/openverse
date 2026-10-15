"use client";

import { Sky } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { dayNightStore } from "@/game/dayNight/DayNightSystem";
import { weatherStore } from "@/game/weather/WeatherSystem";

/**
 * Atmospheric sky, dynamic fog, and horizon blending synchronized
 * with the continuous Day/Night cycle and Weather systems.
 */
export function SkyEnvironment() {
  const { scene } = useThree();
  const fogRef = useRef<THREE.Fog>(null);
  const skyStateRef = useRef(dayNightStore.getState());

  useFrame((_, delta) => {
    weatherStore.update(delta);
    const dayNight = dayNightStore.getState();
    const weather = weatherStore.getState();
    skyStateRef.current = dayNight;

    if (fogRef.current) {
      fogRef.current.color.set(dayNight.fogColor);
      const targetNear = dayNight.fogNear * (1 / weather.fogMultiplier);
      const targetFar = dayNight.fogFar * (1 / weather.fogMultiplier);
      fogRef.current.near = THREE.MathUtils.lerp(fogRef.current.near, targetNear, delta * 0.5);
      fogRef.current.far = THREE.MathUtils.lerp(fogRef.current.far, targetFar, delta * 0.5);
    }

    if (scene.background instanceof THREE.Color) {
      scene.background.set(dayNight.fogColor);
    }
  });

  const initialState = dayNightStore.getState();

  return (
    <>
      <color attach="background" args={[initialState.fogColor]} />
      <fog
        ref={fogRef}
        attach="fog"
        args={[initialState.fogColor, initialState.fogNear, initialState.fogFar]}
      />
      <Sky
        distance={450000}
        sunPosition={initialState.sunPosition}
        inclination={0.48}
        azimuth={0.25}
        turbidity={3.8}
        rayleigh={initialState.isNight ? 0.2 : 1.25}
        mieCoefficient={0.004}
        mieDirectionalG={0.86}
      />
    </>
  );
}
