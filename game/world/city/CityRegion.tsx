"use client";

import { CentralSpire } from "../landmarks/CentralSpire";
import { SHARED_MATERIALS } from "../WorldMaterials";
import { CityTower } from "./CitySkyline";

/**
 * Central City Region for OPENVERSE (Phase 4).
 * Urban district with paved avenues, civic plaza, multi-story towers, and Central Spire.
 */
export function CityRegion() {
  return (
    <group name="city-region">
      {/* Central Spire Landmark & Civic Plaza */}
      <CentralSpire />

      {/* Urban Commercial Towers */}
      {/* North Block */}
      <CityTower
        position={[330, 2.8, -490]}
        width={18}
        height={28}
        depth={18}
        materialColor="blue"
      />
      <CityTower
        position={[430, 2.8, -490]}
        width={20}
        height={34}
        depth={20}
        materialColor="white"
      />

      {/* South Block */}
      <CityTower
        position={[330, 2.8, -350]}
        width={16}
        height={22}
        depth={18}
        materialColor="tan"
      />
      <CityTower
        position={[430, 2.8, -350]}
        width={18}
        height={26}
        depth={18}
        materialColor="blue"
      />

      {/* East Flank */}
      <CityTower
        position={[500, 2.8, -420]}
        width={22}
        height={38}
        depth={20}
        materialColor="white"
      />
      <CityTower
        position={[500, 2.8, -490]}
        width={18}
        height={30}
        depth={18}
        materialColor="blue"
      />

      {/* West Flank (Towards Highway Approach) */}
      <CityTower
        position={[270, 2.8, -420]}
        width={16}
        height={20}
        depth={16}
        materialColor="tan"
      />
      <CityTower
        position={[270, 2.8, -360]}
        width={16}
        height={24}
        depth={16}
        materialColor="white"
      />

      {/* Urban Street Lamps */}
      {(
        [
          [360, 2.8, -460],
          [360, 2.8, -380],
          [400, 2.8, -460],
          [400, 2.8, -380],
        ] as const
      ).map((lamp, idx) => (
        <group key={idx} position={[lamp[0], lamp[1], lamp[2]]}>
          <mesh castShadow material={SHARED_MATERIALS.curbConcrete}>
            <cylinderGeometry args={[0.1, 0.14, 6, 8]} />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
