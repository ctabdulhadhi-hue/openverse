import type { PlayerRuntimeState } from "../player/PlayerState";

export interface PhysicsTelemetry {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  speed: number;
  isGrounded: boolean;
  movementState: string;
  fallDistance: number;
  jumpRequested: boolean;
}

/**
 * Formats runtime physics state for developer overlays and telemetry logging.
 */
export function formatPhysicsTelemetry(state: PlayerRuntimeState): PhysicsTelemetry {
  return {
    position: {
      x: Number(state.position.x.toFixed(2)),
      y: Number(state.position.y.toFixed(2)),
      z: Number(state.position.z.toFixed(2)),
    },
    velocity: {
      x: Number(state.velocity.x.toFixed(2)),
      y: Number(state.velocity.y.toFixed(2)),
      z: Number(state.velocity.z.toFixed(2)),
    },
    speed: Number(state.speed.toFixed(2)),
    isGrounded: state.isGrounded,
    movementState: state.movementState,
    fallDistance: Number(state.fallDistance.toFixed(2)),
    jumpRequested: state.jumpRequested,
  };
}

/**
 * Developer logger for physics transitions (grounded <-> airborne).
 */
export class PhysicsTransitionLogger {
  private lastGrounded: boolean | null = null;
  private lastState: string = "";

  public logIfChanged(state: PlayerRuntimeState): void {
    if (this.lastGrounded !== null && this.lastGrounded !== state.isGrounded) {
      if (process.env.NODE_ENV === "development") {
        // Transition logged in dev
      }
    }
    this.lastGrounded = state.isGrounded;
    this.lastState = state.movementState;
  }
}
