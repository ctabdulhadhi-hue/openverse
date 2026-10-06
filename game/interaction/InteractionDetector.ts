import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { DEFAULT_INTERACTION_CONFIG, type InteractionConfig } from "./InteractionConfig";
import type { InteractionRegistry } from "./InteractionRegistry";
import { interactionRegistry } from "./InteractionRegistry";
import type { InteractionCandidate, InteractionTarget } from "./InteractionTypes";
import {
  calculateFacingCosine,
  calculateTargetDistance,
  getTargetVector3,
} from "./InteractionUtils";

export interface DetectionInput {
  playerPos: THREE.Vector3;
  cameraForward: THREE.Vector3;
  world?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  rapier?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  playerRigidBody?: RapierRigidBody | null;
  registry?: InteractionRegistry;
}

export interface DetectionResult {
  bestCandidate: InteractionCandidate | null;
  candidatesCount: number;
}

export class InteractionDetector {
  private config: InteractionConfig;
  private tempTargetPos = new THREE.Vector3();
  private tempRayOrigin = new THREE.Vector3();
  private tempRayDir = new THREE.Vector3();

  constructor(config: InteractionConfig = DEFAULT_INTERACTION_CONFIG) {
    this.config = config;
  }

  public updateConfig(partial: Partial<InteractionConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  public getConfig(): InteractionConfig {
    return this.config;
  }

  /**
   * Evaluates all registered interactables and picks the best visible candidate.
   */
  public evaluate(input: DetectionInput): DetectionResult {
    const { playerPos, cameraForward, world, rapier, playerRigidBody } = input;
    const registry = input.registry ?? interactionRegistry;

    // 1. Broad-phase radial query
    const nearby = registry.queryNearby(playerPos, this.config.maxDetectionDistance);
    if (nearby.length === 0) {
      return { bestCandidate: null, candidatesCount: 0 };
    }

    // 2. Narrow-phase cone & range filtering + scoring
    const candidates: InteractionCandidate[] = [];

    for (const target of nearby) {
      if (!target.enabled) continue;

      getTargetVector3(target.position, this.tempTargetPos);
      const distance = calculateTargetDistance(playerPos, this.tempTargetPos);
      const maxRange = target.range ?? this.config.defaultInteractionRange;

      if (distance > maxRange) continue;

      const cosAngle = calculateFacingCosine(playerPos, this.tempTargetPos, cameraForward);
      if (cosAngle < this.config.detectionAngleCos) continue;

      // Deterministic scoring: priority > center of view > distance
      const score = target.priority * 1000 + cosAngle * 20 - distance * 2;

      candidates.push({
        target,
        distance,
        cosAngle,
        hasLineOfSight: true, // evaluated for top picks below
        score,
      });
    }

    if (candidates.length === 0) {
      return { bestCandidate: null, candidatesCount: 0 };
    }

    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);

    // 3. Line of sight verification on the top candidates (up to 2 candidates max)
    const checkCount = Math.min(candidates.length, 2);
    for (let i = 0; i < checkCount; i++) {
      const candidate = candidates[i];
      if (!candidate) continue;

      if (!candidate.target.requiresLineOfSight) {
        return { bestCandidate: candidate, candidatesCount: candidates.length };
      }

      const hasLos = this.checkLineOfSight(
        playerPos,
        candidate.target,
        world,
        rapier,
        playerRigidBody,
      );

      candidate.hasLineOfSight = hasLos;
      if (hasLos) {
        return { bestCandidate: candidate, candidatesCount: candidates.length };
      }
    }

    // Top candidates failed LOS
    return { bestCandidate: null, candidatesCount: candidates.length };
  }

  /**
   * Performs a single Rapier raycast to verify clear line-of-sight between player and target.
   */
  private checkLineOfSight(
    playerPos: THREE.Vector3,
    target: InteractionTarget,
    world?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    rapier?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    playerRigidBody?: RapierRigidBody | null,
  ): boolean {
    if (!world || !rapier) {
      // If physics world not ready or in mock test environment, pass LOS
      return true;
    }

    getTargetVector3(target.position, this.tempTargetPos);

    this.tempRayOrigin.set(playerPos.x, playerPos.y + this.config.playerRaycastHeight, playerPos.z);

    const targetCenter = new THREE.Vector3(
      this.tempTargetPos.x,
      this.tempTargetPos.y + this.config.targetRaycastHeight,
      this.tempTargetPos.z,
    );

    this.tempRayDir.subVectors(targetCenter, this.tempRayOrigin);
    const totalDist = this.tempRayDir.length();
    if (totalDist < 0.1) return true;

    this.tempRayDir.divideScalar(totalDist);

    try {
      const ray = new rapier.Ray(
        { x: this.tempRayOrigin.x, y: this.tempRayOrigin.y, z: this.tempRayOrigin.z },
        { x: this.tempRayDir.x, y: this.tempRayDir.y, z: this.tempRayDir.z },
      );

      // Cast ray excluding player body, allowing a 0.25m threshold near target
      const hit = world.castRay(
        ray,
        totalDist - 0.25,
        true,
        undefined,
        undefined,
        undefined,
        playerRigidBody ?? undefined,
      );

      // If an obstacle was hit before the target, line of sight is obstructed
      if (hit && hit.timeOfImpact < totalDist - 0.25) {
        return false;
      }
    } catch {
      return true;
    }

    return true;
  }
}

export const interactionDetector = new InteractionDetector();
