import type * as THREE from "three";

/**
 * Standard interaction types supported by OPENVERSE.
 */
export type InteractionType = "READ" | "OPEN" | "CLOSE" | "USE" | "TALK" | "PICKUP";

/**
 * Context passed to an interaction action when executed.
 */
export interface InteractionContext {
  target: InteractionTarget;
  playerPos: THREE.Vector3;
  cameraDirection: THREE.Vector3;
  timestamp: number;
}

/**
 * Definition of an interactive world target.
 */
export interface InteractionTarget {
  /** Unique identifier for the interactable (e.g. 'town-sign-westport', 'door-civic-1') */
  id: string;

  /** Optional chunk key ('chunkX,chunkZ') for automated streaming lifecycle binding */
  chunkKey?: string;

  /** Human-readable display name */
  name: string;

  /** Action type */
  type: InteractionType;

  /** Optional custom prompt label (e.g. 'READ SIGN'). If omitted, generated as `${type} ${name}` */
  promptLabel?: string;

  /** World position [x, y, z] or THREE.Vector3 */
  position: [number, number, number] | THREE.Vector3;

  /** Maximum interaction distance in meters (defaults to 3.5m) */
  range: number;

  /** Priority for resolving multiple nearby targets (higher values win ties) */
  priority: number;

  /** Whether the interaction is currently active and can be interacted with */
  enabled: boolean;

  /** Whether a physical line of sight (raycast) is required to interact */
  requiresLineOfSight: boolean;

  /** Optional hold duration in seconds (0 = instantaneous key tap) */
  holdDuration?: number;

  /** Optional domain-specific metadata */
  metadata?: Record<string, unknown>;

  /** Execution callback invoked when the interaction is triggered */
  action: (context: InteractionContext) => void | Promise<void>;
}

/**
 * Evaluated candidate with detection scoring metrics.
 */
export interface InteractionCandidate {
  target: InteractionTarget;
  distance: number;
  cosAngle: number;
  hasLineOfSight: boolean;
  score: number;
}

/**
 * Interaction lifecycle events.
 */
export type InteractionEventType =
  | "target_entered"
  | "target_exited"
  | "target_changed"
  | "interaction_requested"
  | "interaction_completed"
  | "interaction_failed";

export interface InteractionEvent {
  type: InteractionEventType;
  target?: InteractionTarget;
  previousTarget?: InteractionTarget;
  timestamp: number;
  reason?: string;
}

export type InteractionEventListener = (event: InteractionEvent) => void;

/**
 * Real-time telemetry snapshot for HUD and F3 debug panel.
 */
export interface InteractionTelemetry {
  targetId: string | null;
  targetName: string | null;
  targetType: InteractionType | null;
  promptLabel: string | null;
  distance: number | null;
  candidateCount: number;
  hasLineOfSight: boolean;
  registryCount: number;
  isInteracting: boolean;
}
