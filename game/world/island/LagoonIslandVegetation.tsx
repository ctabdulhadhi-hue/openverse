"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { PalmTree } from "../architecture/PalmTree";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { LAGOON_ISLE_ORIGIN } from "./lagoonIslandData";

export interface LagoonIslandVegetationProps {
  origin?: [number, number, number];
}

/**
 * Lagoon Island Tropical Vegetation & Palm Forests.
 *
 * Implements:
 * - Whispering Palm Grove: Dense coconut palm clusters with undergrowth
 * - Shoreline palms along Turquoise Lagoon Beach
 * - Village shade palms and garden flora
 * - Natural driftwood logs and decorative coral boulders
 */
export function LagoonIslandVegetation({
  origin = LAGOON_ISLE_ORIGIN,
}: LagoonIslandVegetationProps) {
  const [ox, oy, oz] = origin;

  // Whispering Palm Grove coordinates (local: around [-45, 0, -30])
  const forestPalms = [
    { pos: [-42, 0.4, -28] as [number, number, number], scale: 1.25 },
    { pos: [-48, 0.4, -32] as [number, number, number], scale: 1.15 },
    { pos: [-38, 0.4, -36] as [number, number, number], scale: 0.95 },
    { pos: [-52, 0.4, -25] as [number, number, number], scale: 1.3 },
    { pos: [-46, 0.4, -18] as [number, number, number], scale: 1.05 },
    { pos: [-55, 0.4, -35] as [number, number, number], scale: 1.1 },
    { pos: [-35, 0.4, -22] as [number, number, number], scale: 1.0 },
    { pos: [-40, 0.4, -42] as [number, number, number], scale: 1.2 },
  ];

  // Beach palms along Turquoise Beach (local: around [-25, 0, 20])
  const beachPalms = [
    { pos: [-22, 0.4, 15] as [number, number, number], scale: 1.05 },
    { pos: [-28, 0.4, 25] as [number, number, number], scale: 1.15 },
    { pos: [-18, 0.4, 28] as [number, number, number], scale: 0.9 },
    { pos: [-32, 0.4, 18] as [number, number, number], scale: 1.2 },
    { pos: [-26, 0.4, 32] as [number, number, number], scale: 1.0 },
  ];

  // Village palms (local: around [35, 0, -20])
  const villagePalms = [
    { pos: [30, 0.4, -12] as [number, number, number], scale: 1.1 },
    { pos: [42, 0.4, -15] as [number, number, number], scale: 1.0 },
    { pos: [26, 0.4, -26] as [number, number, number], scale: 1.2 },
    { pos: [44, 0.4, -28] as [number, number, number], scale: 0.95 },
  ];

  // Lagoon edge decorative palms
  const lagoonPalms = [
    { pos: [14, 0.4, -4] as [number, number, number], scale: 1.05 },
    { pos: [-12, 0.4, -12] as [number, number, number], scale: 1.15 },
    { pos: [8, 0.4, 12] as [number, number, number], scale: 0.95 },
  ];

  // Undergrowth tropical bushes
  const bushes: [number, number, number][] = [
    [-44, 0.4, -26],
    [-40, 0.4, -32],
    [-50, 0.4, -28],
    [-24, 0.4, 22],
    [-30, 0.4, 16],
    [32, 0.4, -18],
    [38, 0.4, -24],
  ];

  const coralRocks: [number, number, number, number][] = [
    [-15, 0.6, 28, 1.2],
    [-38, 0.6, 12, 1.4],
    [48, 1.2, 22, 1.6],
    [54, 5.2, 38, 1.5],
  ];

  return (
    <group position={[ox, oy, oz]} name="lagoon-island-vegetation">
      {/* 1. Whispering Palm Grove Trees */}
      {forestPalms.map((p, i) => (
        <PalmTree key={`f-palm-${i}`} position={p.pos} scale={p.scale} />
      ))}

      {/* 2. Turquoise Beach Palms */}
      {beachPalms.map((p, i) => (
        <PalmTree key={`b-palm-${i}`} position={p.pos} scale={p.scale} />
      ))}

      {/* 3. Village Surround Palms */}
      {villagePalms.map((p, i) => (
        <PalmTree key={`v-palm-${i}`} position={p.pos} scale={p.scale} />
      ))}

      {/* 4. Lagoon Rim Palms */}
      {lagoonPalms.map((p, i) => (
        <PalmTree key={`l-palm-${i}`} position={p.pos} scale={p.scale} />
      ))}

      {/* 5. Tropical Shrubs & Undergrowth */}
      {bushes.map(([bx, by, bz], i) => (
        <mesh key={`bush-${i}`} position={[bx, by + 0.35, bz]} castShadow receiveShadow>
          <sphereGeometry args={[0.7, 7, 7]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      ))}

      {/* 6. Weathered Driftwood Fallen Logs on Beach */}
      <RigidBody type="fixed" colliders={false} position={[-20, 0.45, 22]}>
        <CuboidCollider args={[0.25, 0.25, 2.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
          <cylinderGeometry args={[0.22, 0.28, 4.0, 8]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[-34, 0.45, 26]} rotation={[0, 0.6, 0]}>
        <CuboidCollider args={[0.25, 0.25, 1.8]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
          <cylinderGeometry args={[0.2, 0.25, 3.6, 8]} />
        </mesh>
      </RigidBody>

      {/* 7. Scenic Coral Boulders */}
      {coralRocks.map(([rx, ry, rz, scale], i) => (
        <RigidBody key={`coral-rock-${i}`} type="fixed" colliders={false} position={[rx, ry, rz]}>
          <CuboidCollider args={[scale * 0.8, scale * 0.7, scale * 0.8]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
            <dodecahedronGeometry args={[scale, 1]} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
