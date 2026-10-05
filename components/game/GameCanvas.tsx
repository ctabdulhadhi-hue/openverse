"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type * as THREE from "three";

import { CanvasLoader } from "./CanvasLoader";
import { Scene } from "./Scene";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

export interface GameCanvasProps {
  showDebugGrid?: boolean;
  freeCamera?: boolean;
  className?: string;
  onSceneReady?: () => void;
  onPlayerRuntimeUpdate?: (
    pos: THREE.Vector3,
    speed: number,
    stateName: string,
    yaw: number,
  ) => void;
}

/**
 * GameCanvas is the primary React Three Fiber canvas host.
 *
 * Architecture rules:
 * 1. Responsible for renderer initialization, camera setup, canvas sizing, and WebGL error handling.
 * 2. Does NOT contain gameplay logic, player state, or NPC systems.
 * 3. Future simulation systems connect via modular scene children or hooks.
 */
export function GameCanvas({
  showDebugGrid = false,
  freeCamera = false,
  className = "h-full w-full",
  onSceneReady,
  onPlayerRuntimeUpdate,
}: GameCanvasProps) {
  return (
    <div
      data-testid="game-canvas-container"
      className={`relative h-full w-full overflow-hidden bg-[color:var(--color-ov-night,#0a0f1d)] select-none ${className}`}
    >
      <WebGLErrorBoundary>
        <Suspense fallback={<CanvasLoader statusText="Preparing 3D environment..." />}>
          <Canvas
            shadows
            dpr={[1, 2]} // Limit DPR to 2 for optimal browser performance
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
            }}
            camera={{
              fov: 55,
              near: 0.1,
              far: 600,
              position: [0, 5, 12],
            }}
            onCreated={({ gl }) => {
              gl.setClearColor("#182330", 1);
              onSceneReady?.();
            }}
            className="h-full w-full outline-none"
          >
            <Scene
              showDebugGrid={showDebugGrid}
              freeCamera={freeCamera}
              onPlayerRuntimeUpdate={onPlayerRuntimeUpdate}
            />
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
