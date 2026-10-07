"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface GhatStepsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  stepCount?: number;
  stepDepth?: number;
  stepHeight?: number;
}

/**
 * GhatSteps Module (Monumental Sacred Waterfront Steps).
 * Allows players to walk seamlessly down from city promenades to the water's edge.
 * Features:
 * - Wide sandstone stepped terraces
 * - Solid Rapier colliders for smooth, walkable descent
 * - Weathered wet stone transition at the bottom
 */
export function GhatSteps({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 24.0,
  stepCount = 10,
  stepDepth = 1.2,
  stepHeight = 0.35,
}: GhatStepsProps) {
  return (
    <group position={position} rotation={rotation} name="ghat-steps">
      {Array.from({ length: stepCount }).map((_, i) => {
        const stepY = (stepCount - i) * stepHeight;
        const stepZ = i * stepDepth;

        return (
          <RigidBody
            key={`step-${i}`}
            type="fixed"
            colliders={false}
            position={[0, stepY - stepHeight / 2, stepZ]}
          >
            <CuboidCollider args={[width / 2, stepHeight / 2, stepDepth / 2]} />
            <mesh
              castShadow
              receiveShadow
              material={
                i > stepCount - 3 ? SHARED_MATERIALS.carvedStone : SHARED_MATERIALS.warmSandstone
              }
            >
              <boxGeometry args={[width, stepHeight, stepDepth]} />
            </mesh>
          </RigidBody>
        );
      })}

      {/* Flanking Decorative Stone Balustrades */}
      {[-width / 2 - 0.4, width / 2 + 0.4].map((bx, bi) => (
        <group key={`balustrade-${bi}`} position={[bx, 0, (stepCount * stepDepth) / 2]}>
          <RigidBody type="fixed" colliders={false} position={[0, (stepCount * stepHeight) / 2, 0]}>
            <CuboidCollider
              args={[0.3, (stepCount * stepHeight) / 2 + 0.3, (stepCount * stepDepth) / 2]}
            />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
              <boxGeometry
                args={[0.6, stepCount * stepHeight + 0.6, stepCount * stepDepth + 0.4]}
              />
            </mesh>
          </RigidBody>
        </group>
      ))}
    </group>
  );
}
