"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

import { interactionRegistry } from "./InteractionRegistry";
import { interactionStore } from "./InteractionStore";
import type { InteractionContext, InteractionTarget, InteractionType } from "./InteractionTypes";

export interface InteractableTargetProps {
  id: string;
  name: string;
  type: InteractionType;
  promptLabel?: string;
  position: [number, number, number] | THREE.Vector3;
  range?: number;
  priority?: number;
  enabled?: boolean;
  requiresLineOfSight?: boolean;
  chunkKey?: string;
  holdDuration?: number;
  metadata?: Record<string, unknown>;
  action: (context: InteractionContext) => void | Promise<void>;
  showHighlight?: boolean;
  children?: ReactNode;
}

/**
 * InteractableTarget.
 *
 * Declarative wrapper for world interactables.
 * Automatically registers with InteractionRegistry on mount and unregisters on unmount.
 * Supports visual focus indicator when player looks at this target.
 */
export function InteractableTarget({
  id,
  name,
  type,
  promptLabel,
  position,
  range = 3.5,
  priority = 0,
  enabled = true,
  requiresLineOfSight = true,
  chunkKey,
  holdDuration,
  metadata,
  action,
  showHighlight = true,
  children,
}: InteractableTargetProps) {
  const [isFocused, setIsFocused] = useState(false);
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  // Position vector
  const posVec = useMemo(
    () =>
      Array.isArray(position) ? new THREE.Vector3(position[0], position[1], position[2]) : position,
    [position],
  );

  // Register with InteractionRegistry
  useEffect(() => {
    const targetDef: InteractionTarget = {
      id,
      name,
      type,
      promptLabel,
      position: posVec,
      range,
      priority,
      enabled,
      requiresLineOfSight,
      chunkKey,
      holdDuration,
      metadata,
      action: (ctx) => actionRef.current(ctx),
    };

    interactionRegistry.register(targetDef);

    return () => {
      interactionRegistry.unregister(id);
    };
  }, [
    id,
    name,
    type,
    promptLabel,
    posVec,
    range,
    priority,
    enabled,
    requiresLineOfSight,
    chunkKey,
    holdDuration,
    metadata,
  ]);

  // Subscribe to telemetry to display subtle highlight when focused
  useEffect(() => {
    if (!showHighlight) return;

    return interactionStore.subscribe((telemetry) => {
      const focused = telemetry.targetId === id;
      setIsFocused((prev) => (prev !== focused ? focused : prev));
    });
  }, [id, showHighlight]);

  return (
    <group position={Array.isArray(position) ? position : [posVec.x, posVec.y, posVec.z]}>
      {children}

      {/* Subtle visual target highlight ring when player aims at this object */}
      {showHighlight && isFocused && (
        <group position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.05, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}
