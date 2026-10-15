"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { dayNightStore } from "@/game/dayNight/DayNightSystem";

/**
 * Dynamic lighting setup with directional sunlight & moonlight,
 * day/night progression, ambient bounce, and soft shadows.
 */
export function Lighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);

  useFrame((_, delta) => {
    // Tick the world day/night simulation
    dayNightStore.update(delta);
    const state = dayNightStore.getState();

    if (sunRef.current) {
      sunRef.current.position.set(state.sunPosition[0], state.sunPosition[1], state.sunPosition[2]);
      sunRef.current.color.set(state.sunColor);
      sunRef.current.intensity = THREE.MathUtils.lerp(
        sunRef.current.intensity,
        state.sunIntensity,
        delta * 2.0,
      );
    }

    if (ambientRef.current) {
      ambientRef.current.color.set(state.ambientColor);
      ambientRef.current.intensity = state.ambientIntensity;
    }

    if (hemiRef.current) {
      hemiRef.current.color.set(state.hemisphereSkyColor);
      hemiRef.current.groundColor.set(state.hemisphereGroundColor);
    }
  });

  const initialState = dayNightStore.getState();

  return (
    <>
      {/* Sky/ground ambient light for natural fill and sandstone bounce */}
      <hemisphereLight
        ref={hemiRef}
        args={[initialState.hemisphereSkyColor, initialState.hemisphereGroundColor, 0.72]}
      />

      <ambientLight
        ref={ambientRef}
        intensity={initialState.ambientIntensity}
        color={initialState.ambientColor}
      />

      {/* Main celestial directional light casting real-time shadows */}
      <directionalLight
        ref={sunRef}
        position={initialState.sunPosition}
        intensity={initialState.sunIntensity}
        color={initialState.sunColor}
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
      <directionalLight position={[70, 12, 28]} intensity={0.35} color="#38bdf8" />

      {/* Subtle warm rim light for architectural edge definition and depth */}
      <directionalLight position={[-50, 35, -40]} intensity={0.4} color="#fed7aa" />
    </>
  );
}
