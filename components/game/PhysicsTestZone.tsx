"use client";

import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";

/**
 * Playable Physics Test Zone for OPENVERSE (Phase 3).
 *
 * Implements a small, high-fidelity testing area with real physical collisions:
 * - Ground terrain plane
 * - Testing road strip with curbs
 * - Solid concrete walls (stopping and diagonal sliding tests)
 * - Walk-in outpost shelter with open doorway
 * - Step-up stairs and inclined ramp
 * - Multi-tiered elevated platforms (jumping, falling, landing)
 * - Gap jump challenge (platform-to-platform leap)
 * - Dynamic interactive pushable crates
 * - Natural rock formations
 * - High drop ledge into void test (recovers at y < -20)
 */
export function PhysicsTestZone() {
  return (
    <group name="physics-test-zone">
      {/* ======================================================== */}
      {/* 1. MAIN GROUND & SPAWN PLAZA                             */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} name="main-ground-rigidbody">
        {/* Solid ground collider extending 140m x 140m */}
        <CuboidCollider args={[70, 0.5, 70]} position={[0, -0.5, 0]} />
        <mesh position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[140, 140]} />
          <meshStandardMaterial color="#1a2520" roughness={0.9} metalness={0.05} />
        </mesh>
      </RigidBody>

      {/* Spawn Plaza Pad (At spawn position [0, 0, 8]) */}
      <group position={[0, 0, 8]}>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[4.2, 4.5, 0.04, 32]} />
          <meshStandardMaterial color="#22332c" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Glowing center indicator ring */}
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.15, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. PAVED TESTING ROAD (Sprint, Turn & Stop Distance)     */}
      {/* ======================================================== */}
      <group position={[0, 0, -8]}>
        {/* Road Surface Mesh */}
        <mesh position={[0, 0.015, 0]} receiveShadow>
          <planeGeometry args={[7, 72]} />
          <meshStandardMaterial color="#1e2229" roughness={0.8} />
        </mesh>
        {/* Road Center Dashes */}
        {[-30, -20, -10, 0, 10, 20, 30].map((zPos) => (
          <mesh key={zPos} position={[0, 0.025, zPos]} receiveShadow>
            <planeGeometry args={[0.3, 4]} />
            <meshStandardMaterial color="#facc15" roughness={0.5} />
          </mesh>
        ))}

        {/* East Road Curb */}
        <RigidBody type="fixed" colliders={false} position={[3.6, 0.1, 0]}>
          <CuboidCollider args={[0.2, 0.1, 36]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.2, 72]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* West Road Curb */}
        <RigidBody type="fixed" colliders={false} position={[-3.6, 0.1, 0]}>
          <CuboidCollider args={[0.2, 0.1, 36]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.2, 72]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        </RigidBody>
      </group>

      {/* ======================================================== */}
      {/* 3. WALLS & OBSTACLE BARRIERS                             */}
      {/* ======================================================== */}
      {/* High Solid Wall (East side) - Tests stopping & sliding */}
      <RigidBody type="fixed" colliders={false} position={[16, 1.75, 0]}>
        <CuboidCollider args={[0.3, 1.75, 12]} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 3.5, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.85} />
        </mesh>
        {/* Wall base accent stripe */}
        <mesh position={[-0.31, -1.5, 0]}>
          <planeGeometry args={[0.01, 0.3]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.4} />
        </mesh>
      </RigidBody>

      {/* Angled Barrier Wall - Tests diagonal sliding deflection */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[10, 1.25, -20]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <CuboidCollider args={[0.25, 1.25, 6]} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 2.5, 12]} />
          <meshStandardMaterial color="#3f4a56" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Slalom Bollards (Tight navigation & collision) */}
      {[-8, -4, 0, 4].map((zOffset, idx) => (
        <RigidBody key={idx} type="fixed" colliders={false} position={[-7, 0.7, zOffset * 2 - 5]}>
          <CylinderCollider args={[0.7, 0.35]} />
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.35, 1.4, 20]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.2} />
          </mesh>
        </RigidBody>
      ))}

      {/* ======================================================== */}
      {/* 4. WALK-IN OUTPOST SHELTER (Building with Open Doorway)  */}
      {/* ======================================================== */}
      <group position={[-18, 0, 2]}>
        {/* Floor Pad */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.05, 0]}>
          <CuboidCollider args={[4.5, 0.05, 4]} />
          <mesh receiveShadow>
            <boxGeometry args={[9, 0.1, 8]} />
            <meshStandardMaterial color="#2a333d" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Back Wall */}
        <RigidBody type="fixed" colliders={false} position={[-4.25, 1.6, 0]}>
          <CuboidCollider args={[0.25, 1.5, 4]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 3.0, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Left Side Wall */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.6, 3.75]}>
          <CuboidCollider args={[4, 1.5, 0.25]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[8, 3.0, 0.5]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Right Side Wall */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.6, -3.75]}>
          <CuboidCollider args={[4, 1.5, 0.25]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[8, 3.0, 0.5]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Front Wall (Left segment of entrance) */}
        <RigidBody type="fixed" colliders={false} position={[4.25, 1.6, 2.2]}>
          <CuboidCollider args={[0.25, 1.5, 1.5]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 3.0, 3.0]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Front Wall (Right segment of entrance) */}
        <RigidBody type="fixed" colliders={false} position={[4.25, 1.6, -2.2]}>
          <CuboidCollider args={[0.25, 1.5, 1.5]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 3.0, 3.0]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Doorway Header Beam (Height clearance 2.4m) */}
        <RigidBody type="fixed" colliders={false} position={[4.25, 2.7, 0]}>
          <CuboidCollider args={[0.25, 0.4, 1.0]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.8, 2.0]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Roof Slab */}
        <RigidBody type="fixed" colliders={false} position={[0, 3.2, 0]}>
          <CuboidCollider args={[4.5, 0.2, 4]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[9, 0.4, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </RigidBody>
      </group>

      {/* ======================================================== */}
      {/* 5. ELEVATED PLATFORMS, STAIRS & INCLINED RAMPS           */}
      {/* ======================================================== */}
      {/* Step-Up Stairs (Heights: 0.25m, 0.5m, 0.75m, 1.0m) */}
      <group position={[-12, 0, -22]}>
        {[
          { y: 0.125, h: 0.25, z: 0 },
          { y: 0.25, h: 0.5, z: -1.2 },
          { y: 0.375, h: 0.75, z: -2.4 },
          { y: 0.5, h: 1.0, z: -3.6 },
        ].map((step, i) => (
          <RigidBody key={i} type="fixed" colliders={false} position={[0, step.y, step.z]}>
            <CuboidCollider args={[1.5, step.h / 2, 0.6]} />
            <mesh castShadow receiveShadow>
              <boxGeometry args={[3.0, step.h, 1.2]} />
              <meshStandardMaterial color="#384959" roughness={0.75} />
            </mesh>
          </RigidBody>
        ))}

        {/* Platform top landing (Height: 1.0m, Length: 4m) */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.5, -6.6]}>
          <CuboidCollider args={[2.0, 0.5, 2.0]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.0, 1.0, 4.0]} />
            <meshStandardMaterial color="#2d3b48" roughness={0.7} />
          </mesh>
        </RigidBody>
      </group>

      {/* Smooth Inclined Ramp (Walk up to 2.0m height without jump) */}
      <group position={[14, 0, -32]}>
        {/* Ramp Slab (Length 8m, Rise 2.0m -> ~14° incline) */}
        <RigidBody
          type="fixed"
          colliders={false}
          position={[0, 1.0, 0]}
          rotation={[0.245, 0, 0]} // ~14 degrees incline
        >
          <CuboidCollider args={[1.8, 0.1, 4.12]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.6, 0.2, 8.24]} />
            <meshStandardMaterial color="#3d4e5e" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Elevated Deck at top of ramp (Height: 2.0m) */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.0, -6.5]}>
          <CuboidCollider args={[2.5, 1.0, 2.5]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.0, 2.0, 5.0]} />
            <meshStandardMaterial color="#2b3844" roughness={0.7} />
          </mesh>
        </RigidBody>
      </group>

      {/* High Observation Tower & Falling Drop Ledge (Height: 4.0m) */}
      <group position={[24, 0, -10]}>
        <RigidBody type="fixed" colliders={false} position={[0, 2.0, 0]}>
          <CuboidCollider args={[3.5, 2.0, 3.5]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.0, 4.0, 7.0]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
        </RigidBody>
        {/* Ledge Caution Stripe */}
        <mesh position={[-3.52, 3.9, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.01, 0.3]} />
          <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Gap Jump Challenge (2.2m gap between two 2.5m high pedestals) */}
      <group position={[-2, 0, -38]}>
        {/* Pedestal 1 */}
        <RigidBody type="fixed" colliders={false} position={[-2.4, 1.25, 0]}>
          <CuboidCollider args={[1.5, 1.25, 1.5]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.0, 2.5, 3.0]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Pedestal 2 across 2.2m gap */}
        <RigidBody type="fixed" colliders={false} position={[2.8, 1.25, 0]}>
          <CuboidCollider args={[1.5, 1.25, 1.5]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.0, 2.5, 3.0]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        </RigidBody>
      </group>

      {/* ======================================================== */}
      {/* 6. DYNAMIC PUSHABLE CRATES                               */}
      {/* ======================================================== */}
      <group position={[8, 0.5, 10]}>
        <RigidBody
          type="dynamic"
          colliders={false}
          position={[0, 0.45, 0]}
          mass={25}
          linearDamping={0.4}
          angularDamping={0.4}
        >
          <CuboidCollider args={[0.45, 0.45, 0.45]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color="#854d0e" roughness={0.7} metalness={0.1} />
          </mesh>
        </RigidBody>

        <RigidBody
          type="dynamic"
          colliders={false}
          position={[1.2, 0.45, 0.4]}
          mass={25}
          linearDamping={0.4}
          angularDamping={0.4}
        >
          <CuboidCollider args={[0.45, 0.45, 0.45]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color="#a16207" roughness={0.7} metalness={0.1} />
          </mesh>
        </RigidBody>
      </group>

      {/* ======================================================== */}
      {/* 7. NATURAL ROCK FORMATIONS (Physical Colliders)          */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[-25, 1.4, -18]}>
        <CuboidCollider args={[2.2, 1.4, 2.0]} />
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[2.5, 1]} />
          <meshStandardMaterial color="#2d3732" roughness={0.92} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders={false} position={[28, 1.8, 18]}>
        <CuboidCollider args={[2.6, 1.8, 2.4]} />
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[3.2, 1]} />
          <meshStandardMaterial color="#26312b" roughness={0.9} />
        </mesh>
      </RigidBody>
    </group>
  );
}
