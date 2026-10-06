"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Mountain Landmark: Mount Aethel Overlook Platform.
 * Summit viewpoint platform at [0, 36, -720] offering panoramic views over OPENVERSE.
 */
export function MountainOverlook() {
  return (
    <group position={[0, 36.0, -720]} name="landmark-mountain-overlook">
      {/* Observation Deck Foundation Plinth */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.4, 0]}>
        <CuboidCollider args={[8, 0.4, 8]} />
        <mesh receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[16, 0.8, 16]} />
        </mesh>
      </RigidBody>

      {/* Wooden Deck Surface */}
      <mesh position={[0, 0.85, 0]} receiveShadow material={SHARED_MATERIALS.pierWood}>
        <boxGeometry args={[15.6, 0.1, 15.6]} />
      </mesh>

      {/* Safety Railings (North, South, East, West) */}
      {[
        {
          pos: [0, 1.45, 7.8] as [number, number, number],
          args: [7.8, 0.5, 0.15] as [number, number, number],
        },
        {
          pos: [0, 1.45, -7.8] as [number, number, number],
          args: [7.8, 0.5, 0.15] as [number, number, number],
        },
        {
          pos: [7.8, 1.45, 0] as [number, number, number],
          args: [0.15, 0.5, 7.8] as [number, number, number],
        },
        {
          pos: [-7.8, 1.45, 0] as [number, number, number],
          args: [0.15, 0.5, 7.8] as [number, number, number],
        },
      ].map((rail, i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={rail.pos}>
          <CuboidCollider args={rail.args} />
          <mesh castShadow material={SHARED_MATERIALS.curbConcrete}>
            <boxGeometry args={[rail.args[0] * 2, rail.args[1] * 2, rail.args[2] * 2]} />
          </mesh>
        </RigidBody>
      ))}

      {/* Summit Marker Beacon / Monolith in center */}
      <RigidBody type="fixed" colliders={false} position={[0, 3.0, 0]}>
        <CuboidCollider args={[0.8, 2.0, 0.8]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[1.6, 4.0, 1.6]} />
        </mesh>
      </RigidBody>
      {/* Beacon Glow */}
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.0} />
      </mesh>
    </group>
  );
}
