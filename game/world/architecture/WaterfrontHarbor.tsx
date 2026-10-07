"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { DhowBoat } from "./DhowBoat";
import { GhatSteps } from "./GhatSteps";

export interface WaterfrontHarborProps {
  position?: [number, number, number];
}

/**
 * Royal Waterfront Promenade and Merchant Harbor of Varanaya.
 *
 * Dense, vibrant waterfront maritime district.
 * Features:
 * - Elevated stone quay promenade with carved balustrades
 * - Broad monumental Ghat steps descending directly into the turquoise ocean
 * - Wooden docking piers extending out over the water with solid colliders
 * - Moored sailing dhow boats with billowing sails and cargo crates
 * - Merchant stalls with colorful fabric awnings (saffron, indigo, ivory)
 * - Maritime harbor watchtower with golden chhatri dome
 */
export function WaterfrontHarbor({ position = [28, 0, 10] }: WaterfrontHarborProps) {
  return (
    <group position={position} name="waterfront-harbor">
      {/* ======================================================== */}
      {/* 1. ELEVATED QUAY PROMENADE (Stone Esplanade)             */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.7, 10]}>
        <CuboidCollider args={[8.0, 0.7, 35.0]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[16.0, 1.4, 70.0]} />
        </mesh>
      </RigidBody>

      {/* Decorative Paved Promenade Surface */}
      <mesh
        position={[0, 1.42, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={SHARED_MATERIALS.plazaCobble}
      >
        <planeGeometry args={[15.6, 69.6]} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. SACRED GHAT STEPS (Descending into the Water)         */}
      {/* ======================================================== */}
      {/* Ghat Flight 1 (Leading down to sea level) */}
      <GhatSteps
        position={[14.0, 0, -8]}
        rotation={[0, -Math.PI / 2, 0]}
        width={18}
        stepCount={8}
        stepDepth={1.0}
        stepHeight={0.2}
      />

      {/* Ghat Flight 2 (Second descent) */}
      <GhatSteps
        position={[14.0, 0, 26]}
        rotation={[0, -Math.PI / 2, 0]}
        width={18}
        stepCount={8}
        stepDepth={1.0}
        stepHeight={0.2}
      />

      {/* ======================================================== */}
      {/* 3. EXTENDING WOODEN MOORING PIERS (Walkable onto water)   */}
      {/* ======================================================== */}
      {/* Pier 1 (North Dock at Z = -16, X extending to +28) */}
      <group position={[14, 0.4, -20]}>
        <RigidBody type="fixed" colliders={false} position={[10, 0.2, 0]}>
          <CuboidCollider args={[10, 0.2, 2.0]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[20, 0.4, 4.0]} />
          </mesh>
        </RigidBody>
        {/* Support Pilings */}
        {[2, 7, 12, 17].map((px) => (
          <group key={px} position={[px, 0, 0]}>
            <mesh position={[0, -0.4, 1.8]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
            <mesh position={[0, -0.4, -1.8]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Pier 2 (South Dock at Z = 42, X extending to +30) */}
      <group position={[14, 0.4, 38]}>
        <RigidBody type="fixed" colliders={false} position={[11, 0.2, 0]}>
          <CuboidCollider args={[11, 0.2, 2.2]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[22, 0.4, 4.4]} />
          </mesh>
        </RigidBody>
        {[3, 9, 15, 20].map((px) => (
          <group key={px} position={[px, 0, 0]}>
            <mesh position={[0, -0.4, 2.0]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
            <mesh position={[0, -0.4, -2.0]} material={SHARED_MATERIALS.treeTrunk}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 4. MOORED SAILING DHOW SHIPS                             */}
      {/* ======================================================== */}
      <DhowBoat position={[28, 0.1, -26]} rotation={[0, -0.2, 0]} scale={1.15} sailColor="ivory" />
      <DhowBoat position={[30, 0.1, 46]} rotation={[0, 0.35, 0]} scale={1.2} sailColor="saffron" />
      <DhowBoat position={[36, 0.1, -12]} rotation={[0, 1.4, 0]} scale={1.05} sailColor="blue" />

      {/* ======================================================== */}
      {/* 5. HARBOR WATCHTOWER & LIGHT BEACON                      */}
      {/* ======================================================== */}
      <group position={[6.0, 1.4, -22]}>
        {/* Tower Body */}
        <RigidBody type="fixed" colliders={false} position={[0, 6.0, 0]}>
          <CuboidCollider args={[2.5, 6.0, 2.5]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <cylinderGeometry args={[2.4, 2.8, 12.0, 8]} />
          </mesh>
        </RigidBody>
        {/* Crowning Chhatri with Beacon Light */}
        <ChhatriPavilion position={[0, 12.0, 0]} scale={1.1} materialType="sandstone" />
        <mesh position={[0, 14.5, 0]}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. WATERFRONT MARKET STALLS & FABRIC CANOPIES            */}
      {/* ======================================================== */}
      {[
        { z: -2, col: SHARED_MATERIALS.bannerSaffron },
        { z: 6, col: SHARED_MATERIALS.bannerRoyalBlue },
        { z: 14, col: SHARED_MATERIALS.bannerGold },
        { z: 22, col: SHARED_MATERIALS.buildingWhite },
      ].map((stall, si) => (
        <group key={`stall-${si}`} position={[-2.5, 1.4, stall.z]}>
          {/* Stall Counter Table */}
          <RigidBody type="fixed" colliders={false} position={[0, 0.5, 0]}>
            <CuboidCollider args={[1.5, 0.5, 1.0]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.pierWood}>
              <boxGeometry args={[3.0, 1.0, 2.0]} />
            </mesh>
          </RigidBody>
          {/* Corner Awning Posts */}
          {[-1.3, 1.3].map((ax) =>
            [-0.8, 0.8].map((az) => (
              <mesh
                key={`${ax}-${az}`}
                position={[ax, 1.6, az]}
                material={SHARED_MATERIALS.treeTrunk}
              >
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
              </mesh>
            )),
          )}
          {/* Sloped Fabric Awning Canopy */}
          <mesh position={[0, 2.7, 0]} rotation={[0.15, 0, 0]} material={stall.col}>
            <boxGeometry args={[3.2, 0.08, 2.2]} />
          </mesh>
        </group>
      ))}

      {/* Stacked Cargo Crates and Spice Urns */}
      {(
        [
          [-5.0, 1.4, -10],
          [-5.0, 1.4, 30],
          [8.0, 1.4, 34],
        ] as const
      ).map((cPos, ci) => (
        <group key={`cargo-${ci}`} position={[cPos[0], cPos[1], cPos[2]]}>
          <mesh position={[0, 0.45, 0]} castShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[1.2, 0.9, 1.2]} />
          </mesh>
          <mesh position={[0.7, 0.35, 0.4]} castShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
          </mesh>
          <mesh position={[-0.4, 0.5, 0.8]} castShadow material={SHARED_MATERIALS.deepSandstone}>
            <cylinderGeometry args={[0.35, 0.4, 1.0, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
