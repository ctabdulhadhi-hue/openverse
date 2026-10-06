"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

/**
 * Continuous Terrain base for OPENVERSE (Phase 4).
 * Provides a continuous, seamless landscape underpinning Town, Road, Forest, Mountain,
 * City, and Coast with solid static physics collision.
 */
export function ContinuousTerrain() {
  return (
    <group name="continuous-terrain">
      {/* ======================================================== */}
      {/* 1. CENTRAL VALLEY & TOWN MEADOW FOUNDATION (y ≈ 0.0 to 1.0) */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[0, -0.5, 0]}>
        <CuboidCollider args={[250, 0.5, 250]} />
        <mesh position={[0, 0.5, 0]} receiveShadow material={SHARED_MATERIALS.meadowGrass}>
          <planeGeometry args={[500, 500, 32, 32]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 2. PINE CREST FOREST HIGHER GROUND (y ≈ 3.0 to 6.0)     */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[-320, 1.5, -350]}>
        <CuboidCollider args={[220, 2.0, 200]} />
        <mesh position={[0, 2.0, 0]} receiveShadow material={SHARED_MATERIALS.forestGrass}>
          <boxGeometry args={[440, 4.0, 400]} />
        </mesh>
      </RigidBody>

      {/* Forest transitional gentle slope up */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-140, 1.25, -200]}
        rotation={[0, 0, 0.08]}
      >
        <CuboidCollider args={[60, 0.5, 120]} />
        <mesh receiveShadow material={SHARED_MATERIALS.meadowGrass}>
          <boxGeometry args={[120, 1.0, 240]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 3. CENTRAL CITY ELEVATED PLATEAU (y ≈ 2.0 to 4.0)       */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[380, 1.0, -400]}>
        <CuboidCollider args={[220, 1.5, 240]} />
        <mesh position={[0, 1.5, 0]} receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[440, 3.0, 480]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 4. SUNKEN COAST BEACH & SHORELINE (y ≈ 0.2 to 1.5)      */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[400, -0.25, 80]}>
        <CuboidCollider args={[200, 0.5, 220]} />
        <mesh position={[0, 0.5, 0]} receiveShadow material={SHARED_MATERIALS.beachSand}>
          <boxGeometry args={[400, 1.0, 440]} />
        </mesh>
      </RigidBody>

      {/* Coastal Bluffs (Rocky cliff edge between City plateau and Coast) */}
      <RigidBody type="fixed" colliders={false} position={[380, 1.5, -160]}>
        <CuboidCollider args={[180, 1.5, 20]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[360, 3.0, 40]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 5. MOUNT AETHEL FOOTHILLS & BASE SLOPES (y ≈ 8.0 to 20.0) */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[0, 6.0, -660]}>
        <CuboidCollider args={[350, 7.0, 160]} />
        <mesh position={[0, 7.0, 0]} receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[700, 14.0, 320]} />
        </mesh>
      </RigidBody>

      {/* Mountain Mid-Tier Ridge (y ≈ 20.0 to 32.0) */}
      <RigidBody type="fixed" colliders={false} position={[0, 18.0, -780]}>
        <CuboidCollider args={[240, 6.0, 100]} />
        <mesh position={[0, 6.0, 0]} receiveShadow material={SHARED_MATERIALS.cliffStone}>
          <boxGeometry args={[480, 12.0, 200]} />
        </mesh>
      </RigidBody>
    </group>
  );
}
