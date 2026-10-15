"use client";

import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import type * as THREE from "three";

import { InteractableTarget } from "@/game/interaction";

import { SHARED_MATERIALS } from "../WorldMaterials";

export interface OutpostDoorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  chunkKey?: string;
}

/**
 * Interactive Outpost Door.
 * Prompts: [E] OPEN DOOR / [E] CLOSE DOOR
 * Smoothly swings open/closed and dynamically updates physical collision.
 */
export function OutpostDoor({
  position = [-12, 0, -4],
  rotation = [0, 0, 0],
  chunkKey = "0,0",
}: OutpostDoorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentAngleRef = useRef(0);
  const doorPivotRef = useRef<THREE.Group>(null);

  const toggleDoor = () => {
    setIsOpen((prev) => !prev);
  };

  // Smooth door swing animation
  useFrame((_, delta) => {
    const targetAngle = isOpen ? Math.PI / 2 : 0;
    const diff = targetAngle - currentAngleRef.current;
    if (Math.abs(diff) > 0.005) {
      currentAngleRef.current += diff * Math.min(delta * 8, 1);
      if (doorPivotRef.current) {
        doorPivotRef.current.rotation.y = currentAngleRef.current;
      }
    } else {
      currentAngleRef.current = targetAngle;
      if (doorPivotRef.current) {
        doorPivotRef.current.rotation.y = targetAngle;
      }
    }
  });

  return (
    <InteractableTarget
      id="door-westport-outpost"
      name="GATEHOUSE DOOR"
      type={isOpen ? "CLOSE" : "OPEN"}
      promptLabel={isOpen ? "CLOSE GATE" : "OPEN GATE"}
      position={position}
      range={3.8}
      priority={5}
      chunkKey={chunkKey}
      action={toggleDoor}
    >
      <group rotation={rotation} name="gatehouse-outpost">
        {/* 1. Left Flanking Sandstone Gatehouse Wall */}
        <RigidBody type="fixed" colliders={false} position={[-3.3, 1.8, 0]}>
          <CuboidCollider args={[2.0, 1.8, 0.4]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[4.0, 3.6, 0.8]} />
          </mesh>
        </RigidBody>

        {/* 2. Right Flanking Sandstone Gatehouse Wall */}
        <RigidBody type="fixed" colliders={false} position={[3.3, 1.8, 0]}>
          <CuboidCollider args={[2.0, 1.8, 0.4]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[4.0, 3.6, 0.8]} />
          </mesh>
        </RigidBody>

        {/* 3. Door Frame - Left Post */}
        <RigidBody type="fixed" colliders={false} position={[-1.15, 1.8, 0]}>
          <CuboidCollider args={[0.25, 1.8, 0.45]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
            <boxGeometry args={[0.5, 3.6, 0.9]} />
          </mesh>
        </RigidBody>

        {/* 4. Door Frame - Right Post */}
        <RigidBody type="fixed" colliders={false} position={[1.15, 1.8, 0]}>
          <CuboidCollider args={[0.25, 1.8, 0.45]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
            <boxGeometry args={[0.5, 3.6, 0.9]} />
          </mesh>
        </RigidBody>

        {/* 5. Door Frame - Top Lintel & Parapet */}
        <RigidBody type="fixed" colliders={false} position={[0, 3.5, 0]}>
          <CuboidCollider args={[1.4, 0.35, 0.45]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.carvedStone}>
            <boxGeometry args={[2.8, 0.7, 0.9]} />
          </mesh>
        </RigidBody>

        {/* 6. Physical Blocking Collider across doorway (active only when door is CLOSED) */}
        {!isOpen && (
          <RigidBody type="fixed" colliders={false} position={[0, 1.6, 0]}>
            <CuboidCollider args={[0.9, 1.6, 0.12]} />
          </RigidBody>
        )}

        {/* 7. Hinged Teak Door Leaf (Hinged at x = -0.9) */}
        <group position={[-0.9, 0, 0]} ref={doorPivotRef}>
          {/* Door panel offset by half-width (0.9m) from hinge pivot */}
          <mesh position={[0.9, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 3.1, 0.14]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} metalness={0.15} />
          </mesh>

          {/* Polished Brass Reinforcing Bands */}
          {[-0.8, 0, 0.8].map((yOffset, idx) => (
            <mesh key={`band-${idx}`} position={[0.9, 1.6 + yOffset, 0.08]}>
              <boxGeometry args={[1.75, 0.1, 0.02]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}

          {/* Brass Ring Pull Handle */}
          <mesh position={[1.65, 1.5, 0.12]}>
            <torusGeometry args={[0.08, 0.02, 12, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* 8. Gatehouse Guard Chamber Alcove (Interior depth behind doorway) */}
        <group position={[0, 0, -2.4]}>
          {/* Chamber Back Wall */}
          <RigidBody type="fixed" colliders={false} position={[0, 1.8, -1.8]}>
            <CuboidCollider args={[2.6, 1.8, 0.3]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[5.2, 3.6, 0.6]} />
            </mesh>
          </RigidBody>

          {/* Chamber Left Wall */}
          <RigidBody type="fixed" colliders={false} position={[-2.4, 1.8, 0]}>
            <CuboidCollider args={[0.3, 1.8, 1.8]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[0.6, 3.6, 3.6]} />
            </mesh>
          </RigidBody>

          {/* Chamber Right Wall */}
          <RigidBody type="fixed" colliders={false} position={[2.4, 1.8, 0]}>
            <CuboidCollider args={[0.3, 1.8, 1.8]} />
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
              <boxGeometry args={[0.6, 3.6, 3.6]} />
            </mesh>
          </RigidBody>

          {/* Guard Table & Chair */}
          <mesh position={[1.4, 0.45, -0.8]} castShadow material={SHARED_MATERIALS.pierWood}>
            <boxGeometry args={[0.9, 0.9, 1.4]} />
          </mesh>
          {/* Hanging Brass Oil Lantern illuminating the interior */}
          <mesh position={[0, 2.7, -0.6]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
            <meshStandardMaterial color="#b45309" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.4, -0.6]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.8} />
          </mesh>
        </group>
      </group>
    </InteractableTarget>
  );
}
