import type { WeatherCondition } from "@/game/weather/weatherTypes";

export type RoutineActivity =
  | "WORK"
  | "TRADE"
  | "PATROL"
  | "WORSHIP"
  | "REST"
  | "SHELTER"
  | "STROLL";

export interface NPCScheduleSlot {
  startHour: number;
  endHour: number;
  activity: RoutineActivity;
  position: [number, number, number];
  rotation: number;
  label: string;
  shelterPosition?: [number, number, number];
}

export interface NPCDailySchedule {
  npcId: string;
  defaultPosition: [number, number, number];
  defaultRotation: number;
  slots: NPCScheduleSlot[];
}

/**
 * Deterministic daily schedules for Varanaya NPCs.
 * Coordinates movement between docks, markets, promenades, sanctuaries, and shelters.
 */
export const NPC_SCHEDULES: Record<string, NPCDailySchedule> = {
  // Samuel Drake — Logistics Master (Harbor & Causeway)
  "npc-samuel": {
    npcId: "npc-samuel",
    defaultPosition: [26.0, 0.1, 16.0],
    defaultRotation: -Math.PI * 0.4,
    slots: [
      {
        startHour: 6,
        endHour: 11,
        activity: "WORK",
        position: [24.0, 0.1, 14.0], // Checking harbor dockside cargo
        rotation: 0.3,
        label: "Inspecting inbound dhow manifests",
        shelterPosition: [26.0, 0.1, 16.0],
      },
      {
        startHour: 11,
        endHour: 17,
        activity: "TRADE",
        position: [28.0, 0.1, 20.0], // Market coordination
        rotation: -Math.PI * 0.5,
        label: "Managing marketplace freight distribution",
        shelterPosition: [26.0, 0.1, 18.0],
      },
      {
        startHour: 17,
        endHour: 20,
        activity: "STROLL",
        position: [42.0, 0.1, 16.0], // Causeway western approach
        rotation: Math.PI / 2,
        label: "Surveying incoming vessels from the causeway",
        shelterPosition: [30.0, 0.1, 16.0],
      },
      {
        startHour: 20,
        endHour: 6,
        activity: "REST",
        position: [26.0, 0.1, 12.0], // Quayside rest bench
        rotation: 0,
        label: "Resting by the harbor stanchions",
        shelterPosition: [26.0, 0.1, 12.0],
      },
    ],
  },

  // Maya Lin — Town Architect (Plaza & Sanctuary Promenade)
  "npc-maya": {
    npcId: "npc-maya",
    defaultPosition: [-1.5, 0.1, 6.5],
    defaultRotation: 0,
    slots: [
      {
        startHour: 7,
        endHour: 12,
        activity: "WORK",
        position: [-1.5, 0.1, 6.5], // Central plaza mandala
        rotation: 0,
        label: "Inspecting central plaza stonework",
        shelterPosition: [-4.0, 0.1, 10.0],
      },
      {
        startHour: 12,
        endHour: 17,
        activity: "STROLL",
        position: [0.0, 0.1, -12.0], // Promenade heading to sanctuary
        rotation: -Math.PI,
        label: "Surveying the grand avenue perspective",
        shelterPosition: [-6.0, 0.1, -6.0],
      },
      {
        startHour: 17,
        endHour: 20,
        activity: "WORSHIP",
        position: [0.0, 0.1, -26.0], // Sanctuary Torana arch
        rotation: -Math.PI,
        label: "Observing golden hour at the Grand Sanctuary",
        shelterPosition: [0.0, 0.1, -34.0],
      },
      {
        startHour: 20,
        endHour: 7,
        activity: "REST",
        position: [-6.0, 0.1, 8.0], // Shaded courtyard arcade
        rotation: Math.PI * 0.5,
        label: "Resting under the palace arcade",
        shelterPosition: [-6.0, 0.1, 8.0],
      },
    ],
  },

  // Clara Hayes — Market Merchant
  "npc-clara": {
    npcId: "npc-clara",
    defaultPosition: [32.0, 0.1, 24.0],
    defaultRotation: Math.PI * 0.5,
    slots: [
      {
        startHour: 6,
        endHour: 17,
        activity: "TRADE",
        position: [32.0, 0.1, 24.0], // Market stall counter
        rotation: Math.PI * 0.5,
        label: "Offering coastal spices and Tellicherry pepper",
        shelterPosition: [32.0, 0.1, 24.0],
      },
      {
        startHour: 17,
        endHour: 20,
        activity: "STROLL",
        position: [28.0, 0.1, 10.0], // Waterfront quay promenade
        rotation: -Math.PI * 0.3,
        label: "Watching the evening dhows from the quay",
        shelterPosition: [30.0, 0.1, 22.0],
      },
      {
        startHour: 20,
        endHour: 6,
        activity: "REST",
        position: [30.0, 0.1, 26.0], // Stall rear seating
        rotation: 0,
        label: "Closing market manifests for the night",
        shelterPosition: [30.0, 0.1, 26.0],
      },
    ],
  },

  // Garrick Stone — Outpost Gatekeeper
  "npc-garrick": {
    npcId: "npc-garrick",
    defaultPosition: [-19.0, 0.1, 3.0],
    defaultRotation: Math.PI / 2,
    slots: [
      {
        startHour: 6,
        endHour: 18,
        activity: "PATROL",
        position: [-19.0, 0.1, 3.0], // Gatehouse entrance
        rotation: Math.PI / 2,
        label: "Guarding the western haveli approach",
        shelterPosition: [-16.0, 0.1, -2.0],
      },
      {
        startHour: 18,
        endHour: 6,
        activity: "PATROL",
        position: [-22.0, 0.1, -3.0], // Gatehouse guard bastion
        rotation: 0,
        label: "Standing watch under the gatehouse oil lamps",
        shelterPosition: [-16.0, 0.1, -2.0],
      },
    ],
  },
};

export class NPCRoutineSystem {
  /**
   * Resolve an NPC's scheduled target position, activity, and rotation for given hour & weather.
   */
  public getScheduleForNPC(
    npcId: string,
    currentHour: number,
    weather: WeatherCondition = "CLEAR",
  ): {
    activity: RoutineActivity;
    targetPosition: [number, number, number];
    targetRotation: number;
    label: string;
    isSheltered: boolean;
  } {
    const schedule = NPC_SCHEDULES[npcId];
    if (!schedule) {
      return {
        activity: "STROLL",
        targetPosition: [0, 0, 0],
        targetRotation: 0,
        label: "Roaming the city",
        isSheltered: false,
      };
    }

    const hour = ((currentHour % 24) + 24) % 24;
    const isRainingOrMisty = weather === "MIST";

    // Find active time slot
    for (const slot of schedule.slots) {
      const inRange =
        slot.startHour <= slot.endHour
          ? hour >= slot.startHour && hour < slot.endHour
          : hour >= slot.startHour || hour < slot.endHour;

      if (inRange) {
        if (isRainingOrMisty && slot.shelterPosition) {
          return {
            activity: "SHELTER",
            targetPosition: slot.shelterPosition,
            targetRotation: slot.rotation,
            label: "Seeking shelter from coastal mist",
            isSheltered: true,
          };
        }
        return {
          activity: slot.activity,
          targetPosition: slot.position,
          targetRotation: slot.rotation,
          label: slot.label,
          isSheltered: false,
        };
      }
    }

    // Default fallback
    return {
      activity: "STROLL",
      targetPosition: schedule.defaultPosition,
      targetRotation: schedule.defaultRotation,
      label: "Going about daily business",
      isSheltered: false,
    };
  }
}

export const npcRoutineSystem = new NPCRoutineSystem();
