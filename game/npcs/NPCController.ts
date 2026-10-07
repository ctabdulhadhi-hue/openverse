import { DEFAULT_NPC_CONFIG, type NPCSystemConfig } from "./NPCConfig";
import type { NPCDefinition, NPCSpawnZone } from "./NPCData";
import { stepMovement } from "./NPCMovement";
import { sampleZoneDestination } from "./NPCNavigation";
import { evaluatePlayerPerception, stepLookAtAngle } from "./NPCPerception";
import type { NPCStateType } from "./NPCState";
import type { NPCSimulationTier } from "./NPCType";

export class NPCController {
  public readonly id: string;
  public readonly def: NPCDefinition;
  public readonly config: NPCSystemConfig;

  // Spatial runtime
  public position: [number, number, number];
  public yaw: number;
  public headYaw: number;
  public speed: number = 0;

  // State machine
  public state: NPCStateType = "SPAWNING";
  public timeInState: number = 0;
  public stateDuration: number = 1.0;
  public targetDestination: [number, number, number] | null = null;
  public stepIndex: number = 0;

  // LOD & Simulation
  public simulationTier: NPCSimulationTier = "NEAR";
  public playerDistance: number = Infinity;
  public isAcknowledgingPlayer: boolean = false;

  // Animation clocks
  public walkClock: number = 0;
  public breatheClock: number = 0;

  constructor(def: NPCDefinition, config: NPCSystemConfig = DEFAULT_NPC_CONFIG) {
    this.id = def.id;
    this.def = def;
    this.config = config;

    this.position = [...def.basePosition];
    this.yaw = def.baseRotation;
    this.headYaw = 0;

    // Initialize state
    this.transitionTo("SPAWNING", 0.5);
  }

  public transitionTo(nextState: NPCStateType, duration: number): void {
    this.state = nextState;
    this.timeInState = 0;
    this.stateDuration = duration;
  }

  /**
   * Determine simulation tier based on distance to player.
   */
  public updateSimulationTier(playerDist: number): NPCSimulationTier {
    this.playerDistance = playerDist;
    const { nearDistance, midDistance, farDistance } = this.config.simulationTiers;

    if (playerDist <= nearDistance) {
      this.simulationTier = "NEAR";
    } else if (playerDist <= midDistance) {
      this.simulationTier = "MID";
    } else if (playerDist <= farDistance) {
      this.simulationTier = "FAR";
    } else {
      this.simulationTier = "UNLOADED";
    }

    return this.simulationTier;
  }

  /**
   * Tick update called by NPCManager.
   */
  public update(
    dt: number,
    playerPos: [number, number, number] | null,
    spawnZone?: NPCSpawnZone,
  ): void {
    if (this.simulationTier === "UNLOADED") {
      return;
    }

    this.timeInState += dt;
    this.breatheClock += dt;

    // 1. Evaluate player perception
    const perception = evaluatePlayerPerception(
      this.position,
      this.yaw,
      playerPos,
      this.config.playerAwarenessRadius,
      this.config.playerLookAtMaxAngle,
    );

    this.isAcknowledgingPlayer = perception.isPlayerNearby;

    // Smooth head turn towards player if in NEAR tier
    if (this.simulationTier === "NEAR") {
      const targetHead = perception.isPlayerNearby ? perception.relativeLookAngle : 0;
      this.headYaw = stepLookAtAngle(this.headYaw, targetHead, this.config.headTurnSpeed, dt);
    } else {
      this.headYaw = 0;
    }

    // 2. FSM Execution
    switch (this.state) {
      case "SPAWNING": {
        if (this.timeInState >= this.stateDuration) {
          const idleTime =
            this.config.idleDurationRange[0] +
            (((this.def.seed + this.stepIndex) % 100) / 100) *
              (this.config.idleDurationRange[1] - this.config.idleDurationRange[0]);
          this.transitionTo("IDLE", idleTime);
        }
        break;
      }

      case "IDLE": {
        this.speed = 0;
        if (this.timeInState >= this.stateDuration) {
          // If behavior is WANDER, pick destination and start walking
          if (this.def.behavior === "WANDER" && spawnZone) {
            this.stepIndex++;
            this.targetDestination = sampleZoneDestination(
              spawnZone,
              this.def.seed,
              this.stepIndex,
              this.position,
            );
            this.transitionTo("WALKING", 20.0); // Max walking timeout
          } else {
            // Re-idle
            this.transitionTo("IDLE", 3.0);
          }
        }
        break;
      }

      case "WALKING": {
        if (!this.targetDestination) {
          this.transitionTo("IDLE", 2.0);
          break;
        }

        // Advance walk animation clock
        this.walkClock += dt * 8.0;

        // Step movement
        const moveResult = stepMovement(
          this.position,
          this.targetDestination,
          this.yaw,
          this.def.walkSpeed,
          this.config.turnSpeed,
          this.config.arrivalThreshold,
          dt,
        );

        this.position = moveResult.newPosition;
        this.yaw = moveResult.newYaw;
        this.speed = moveResult.actualSpeed;

        if (moveResult.hasArrived || this.timeInState >= this.stateDuration) {
          this.targetDestination = null;
          this.speed = 0;
          const waitTime =
            this.config.waitDurationRange[0] +
            (((this.def.seed * 3 + this.stepIndex) % 100) / 100) *
              (this.config.waitDurationRange[1] - this.config.waitDurationRange[0]);
          this.transitionTo("WAITING", waitTime);
        }
        break;
      }

      case "WAITING": {
        this.speed = 0;
        if (this.timeInState >= this.stateDuration) {
          const idleTime =
            this.config.idleDurationRange[0] +
            (((this.def.seed * 7 + this.stepIndex) % 100) / 100) *
              (this.config.idleDurationRange[1] - this.config.idleDurationRange[0]);
          this.transitionTo("IDLE", idleTime);
        }
        break;
      }

      case "DESPAWNING": {
        this.speed = 0;
        break;
      }

      default:
        break;
    }
  }
}
