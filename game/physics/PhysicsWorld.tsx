"use client";

import { Physics } from "@react-three/rapier";
import { type ReactNode, Suspense } from "react";

import { DEFAULT_PHYSICS_CONFIG } from "./PhysicsConfig";

export interface PhysicsWorldProps {
  children: ReactNode;
  gravity?: [number, number, number];
  timeStep?: number | "vary";
  paused?: boolean;
  debug?: boolean;
  interpolate?: boolean;
}

/**
 * Rapier Physics World host for OPENVERSE.
 * Wraps @react-three/rapier Physics provider with centralized configuration
 * and safe async initialization.
 */
export function PhysicsWorld({
  children,
  gravity = DEFAULT_PHYSICS_CONFIG.gravity,
  timeStep = DEFAULT_PHYSICS_CONFIG.timeStep,
  paused = false,
  debug = DEFAULT_PHYSICS_CONFIG.debug,
  interpolate = DEFAULT_PHYSICS_CONFIG.interpolate,
}: PhysicsWorldProps) {
  return (
    <Suspense fallback={null}>
      <Physics
        gravity={gravity}
        timeStep={timeStep}
        paused={paused}
        debug={debug}
        interpolate={interpolate}
        colliders={false}
      >
        {children}
      </Physics>
    </Suspense>
  );
}
