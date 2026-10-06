import type { RapierRigidBody } from "@react-three/rapier";
import type * as THREE from "three";

import type { InteractionDetector } from "./InteractionDetector";
import { interactionDetector } from "./InteractionDetector";
import { interactionEventBus } from "./InteractionEvents";
import type { InteractionRegistry } from "./InteractionRegistry";
import { interactionRegistry } from "./InteractionRegistry";
import type { InteractionStore } from "./InteractionStore";
import { interactionStore } from "./InteractionStore";
import type {
  InteractionCandidate,
  InteractionContext,
  InteractionTarget,
} from "./InteractionTypes";
import { formatPromptLabel } from "./InteractionUtils";

export class InteractionManager {
  private detector: InteractionDetector;
  private registry: InteractionRegistry;
  private store: InteractionStore;
  private currentCandidate: InteractionCandidate | null = null;
  private lastTriggerTime = 0;
  private isProcessing = false;

  constructor(
    detector: InteractionDetector = interactionDetector,
    registry: InteractionRegistry = interactionRegistry,
    store: InteractionStore = interactionStore,
  ) {
    this.detector = detector;
    this.registry = registry;
    this.store = store;
  }

  public getCurrentCandidate(): InteractionCandidate | null {
    return this.currentCandidate;
  }

  public getCurrentTarget(): InteractionTarget | null {
    return this.currentCandidate?.target ?? null;
  }

  /**
   * Evaluates the current scene each frame.
   */
  public update(
    playerPos: THREE.Vector3,
    cameraForward: THREE.Vector3,
    world?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    rapier?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    playerRigidBody?: RapierRigidBody | null,
  ): void {
    const result = this.detector.evaluate({
      playerPos,
      cameraForward,
      world,
      rapier,
      playerRigidBody,
      registry: this.registry,
    });

    const prevCandidate = this.currentCandidate;
    const newCandidate = result.bestCandidate;

    // Check if target identity changed
    const prevId = prevCandidate?.target.id ?? null;
    const newId = newCandidate?.target.id ?? null;

    if (prevId !== newId) {
      if (prevCandidate) {
        interactionEventBus.emit({
          type: "target_exited",
          target: prevCandidate.target,
          timestamp: Date.now(),
        });
      }

      if (newCandidate) {
        interactionEventBus.emit({
          type: "target_entered",
          target: newCandidate.target,
          previousTarget: prevCandidate?.target,
          timestamp: Date.now(),
        });
      }

      this.currentCandidate = newCandidate;
    } else if (newCandidate) {
      // Same target, update candidate metrics (distance, cosAngle, etc.)
      this.currentCandidate = newCandidate;
    }

    // Telemetry updates for HUD & F3 panel
    const count = this.registry.getCount();
    if (this.currentCandidate) {
      const target = this.currentCandidate.target;
      const label = formatPromptLabel(target);

      this.store.updateTelemetry({
        targetId: target.id,
        targetName: target.name,
        targetType: target.type,
        promptLabel: label,
        distance: this.currentCandidate.distance,
        candidateCount: result.candidatesCount,
        hasLineOfSight: this.currentCandidate.hasLineOfSight,
        registryCount: count,
        isInteracting: this.isProcessing,
      });
    } else {
      this.store.updateTelemetry({
        targetId: null,
        targetName: null,
        targetType: null,
        promptLabel: null,
        distance: null,
        candidateCount: result.candidatesCount,
        hasLineOfSight: true,
        registryCount: count,
        isInteracting: this.isProcessing,
      });
    }
  }

  /**
   * Triggers the interaction on the currently focused target.
   * Returns true if interaction executed, false if ignored.
   */
  public async trigger(playerPos: THREE.Vector3, cameraForward: THREE.Vector3): Promise<boolean> {
    if (!this.currentCandidate || this.isProcessing) {
      return false;
    }

    const target = this.currentCandidate.target;
    if (!target.enabled) {
      return false;
    }

    const now = Date.now();
    const config = this.detector.getConfig();
    if (now - this.lastTriggerTime < config.cooldownMs) {
      return false;
    }

    this.lastTriggerTime = now;
    this.isProcessing = true;
    this.store.updateTelemetry({ isInteracting: true });

    interactionEventBus.emit({
      type: "interaction_requested",
      target,
      timestamp: now,
    });

    const context: InteractionContext = {
      target,
      playerPos,
      cameraDirection: cameraForward,
      timestamp: now,
    };

    try {
      await target.action(context);

      interactionEventBus.emit({
        type: "interaction_completed",
        target,
        timestamp: Date.now(),
      });
      return true;
    } catch (err) {
      interactionEventBus.emit({
        type: "interaction_failed",
        target,
        timestamp: Date.now(),
        reason: err instanceof Error ? err.message : String(err),
      });
      return false;
    } finally {
      this.isProcessing = false;
      this.store.updateTelemetry({ isInteracting: false });
    }
  }

  public reset(): void {
    this.currentCandidate = null;
    this.isProcessing = false;
    this.store.reset();
  }
}

export const interactionManager = new InteractionManager();
