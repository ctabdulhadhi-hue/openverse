"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface CatamaranBoatProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  sailColor?: "saffron" | "indigo" | "ivory";
}

/**
 * Traditional Malabar / South Asian Kettu-Maram (Lashed-Log Outrigger Craft).
 *
 * An authentic artisanal coastal fishing craft engineered with:
 * - Triple-lashed timber dugout log hull with upswept curved prow
 * - Arched outrigger timber booms (aka) connecting to a parallel stabilizer float (kollu)
 * - Raked bamboo mast with woven cotton spritsail
 * - Deck cargo: coiled coir mooring hawser, terracotta fishing basket, bamboo oars
 * - Natural oceanic rolling & wave pitch in useFrame with outrigger roll damping
 */
export function CatamaranBoat({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  sailColor = "saffron",
}: CatamaranBoatProps) {
  const boatRef = useRef<THREE.Group>(null);

  const sailMat =
    sailColor === "saffron"
      ? SHARED_MATERIALS.bannerSaffron
      : sailColor === "indigo"
        ? SHARED_MATERIALS.bannerRoyalBlue
        : SHARED_MATERIALS.buildingWhite;

  useFrame((state) => {
    if (!boatRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle wave heave and stabilized outrigger roll
    boatRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.06;
    boatRef.current.rotation.z = rotation[2] + Math.sin(t * 1.2 + position[2]) * 0.035;
    boatRef.current.rotation.x = rotation[0] + Math.cos(t * 1.0) * 0.025;
  });

  return (
    <group ref={boatRef} position={position} rotation={rotation} name="catamaran-boat">
      {/* ======================================================== */}
      {/* 1. MAIN LASHED-LOG HULL (Dugout Timber & Upswept Prow)   */}
      {/* ======================================================== */}
      {/* Center Main Keel Log */}
      <mesh
        position={[0, 0.25 * scale, 0]}
        castShadow
        receiveShadow
        material={SHARED_MATERIALS.treeTrunk}
      >
        <cylinderGeometry args={[0.35 * scale, 0.38 * scale, 6.2 * scale, 8]} />
      </mesh>
      {/* Upswept Curved Prow */}
      <mesh
        position={[0, 0.55 * scale, 3.4 * scale]}
        rotation={[-Math.PI / 4, 0, 0]}
        castShadow
        material={SHARED_MATERIALS.deepSandstone}
      >
        <cylinderGeometry args={[0.18 * scale, 0.35 * scale, 1.4 * scale, 8]} />
      </mesh>
      {/* Brass Ornamental Prow Finial */}
      <mesh position={[0, 1.1 * scale, 3.8 * scale]} material={SHARED_MATERIALS.goldOrnament}>
        <sphereGeometry args={[0.12 * scale, 8, 8]} />
      </mesh>

      {/* Flanking Tied Bilge Logs (Lashed on both sides) */}
      <mesh
        position={[-0.4 * scale, 0.28 * scale, -0.2 * scale]}
        castShadow
        material={SHARED_MATERIALS.pierWood}
      >
        <cylinderGeometry args={[0.26 * scale, 0.28 * scale, 5.4 * scale, 6]} />
      </mesh>
      <mesh
        position={[0.4 * scale, 0.28 * scale, -0.2 * scale]}
        castShadow
        material={SHARED_MATERIALS.pierWood}
      >
        <cylinderGeometry args={[0.26 * scale, 0.28 * scale, 5.4 * scale, 6]} />
      </mesh>

      {/* Coir Fiber Lashings Binding the Logs */}
      {[-1.8, -0.6, 0.8, 2.0].map((lz) => (
        <mesh key={`lash-${lz}`} position={[0, 0.3 * scale, lz * scale]} castShadow>
          <torusGeometry args={[0.62 * scale, 0.03 * scale, 6, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 2. OUTRIGGER BOOMS (Aka) & STABILIZER FLOAT (Kollu)      */}
      {/* ======================================================== */}
      {/* Arched Connecting Spars extending to Port Side */}
      {[-1.2, 1.0].map((bz) => (
        <group key={`boom-${bz}`} position={[-1.1 * scale, 0.55 * scale, bz * scale]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={SHARED_MATERIALS.pierWood}>
            <cylinderGeometry args={[0.06 * scale, 0.06 * scale, 2.4 * scale, 6]} />
          </mesh>
        </group>
      ))}

      {/* Outrigger Parallel Stabilizer Float Log */}
      <mesh
        position={[-2.3 * scale, 0.2 * scale, 0]}
        castShadow
        receiveShadow
        material={SHARED_MATERIALS.treeTrunk}
      >
        <cylinderGeometry args={[0.22 * scale, 0.24 * scale, 4.8 * scale, 6]} />
      </mesh>
      {/* Upswept Outrigger Prow */}
      <mesh
        position={[-2.3 * scale, 0.42 * scale, 2.6 * scale]}
        rotation={[-Math.PI / 4, 0, 0]}
        material={SHARED_MATERIALS.treeTrunk}
      >
        <cylinderGeometry args={[0.12 * scale, 0.22 * scale, 0.9 * scale, 6]} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. BAMBOO MAST & WOVEN SPRITSAIL                         */}
      {/* ======================================================== */}
      <group position={[0, 0.5 * scale, 0.6 * scale]}>
        {/* Raked Bamboo Mast */}
        <mesh
          position={[0, 2.4 * scale, 0]}
          rotation={[-0.06, 0, 0]}
          castShadow
          material={SHARED_MATERIALS.treeTrunk}
        >
          <cylinderGeometry args={[0.07 * scale, 0.1 * scale, 4.8 * scale, 6]} />
        </mesh>

        {/* Diagonal Sprit Yardarm Pole */}
        <mesh
          position={[0.1 * scale, 2.7 * scale, 0.5 * scale]}
          rotation={[-0.38, 0.2, 0]}
          material={SHARED_MATERIALS.pierWood}
        >
          <cylinderGeometry args={[0.05 * scale, 0.05 * scale, 4.6 * scale, 6]} />
        </mesh>

        {/* Trapezoidal / Triangular Spritsail */}
        <mesh
          position={[0.12 * scale, 2.5 * scale, 0.6 * scale]}
          rotation={[0, Math.PI / 2, 0]}
          material={sailMat}
        >
          <coneGeometry args={[1.6 * scale, 3.6 * scale, 3]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. FISHING BASKET, BAMBOO OARS & COIR ROPE CARGO         */}
      {/* ======================================================== */}
      {/* Woven Coir Fish Basket */}
      <mesh
        position={[0, 0.6 * scale, -1.2 * scale]}
        castShadow
        material={SHARED_MATERIALS.warmSandstone}
      >
        <cylinderGeometry args={[0.28 * scale, 0.22 * scale, 0.45 * scale, 8]} />
      </mesh>

      {/* Coiled Mooring Rope */}
      <mesh
        position={[0.1 * scale, 0.52 * scale, -2.1 * scale]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      >
        <torusGeometry args={[0.22 * scale, 0.06 * scale, 6, 12]} />
        <meshStandardMaterial color="#92400e" roughness={0.9} />
      </mesh>

      {/* Hand-carved Wooden Steering Oar */}
      <mesh
        position={[0.2 * scale, 0.6 * scale, -2.5 * scale]}
        rotation={[0.4, 0, 0.2]}
        castShadow
        material={SHARED_MATERIALS.pierWood}
      >
        <cylinderGeometry args={[0.03 * scale, 0.04 * scale, 2.6 * scale, 6]} />
      </mesh>
    </group>
  );
}
