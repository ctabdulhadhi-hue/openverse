"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { BannersAndFlags } from "./BannersAndFlags";
import { ChhatriPavilion } from "./ChhatriPavilion";
import { JharokhaBalcony } from "./JharokhaBalcony";

export interface GrandSeaGateProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Grand Sea Gate of Varanaya (Monumental Ceremonial City Gate).
 * The dramatic portal between the royal promenade and the outer approaches.
 * Features:
 * - Colossal twin defensive bastion towers with golden dome chhatris
 * - Monumental cusped archway portal (open and fully walkable through)
 * - Upper rampart walkway with carved stone balustrades
 * - Fluttering royal silk banners and carved jharokha balconies
 * - Solid colliders with traversable arch passage
 */
export function GrandSeaGate({
  position = [-26, 0, 10],
  rotation = [0, Math.PI / 2, 0],
}: GrandSeaGateProps) {
  const gateHeight = 12.0;
  const towerHeight = 16.0;
  const archWidth = 7.0;
  const archHeight = 8.5;
  const wallThickness = 4.0;
  const towerRadius = 4.2;
  const flankSpan = 9.0;

  return (
    <group position={position} rotation={rotation} name="grand-sea-gate">
      {/* ======================================================== */}
      {/* 1. TWIN FLANKING BASTION TOWERS (North and South)        */}
      {/* ======================================================== */}
      {[-flankSpan, flankSpan].map((tz, idx) => (
        <group key={idx} position={[0, 0, tz]}>
          {/* Main Tower Body */}
          <RigidBody type="fixed" colliders={false} position={[0, towerHeight / 2, 0]}>
            <CuboidCollider args={[towerRadius, towerHeight / 2, towerRadius]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <cylinderGeometry args={[towerRadius * 0.9, towerRadius, towerHeight, 12]} />
            </mesh>
          </RigidBody>

          {/* Decorative Molded Cornices */}
          <mesh position={[0, towerHeight - 0.5, 0]} material={SHARED_MATERIALS.carvedStone}>
            <cylinderGeometry args={[towerRadius * 1.1, towerRadius * 0.9, 0.8, 12]} />
          </mesh>

          {/* Crowning Chhatri Pavilion on Tower Roof */}
          <ChhatriPavilion position={[0, towerHeight, 0]} scale={1.3} materialType="sandstone" />

          {/* Banners on Tower Battlements */}
          <BannersAndFlags
            position={[0, towerHeight + 4.5, 0]}
            height={7}
            color={idx === 0 ? "saffron" : "blue"}
          />
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GATEWAY CURTAIN WALLS FLANKING THE CENTRAL ARCH       */}
      {/* ======================================================== */}
      {/* Left Wall Segment (between left tower and portal) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, gateHeight / 2, (-flankSpan + archWidth / 2) / 2 - 1.2]}
      >
        <CuboidCollider args={[wallThickness / 2, gateHeight / 2, 2.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[wallThickness, gateHeight, 4.4]} />
        </mesh>
      </RigidBody>

      {/* Right Wall Segment (between right tower and portal) */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, gateHeight / 2, (flankSpan - archWidth / 2) / 2 + 1.2]}
      >
        <CuboidCollider args={[wallThickness / 2, gateHeight / 2, 2.2]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[wallThickness, gateHeight, 4.4]} />
        </mesh>
      </RigidBody>

      {/* ======================================================== */}
      {/* 3. UPPER SPANNING ARCH LINTEL & RAMPART (Over the portal)*/}
      {/* ======================================================== */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, (gateHeight + archHeight) / 2 + 0.5, 0]}
      >
        <CuboidCollider
          args={[wallThickness / 2, (gateHeight - archHeight) / 2 + 0.5, archWidth / 2]}
        />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[wallThickness, gateHeight - archHeight + 1.0, archWidth]} />
        </mesh>
      </RigidBody>

      {/* Cusped Ornamental Arch Trim above passage */}
      <mesh position={[0, archHeight + 0.4, 0]} material={SHARED_MATERIALS.carvedStone}>
        <boxGeometry args={[wallThickness + 0.6, 0.8, archWidth + 0.8]} />
      </mesh>

      {/* Central Solar Gold Medallion on Gatehead */}
      <mesh
        position={[wallThickness / 2 + 0.1, gateHeight - 1.2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={SHARED_MATERIALS.goldOrnament}
      >
        <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
      </mesh>
      <mesh
        position={[-wallThickness / 2 - 0.1, gateHeight - 1.2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        material={SHARED_MATERIALS.goldOrnament}
      >
        <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
      </mesh>

      {/* ======================================================== */}
      {/* 4. UPPER BATTLEMENTS & WALKWAY PARAPETS                  */}
      {/* ======================================================== */}
      {/* Walkway floor over the gate */}
      <mesh
        position={[0, gateHeight + 0.1, 0]}
        castShadow
        receiveShadow
        material={SHARED_MATERIALS.plazaCobble}
      >
        <boxGeometry args={[wallThickness + 0.8, 0.2, flankSpan * 2 - 2]} />
      </mesh>

      {/* Front Balustrade */}
      <mesh
        position={[wallThickness / 2 + 0.3, gateHeight + 0.7, 0]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <boxGeometry args={[0.2, 1.0, flankSpan * 2 - 2]} />
      </mesh>
      {/* Back Balustrade */}
      <mesh
        position={[-wallThickness / 2 - 0.3, gateHeight + 0.7, 0]}
        castShadow
        material={SHARED_MATERIALS.carvedStone}
      >
        <boxGeometry args={[0.2, 1.0, flankSpan * 2 - 2]} />
      </mesh>

      {/* Jharokha Balcony on Gate Center */}
      <JharokhaBalcony
        position={[wallThickness / 2 + 0.2, gateHeight - 2.8, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.2}
      />
    </group>
  );
}
