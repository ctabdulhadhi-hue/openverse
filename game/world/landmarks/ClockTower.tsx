"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";

export function ClockTower() {
  return (
    <group position={[0, 0, 0]} name="landmark-town-clock-tower">
      {/* Base Plinth / Steps */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.4, 0]}>
        <CuboidCollider args={[4, 0.4, 4]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.plazaCobble}>
          <boxGeometry args={[8, 0.8, 8]} />
        </mesh>
      </RigidBody>

      {/* Main Stone Shaft */}
      <RigidBody type="fixed" colliders={false} position={[0, 6.0, 0]}>
        <CuboidCollider args={[2.2, 5.2, 2.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingTan}>
          <boxGeometry args={[4.4, 10.4, 4.4]} />
        </mesh>
      </RigidBody>

      {/* Clock Chamber */}
      <group position={[0, 12.0, 0]}>
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[5.0, 3.2, 5.0]} />
        </mesh>
        {/* 4 Clock Faces (North, South, East, West) */}
        {[
          {
            pos: [0, 0, 2.52] as [number, number, number],
            rot: [0, 0, 0] as [number, number, number],
          },
          {
            pos: [0, 0, -2.52] as [number, number, number],
            rot: [0, Math.PI, 0] as [number, number, number],
          },
          {
            pos: [2.52, 0, 0] as [number, number, number],
            rot: [0, Math.PI / 2, 0] as [number, number, number],
          },
          {
            pos: [-2.52, 0, 0] as [number, number, number],
            rot: [0, -Math.PI / 2, 0] as [number, number, number],
          },
        ].map((face, i) => (
          <mesh key={i} position={face.pos} rotation={face.rot}>
            <circleGeometry args={[1.1, 24]} />
            <meshStandardMaterial color="#fef08a" emissive="#ca8a04" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Pyramidal Roof Spire */}
      <mesh position={[0, 15.5, 0]} castShadow material={SHARED_MATERIALS.roofSlate}>
        <coneGeometry args={[3.2, 4.5, 4]} />
      </mesh>

      {/* Spire Weather Vane / Finial */}
      <mesh position={[0, 18.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
