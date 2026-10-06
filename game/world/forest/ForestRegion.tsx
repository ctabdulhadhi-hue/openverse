"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

import { AncientTree } from "../landmarks/AncientTree";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { seededRandom } from "../WorldUtils";
import { PineTree } from "./ForestTrees";

/**
 * Pine Crest Forest Region for OPENVERSE (Phase 4).
 * Dense woodland with winding trails, clearings, and the Ancient Tree landmark.
 */
export function ForestRegion() {
  // Deterministic tree distribution
  const treePositions = useMemo(() => {
    const rng = seededRandom(42);
    const list: Array<{ pos: [number, number, number]; scale: number }> = [];

    // Grid cells with jitter
    for (let x = -500; x <= -130; x += 45) {
      for (let z = -500; z <= -180; z += 45) {
        // Leave clearing open around Ancient Tree landmark [-280, -380]
        const distToClearing = Math.hypot(x - -280, z - -380);
        if (distToClearing < 45) continue;

        // Leave main trail open around [-270, -350]
        const distToRoad = Math.hypot(x - -130, z - -260);
        if (distToRoad < 20) continue;

        const jX = x + (rng() - 0.5) * 25;
        const jZ = z + (rng() - 0.5) * 25;
        const scale = 0.8 + rng() * 0.5;
        list.push({ pos: [jX, 3.8, jZ], scale });
      }
    }
    return list;
  }, []);

  return (
    <group name="forest-region">
      {/* Ancient Tree Landmark and Sacred Clearing */}
      <AncientTree />

      {/* Forest Trees */}
      {treePositions.map((t, idx) => (
        <PineTree key={idx} position={t.pos} scale={t.scale} />
      ))}

      {/* Fallen Mossy Log Obstacle in Clearing (Tests vaulting / jumping) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-265, 4.3, -370]}
        rotation={[0, 0.4, Math.PI / 2]}
      >
        <CuboidCollider args={[0.5, 4.5, 0.5]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.treeTrunk}>
          <cylinderGeometry args={[0.5, 0.6, 9.0, 10]} />
        </mesh>
      </RigidBody>

      {/* Natural Forest Boulders */}
      {(
        [
          [-295, 4.8, -360],
          [-250, 4.6, -395],
          [-310, 4.9, -400],
        ] as const
      ).map((b, bIdx) => (
        <RigidBody key={bIdx} type="fixed" colliders={false} position={[b[0], b[1], b[2]]}>
          <CuboidCollider args={[2.0, 1.2, 1.8]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.cliffStone}>
            <dodecahedronGeometry args={[2.2, 1]} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
