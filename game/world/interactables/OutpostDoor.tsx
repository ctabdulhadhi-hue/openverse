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
    <group position={position} rotation={rotation}>
      {/* 1. Door Frame - Left Post */}
      <RigidBody type="fixed" colliders={false} position={[-1.1, 1.6, 0]}>
        <CuboidCollider args={[0.2, 1.6, 0.3]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[0.4, 3.2, 0.6]} />
        </mesh>
      </RigidBody>

      {/* 2. Door Frame - Right Post */}
      <RigidBody type="fixed" colliders={false} position={[1.1, 1.6, 0]}>
        <CuboidCollider args={[0.2, 1.6, 0.3]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[0.4, 3.2, 0.6]} />
        </mesh>
      </RigidBody>

      {/* 3. Door Frame - Top Lintel */}
      <RigidBody type="fixed" colliders={false} position={[0, 3.2, 0]}>
        <CuboidCollider args={[1.3, 0.2, 0.3]} />
        <mesh castShadow receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[2.6, 0.4, 0.6]} />
        </mesh>
      </RigidBody>

      {/* 4. Physical Blocking Collider across doorway (active only when door is CLOSED) */}
      {!isOpen && (
        <RigidBody type="fixed" colliders={false} position={[0, 1.5, 0]}>
          <CuboidCollider args={[0.9, 1.5, 0.1]} />
        </RigidBody>
      )}

      {/* 5. Hinged Door Leaf (Hinged at x = -0.9) */}
      <group position={[-0.9, 0, 0]} ref={doorPivotRef}>
        {/* Door panel offset by half-width (0.9m) from hinge pivot */}
        <mesh
          position={[0.9, 1.5, 0]}
          castShadow
          receiveShadow
          material={SHARED_MATERIALS.pierWood}
        >
          <boxGeometry args={[1.75, 2.9, 0.12]} />
        </mesh>

        {/* Brass Door Handle */}
        <mesh position={[1.65, 1.4, 0.1]} material={SHARED_MATERIALS.plazaCobble}>
          <boxGeometry args={[0.1, 0.25, 0.1]} />
        </mesh>
      </group>

      {/* 6. Interaction Target Registration */}
      <InteractableTarget
        id="door-westport-outpost"
        name="DOOR"
        type={isOpen ? "CLOSE" : "OPEN"}
        promptLabel={isOpen ? "CLOSE DOOR" : "OPEN DOOR"}
        position={[position[0], position[1] + 1.5, position[2]]}
        range={3.5}
        priority={5}
        chunkKey={chunkKey}
        action={toggleDoor}
      />
    </group>
  );
}
