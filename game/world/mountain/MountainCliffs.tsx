"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Mountain switchback path, rocky ramps, and cliff tiers allowing the player
 * to physically hike from base (y ≈ 12m) to summit (y ≈ 36m).
 */
export function MountainCliffs() {
  return (
    <group name="mountain-switchback-trail">
      {/* Ramp 1: Foothills Ascent (y: 12.0m -> 20.0m) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-60, 16.0, -640]}
        rotation={[0.12, 0.4, 0]}
      >
        <CuboidCollider args={[4.5, 0.4, 38]} />
        <mesh receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[9, 0.8, 76]} />
        </mesh>
      </RigidBody>

      {/* Switchback Landing 1 (y = 20.0m) */}
      <RigidBody type="fixed" colliders={false} position={[-80, 20.0, -680]}>
        <CuboidCollider args={[10, 0.5, 10]} />
        <mesh receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[20, 1.0, 20]} />
        </mesh>
      </RigidBody>

      {/* Ramp 2: Mid-Ridge Switchback Eastbound (y: 20.0m -> 28.0m) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-20, 24.0, -690]}
        rotation={[0, 0, -0.12]}
      >
        <CuboidCollider args={[38, 0.4, 4.5]} />
        <mesh receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[76, 0.8, 9]} />
        </mesh>
      </RigidBody>

      {/* Switchback Landing 2 (y = 28.0m) */}
      <RigidBody type="fixed" colliders={false} position={[40, 28.0, -700]}>
        <CuboidCollider args={[10, 0.5, 10]} />
        <mesh receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[20, 1.0, 20]} />
        </mesh>
      </RigidBody>

      {/* Ramp 3: Final Summit Approach Trail (y: 28.0m -> 36.0m) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[20, 32.0, -715]}
        rotation={[-0.14, -0.3, 0]}
      >
        <CuboidCollider args={[4.5, 0.4, 28]} />
        <mesh receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[9, 0.8, 56]} />
        </mesh>
      </RigidBody>

      {/* Rocky Cliff Outcroppings (Decorative mountain depth) */}
      {(
        [
          [-120, 24.0, -730],
          [110, 26.0, -740],
          [-40, 34.0, -780],
          [50, 35.0, -770],
        ] as const
      ).map((c, idx) => (
        <RigidBody key={idx} type="fixed" colliders={false} position={[c[0], c[1], c[2]]}>
          <CuboidCollider args={[14, 10, 14]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
            <dodecahedronGeometry args={[16, 1]} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
