import { beforeEach, describe, expect, it } from "vitest";

import {
  VARANAYA_GARDEN_WHISPERS,
  VARANAYA_HARBOR_LIGHTS,
  VARANAYA_MISSING_LEDGER,
  VARANAYA_SMALL_FAVOR,
  WESTPORT_FIRST_DELIVERY,
} from "@/data/missions";
import { DialogueFlagStore } from "@/game/dialogue/DialogueFlags";
import { arePrerequisitesMet } from "@/game/missions/MissionConditions";
import { MissionEventBus } from "@/game/missions/MissionEvents";
import { MissionManager } from "@/game/missions/MissionManager";
import {
  calculateHorizontalDistance,
  formatObjectiveChecklistText,
  formatObjectiveDistance,
} from "@/game/missions/MissionObjectives";
import { MissionRegistry } from "@/game/missions/MissionRegistry";
import { applyMissionRewards } from "@/game/missions/MissionRewards";
import { MissionStore } from "@/game/missions/MissionStore";
import type { MissionDefinition, MissionEvent } from "@/game/missions/MissionTypes";

describe("Phase 9 Mission System Unit Tests", () => {
  let registry: MissionRegistry;
  let store: MissionStore;
  let eventBus: MissionEventBus;
  let flagStore: DialogueFlagStore;
  let manager: MissionManager;

  const mockMission: MissionDefinition = {
    id: "test_mission_1",
    title: "Test Mission",
    description: "A test mission for unit testing",
    category: "SIDE",
    giverNpcId: "npc-maya",
    objectives: [
      {
        id: "reach_point",
        type: "REACH",
        title: "Reach Waypoint",
        description: "Go to coordinates",
        target: { position: [10, 0, 10], radius: 4.0 },
      },
      {
        id: "talk_target",
        type: "TALK",
        title: "Talk to NPC",
        description: "Report to Maya",
        target: { npcId: "npc-maya" },
      },
    ],
    prerequisites: [],
    rewards: {
      xp: 200,
      flags: { test_done: true },
      currency: 50,
    },
  };

  beforeEach(() => {
    registry = new MissionRegistry();
    store = new MissionStore();
    eventBus = new MissionEventBus();
    flagStore = new DialogueFlagStore();
    manager = new MissionManager(registry, store, eventBus);
  });

  describe("MissionRegistry & Validation", () => {
    it("registers a valid mission definition and retrieves by ID", () => {
      registry.register(mockMission);
      expect(registry.get("test_mission_1")).toEqual(mockMission);
      expect(registry.getCount()).toBe(1);
    });

    it("prevents registering duplicate mission IDs", () => {
      registry.register(mockMission);
      expect(() => registry.register(mockMission)).toThrowError(/Duplicate mission ID/);
    });

    it("indexes missions by giver NPC ID", () => {
      registry.register(mockMission);
      const byGiver = registry.getByGiverNpcId("npc-maya");
      expect(byGiver).toHaveLength(1);
      expect(byGiver[0]?.id).toBe("test_mission_1");
    });

    it("validates missing mandatory fields", () => {
      const invalidMission = {
        ...mockMission,
        id: "",
        title: "",
      };
      expect(() => registry.register(invalidMission)).toThrowError();
    });

    it("validates REACH objectives have target coordinates", () => {
      const invalidReach: MissionDefinition = {
        ...mockMission,
        id: "invalid_reach",
        objectives: [
          {
            id: "reach_bad",
            type: "REACH",
            title: "Bad Reach",
            description: "No position",
          },
        ],
      };
      expect(() => registry.register(invalidReach)).toThrowError(/target position/);
    });
  });

  describe("Mission Conditions & Prerequisites", () => {
    it("evaluates true when no prerequisites exist", () => {
      expect(arePrerequisitesMet(undefined, new Set(), flagStore)).toBe(true);
      expect(arePrerequisitesMet([], new Set(), flagStore)).toBe(true);
    });

    it("verifies dialogue flag prerequisites", () => {
      const prereqs = [{ type: "FLAG" as const, key: "intro_completed", expectedValue: true }];
      expect(arePrerequisitesMet(prereqs, new Set(), flagStore)).toBe(false);

      flagStore.setFlag("intro_completed", true);
      expect(arePrerequisitesMet(prereqs, new Set(), flagStore)).toBe(true);
    });

    it("verifies prior completed mission prerequisites", () => {
      const prereqs = [{ type: "MISSION_COMPLETED" as const, key: "intro_quest" }];
      const completedSet = new Set<string>();

      expect(arePrerequisitesMet(prereqs, completedSet, flagStore)).toBe(false);

      completedSet.add("intro_quest");
      expect(arePrerequisitesMet(prereqs, completedSet, flagStore)).toBe(true);
    });
  });

  describe("Mission Lifecycle & Progression", () => {
    beforeEach(() => {
      manager.registerMission(mockMission);
    });

    it("offers mission and emits MISSION_OFFERED event", () => {
      const events: MissionEvent[] = [];
      eventBus.subscribe((e) => events.push(e));

      const offered = manager.offerMission("test_mission_1");
      expect(offered).toBe(true);
      expect(events).toHaveLength(1);
      expect(events[0]?.type).toBe("MISSION_OFFERED");
    });

    it("starts mission and activates first objective", () => {
      const events: MissionEvent[] = [];
      eventBus.subscribe((e) => events.push(e));

      const started = manager.startMission("test_mission_1");
      expect(started).toBe(true);
      expect(manager.isMissionActive("test_mission_1")).toBe(true);

      const instance = store.getInstance("test_mission_1");
      expect(instance).toBeDefined();
      expect(instance?.state).toBe("ACTIVE");
      expect(instance?.currentObjectiveIndex).toBe(0);

      // Verify events: MISSION_STARTED then OBJECTIVE_STARTED
      expect(events.map((e) => e.type)).toEqual(["MISSION_STARTED", "OBJECTIVE_STARTED"]);
      expect(events[1]?.objectiveId).toBe("reach_point");
    });

    it("prevents starting an already active or completed mission", () => {
      manager.startMission("test_mission_1");
      expect(manager.startMission("test_mission_1")).toBe(false);

      manager.completeObjective("test_mission_1", "reach_point");
      manager.completeObjective("test_mission_1", "talk_target");
      expect(manager.isMissionCompleted("test_mission_1")).toBe(true);
      expect(manager.startMission("test_mission_1")).toBe(false);
    });

    it("advances objectives sequentially until completion", () => {
      manager.startMission("test_mission_1");

      // Advance objective 1 -> objective 2
      const step1 = manager.completeObjective("test_mission_1", "reach_point");
      expect(step1).toBe(true);

      const instance = store.getInstance("test_mission_1");
      expect(instance?.currentObjectiveIndex).toBe(1);

      // Advance objective 2 -> mission completes
      const step2 = manager.completeObjective("test_mission_1", "talk_target");
      expect(step2).toBe(true);
      expect(manager.isMissionCompleted("test_mission_1")).toBe(true);
      expect(manager.isMissionActive("test_mission_1")).toBe(false);
    });

    it("supports incremental progress via updateObjective", () => {
      const multiStepMission: MissionDefinition = {
        ...mockMission,
        id: "multi_step",
        objectives: [
          {
            id: "collect_markers",
            type: "INTERACT",
            title: "Inspect Points",
            description: "Inspect 3 points",
            requiredCount: 3,
          },
        ],
      };
      manager.registerMission(multiStepMission);
      manager.startMission("multi_step");

      manager.updateObjective("multi_step", "collect_markers", 1);
      const instance = store.getInstance("multi_step");
      expect(instance?.objectives[0]?.currentCount).toBe(1);
      expect(instance?.state).toBe("ACTIVE");

      manager.updateObjective("multi_step", "collect_markers", 3);
      expect(manager.isMissionCompleted("multi_step")).toBe(true);
    });

    it("fails an active mission cleanly", () => {
      const events: MissionEvent[] = [];
      eventBus.subscribe((e) => events.push(e));

      manager.startMission("test_mission_1");
      manager.failMission("test_mission_1", "time_expired");

      expect(manager.isMissionActive("test_mission_1")).toBe(false);
      expect(store.getMissionState("test_mission_1")).toBe("FAILED");
      expect(events.some((e) => e.type === "MISSION_FAILED")).toBe(true);
    });

    it("abandons a mission and returns it to available", () => {
      manager.startMission("test_mission_1");
      manager.abandonMission("test_mission_1");

      expect(manager.isMissionActive("test_mission_1")).toBe(false);
      expect(store.getMissionState("test_mission_1")).toBe("AVAILABLE");
    });
  });

  describe("Real Gameplay Triggers", () => {
    beforeEach(() => {
      manager.registerMission(mockMission);
      manager.startMission("test_mission_1");
    });

    it("triggers REACH objective completion when player enters radius", () => {
      // Target is at [10, 0, 10] with radius 4.0
      // Player at [0, 0, 0] -> too far
      manager.checkReachObjectives([0, 0, 0]);
      expect(store.getInstance("test_mission_1")?.currentObjectiveIndex).toBe(0);

      // Player at [9, 0, 9] -> distance ~1.41m <= 4.0m
      manager.checkReachObjectives([9, 0, 9]);
      expect(store.getInstance("test_mission_1")?.currentObjectiveIndex).toBe(1);
    });

    it("triggers TALK objective completion when dialogue completes with target NPC", () => {
      // First advance past REACH
      manager.completeObjective("test_mission_1", "reach_point");

      // Dialogue completed with unrelated NPC -> no change
      manager.handleDialogueCompleted("npc-samuel");
      expect(manager.isMissionCompleted("test_mission_1")).toBe(false);

      // Dialogue completed with target NPC (npc-maya) -> completes objective & mission
      manager.handleDialogueCompleted("npc-maya");
      expect(manager.isMissionCompleted("test_mission_1")).toBe(true);
    });

    it("triggers INTERACT objective completion when interaction event fires", () => {
      const interactMission: MissionDefinition = {
        ...mockMission,
        id: "interact_mission",
        objectives: [
          {
            id: "open_door",
            type: "INTERACT",
            title: "Open Door",
            description: "Open the outpost door",
            target: { interactableId: "door-westport-outpost" },
          },
        ],
      };
      manager.registerMission(interactMission);
      manager.startMission("interact_mission");

      manager.handleInteraction("door-other");
      expect(manager.isMissionActive("interact_mission")).toBe(true);

      manager.handleInteraction("door-westport-outpost");
      expect(manager.isMissionCompleted("interact_mission")).toBe(true);
    });
  });

  describe("Rewards Application", () => {
    it("distributes XP and sets dialogue flags on completion", () => {
      const rewards = {
        xp: 300,
        flags: { quest_bonus_unlocked: true, surveyor_rank: 2 },
        currency: 120,
      };

      const result = applyMissionRewards(rewards, flagStore);
      expect(result.xpAwarded).toBe(300);
      expect(flagStore.getFlag("quest_bonus_unlocked")).toBe(true);
      expect(flagStore.getFlag("surveyor_rank")).toBe(2);
    });
  });

  describe("NPC Indicator State Calculation", () => {
    it("identifies AVAILABLE indicator when NPC offers unstarted mission", () => {
      manager.registerMission(mockMission);
      const indicator = store.getNpcMissionIndicator("npc-maya");
      expect(indicator).toBe("AVAILABLE");
    });

    it("identifies ACTIVE_TARGET indicator when NPC is the target of current objective", () => {
      manager.registerMission(mockMission);
      manager.startMission("test_mission_1");

      // Objective 0 is REACH, so Maya is not active target yet
      expect(store.getNpcMissionIndicator("npc-maya")).toBe("NONE");

      // Advance to Objective 1 (TALK npc-maya)
      manager.completeObjective("test_mission_1", "reach_point");
      expect(store.getNpcMissionIndicator("npc-maya")).toBe("ACTIVE_TARGET");
    });

    it("returns NONE after mission completes", () => {
      manager.registerMission(mockMission);
      manager.startMission("test_mission_1");
      manager.completeObjective("test_mission_1", "reach_point");
      manager.completeObjective("test_mission_1", "talk_target");

      expect(store.getNpcMissionIndicator("npc-maya")).toBe("NONE");
    });
  });

  describe("Mission Helper Utilities", () => {
    it("calculates horizontal 2D distance correctly", () => {
      const dist = calculateHorizontalDistance([0, 5, 0], [3, 10, 4]);
      expect(dist).toBeCloseTo(5.0);
    });

    it("formats metric distances correctly", () => {
      expect(formatObjectiveDistance(45.2)).toBe("45 m");
      expect(formatObjectiveDistance(1450)).toBe("1.5 km");
    });

    it("formats objective checklist text with progress counter", () => {
      const def = {
        id: "obj1",
        type: "REACH" as const,
        title: "Survey Locations",
        description: "",
        requiredCount: 3,
      };
      const runtime = {
        id: "obj1",
        state: "ACTIVE" as const,
        completed: false,
        currentCount: 2,
        requiredCount: 3,
      };
      expect(formatObjectiveChecklistText(def, runtime)).toBe("Survey Locations (2/3)");
    });
  });

  describe("Playable Mission Integrity: Westport First Delivery", () => {
    it("validates WESTPORT_FIRST_DELIVERY conforms to all schema requirements", () => {
      expect(WESTPORT_FIRST_DELIVERY.id).toBe("westport_first_delivery");
      expect(WESTPORT_FIRST_DELIVERY.title).toBe("A Small Favor");
      expect(WESTPORT_FIRST_DELIVERY.giverNpcId).toBe("npc-maya");
      expect(WESTPORT_FIRST_DELIVERY.objectives).toHaveLength(2);

      // Objective 1: REACH outpost
      const obj1 = WESTPORT_FIRST_DELIVERY.objectives[0];
      expect(obj1?.type).toBe("REACH");
      expect(obj1?.target?.position).toBeDefined();

      // Objective 2: TALK Maya Lin
      const obj2 = WESTPORT_FIRST_DELIVERY.objectives[1];
      expect(obj2?.type).toBe("TALK");
      expect(obj2?.target?.npcId).toBe("npc-maya");

      // Rewards
      expect(WESTPORT_FIRST_DELIVERY.rewards.xp).toBeGreaterThan(0);
      expect(WESTPORT_FIRST_DELIVERY.rewards.flags?.westport_delivery_complete).toBe(true);

      // Can register in registry cleanly without errors
      expect(() => registry.register(WESTPORT_FIRST_DELIVERY)).not.toThrow();
    });
  });

  describe("Playable Mission Integrity: Varanaya Small Favor (5 Objectives)", () => {
    it("validates VARANAYA_SMALL_FAVOR conforms to all 5 objective requirements", async () => {
      const { VARANAYA_SMALL_FAVOR } = await import("@/data/missions/varanayaSmallFavor");
      expect(VARANAYA_SMALL_FAVOR.id).toBe("varanaya_small_favor");
      expect(VARANAYA_SMALL_FAVOR.title).toBe("A Small Favor");
      expect(VARANAYA_SMALL_FAVOR.giverNpcId).toBe("npc-maya");
      expect(VARANAYA_SMALL_FAVOR.objectives).toHaveLength(5);

      // Objective 1: GO_TO_LOCATION at Royal Waterfront
      expect(VARANAYA_SMALL_FAVOR.objectives[0]?.type).toBe("GO_TO_LOCATION");
      expect(VARANAYA_SMALL_FAVOR.objectives[0]?.target?.position).toEqual([26, 1.4, 4]);

      // Objective 2: TALK_TO_NPC Harbor Master
      expect(VARANAYA_SMALL_FAVOR.objectives[1]?.type).toBe("TALK_TO_NPC");
      expect(VARANAYA_SMALL_FAVOR.objectives[1]?.target?.npcId).toBe("npc-samuel");

      // Objective 3: COLLECT crate
      expect(VARANAYA_SMALL_FAVOR.objectives[2]?.type).toBe("COLLECT");
      expect(VARANAYA_SMALL_FAVOR.objectives[2]?.target?.interactableId).toBe(
        "crate-waterfront-supplies",
      );

      // Objective 4: GO_TO_LOCATION Return to Maya
      expect(VARANAYA_SMALL_FAVOR.objectives[3]?.type).toBe("GO_TO_LOCATION");
      expect(VARANAYA_SMALL_FAVOR.objectives[3]?.target?.npcId).toBe("npc-maya");

      // Objective 5: CHOICE conclude favor
      expect(VARANAYA_SMALL_FAVOR.objectives[4]?.type).toBe("CHOICE");
      expect(VARANAYA_SMALL_FAVOR.objectives[4]?.target?.npcId).toBe("npc-maya");

      // Rewards include items and flags
      expect(VARANAYA_SMALL_FAVOR.rewards.items).toBeDefined();
      expect(VARANAYA_SMALL_FAVOR.rewards.items?.[0]?.id).toBe("architect_survey_map");

      // Registration succeeds
      expect(() => registry.register(VARANAYA_SMALL_FAVOR)).not.toThrow();
    });

    it("executes the full 5-objective progression through the MissionManager", async () => {
      const { VARANAYA_SMALL_FAVOR } = await import("@/data/missions/varanayaSmallFavor");
      manager.registerMission(VARANAYA_SMALL_FAVOR);

      // 1. Accept mission
      expect(manager.acceptMission("varanaya_small_favor")).toBe(true);
      expect(manager.isMissionActive("varanaya_small_favor")).toBe(true);
      let instance = store.getInstance("varanaya_small_favor");
      expect(instance?.currentObjectiveIndex).toBe(0);

      // 2. Reach Waterfront Quay [26, 1.4, 4]
      manager.checkReachObjectives([26, 1.4, 4]);
      instance = store.getInstance("varanaya_small_favor");
      expect(instance?.currentObjectiveIndex).toBe(1);

      // 3. Talk to Harbor Master Samuel Drake
      manager.handleDialogueCompleted("npc-samuel");
      instance = store.getInstance("varanaya_small_favor");
      expect(instance?.currentObjectiveIndex).toBe(2);

      // 4. Collect shipment crate from market stall
      manager.handleInteraction("crate-waterfront-supplies");
      instance = store.getInstance("varanaya_small_favor");
      expect(instance?.currentObjectiveIndex).toBe(3);

      // 5. Return to Maya Lin [-1.5, 0.1, 6.5]
      manager.checkReachObjectives([-1.5, 0.1, 6.5]);
      instance = store.getInstance("varanaya_small_favor");
      expect(instance?.currentObjectiveIndex).toBe(4);

      // 6. Complete final choice with Maya
      manager.handleDialogueCompleted("npc-maya");
      expect(manager.isMissionCompleted("varanaya_small_favor")).toBe(true);
      expect(manager.isMissionActive("varanaya_small_favor")).toBe(false);
    });
  });

  describe("Mission Lifecycle: Accept, Decline, Pause, Resume, and Duplicate Prevention", () => {
    it("handles declining an offered mission and records declined state", () => {
      manager.registerMission(mockMission);
      const events: MissionEvent[] = [];
      eventBus.subscribe((e) => events.push(e));

      expect(manager.declineMission("test_mission_1")).toBe(true);
      expect(store.getMissionState("test_mission_1")).toBe("DECLINED");
      expect(events.some((e) => e.type === "MISSION_DECLINED")).toBe(true);

      // Player can later accept a declined mission
      expect(manager.acceptMission("test_mission_1")).toBe(true);
      expect(manager.isMissionActive("test_mission_1")).toBe(true);
    });

    it("handles pausing and resuming an active mission", () => {
      manager.registerMission(mockMission);
      manager.startMission("test_mission_1");

      expect(manager.pauseMission("test_mission_1")).toBe(true);
      expect(store.getMissionState("test_mission_1")).toBe("PAUSED");

      expect(manager.resumeMission("test_mission_1")).toBe(true);
      expect(store.getMissionState("test_mission_1")).toBe("ACTIVE");
    });

    it("prevents duplicate reward payouts and duplicate mission completion", () => {
      manager.registerMission(mockMission);
      manager.startMission("test_mission_1");
      manager.completeObjective("test_mission_1", "reach_point");
      manager.completeObjective("test_mission_1", "talk_target");
      expect(manager.isMissionCompleted("test_mission_1")).toBe(true);

      const events: MissionEvent[] = [];
      eventBus.subscribe((e) => events.push(e));

      // Attempting to complete an already completed mission should be a no-op
      const secondCompletion = manager.completeMission("test_mission_1");
      expect(secondCompletion).toBe(false);
      expect(events.filter((e) => e.type === "MISSION_COMPLETED")).toHaveLength(0);
    });
  });

  describe("Extended Conditions & Rewards", () => {
    it("evaluates INTERACTION_COMPLETED and ITEM_EXISTS conditions", () => {
      const condition1 = [
        { type: "INTERACTION_COMPLETED" as const, key: "crate-waterfront-supplies" },
      ];
      expect(arePrerequisitesMet(condition1, new Set(), flagStore)).toBe(false);

      flagStore.setFlag("interact_crate-waterfront-supplies", true);
      expect(arePrerequisitesMet(condition1, new Set(), flagStore)).toBe(true);

      const condition2 = [
        { type: "ITEM_EXISTS" as const, key: "architect_survey_map", expectedValue: true },
      ];
      expect(arePrerequisitesMet(condition2, new Set(), flagStore)).toBe(false);

      flagStore.setFlag("item_architect_survey_map_obtained", true);
      expect(arePrerequisitesMet(condition2, new Set(), flagStore)).toBe(true);
    });

    it("awards items and sets item obtained flags via applyMissionRewards", () => {
      const rewards = {
        xp: 150,
        currency: 50,
        items: [{ id: "golden_compass", name: "Golden Compass", quantity: 1 }],
        flags: { custom_flag: true },
      };

      const result = applyMissionRewards(rewards, flagStore);
      expect(result.xpAwarded).toBe(150);
      expect(result.currencyAwarded).toBe(50);
      expect(result.itemsAwarded).toHaveLength(1);
      expect(flagStore.getFlag("item_golden_compass_obtained")).toBe(true);
      expect(flagStore.getFlag("custom_flag")).toBe(true);
    });
  });

  describe("Phase 10: Non-Linear Progression & Multi-Mission Expansion", () => {
    const missionA: MissionDefinition = {
      id: "mission_alpha",
      title: "Mission Alpha",
      description: "First independent opportunity",
      category: "SIDE",
      giverNpcId: "npc-clara",
      objectives: [
        {
          id: "obj_a1",
          type: "GO_TO_LOCATION",
          title: "Go to Alpha Point",
          description: "Travel to point A",
          target: { position: [20, 0, 10], radius: 4 },
        },
      ],
      rewards: { xp: 100 },
    };

    const missionB: MissionDefinition = {
      id: "mission_beta",
      title: "Mission Beta",
      description: "Second independent opportunity",
      category: "SIDE",
      giverNpcId: "npc-samuel",
      objectives: [
        {
          id: "obj_b1",
          type: "GO_TO_LOCATION",
          title: "Go to Beta Point",
          description: "Travel to point B",
          target: { position: [-30, 0, 20], radius: 4 },
        },
      ],
      rewards: { xp: 150 },
    };

    const missionC: MissionDefinition = {
      id: "mission_gamma",
      title: "Mission Gamma",
      description: "Third independent opportunity",
      category: "SIDE",
      giverNpcId: "npc-selene",
      objectives: [
        {
          id: "obj_c1",
          type: "INTERACT",
          title: "Interact with Gamma Relic",
          description: "Examine relic",
          target: { interactableId: "relic-gamma" },
        },
      ],
      requires: [{ type: "MISSION_COMPLETED", key: "mission_alpha" }],
      unlocks: ["mission_delta"],
      rewards: { xp: 200 },
    };

    beforeEach(() => {
      manager.registerMission(missionA);
      manager.registerMission(missionB);
      manager.registerMission(missionC);
    });

    it("supports multiple active missions simultaneously", () => {
      expect(manager.startMission("mission_alpha")).toBe(true);
      expect(manager.startMission("mission_beta")).toBe(true);

      const active = store.getActiveMissions();
      expect(active).toHaveLength(2);
      expect(manager.isMissionActive("mission_alpha")).toBe(true);
      expect(manager.isMissionActive("mission_beta")).toBe(true);
    });

    it("tracks only one mission at a time and defaults to first started", () => {
      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");

      expect(store.getTrackedMissionId()).toBe("mission_alpha");
      expect(store.getTrackedMission()?.id).toBe("mission_alpha");
    });

    it("switches tracked mission instantly without pausing or abandoning others", () => {
      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");

      manager.trackMission("mission_beta");
      expect(store.getTrackedMissionId()).toBe("mission_beta");
      expect(store.getTrackedMission()?.id).toBe("mission_beta");

      // Verify alpha is still active
      expect(manager.isMissionActive("mission_alpha")).toBe(true);
      expect(store.getInstance("mission_alpha")?.state).toBe("ACTIVE");
    });

    it("supports untracking a mission cleanly without abandoning it", () => {
      manager.startMission("mission_alpha");
      expect(store.getTrackedMissionId()).toBe("mission_alpha");

      manager.untrackMission("mission_alpha");
      expect(store.getTrackedMissionId()).toBeNull();
      expect(store.getTrackedMission()).toBeNull();

      // Mission is still active in the background
      expect(manager.isMissionActive("mission_alpha")).toBe(true);
    });

    it("completes missions in non-linear, out-of-order sequence", () => {
      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");

      // Complete Mission Beta first
      manager.completeObjective("mission_beta", "obj_b1");
      expect(manager.isMissionCompleted("mission_beta")).toBe(true);
      expect(manager.isMissionActive("mission_alpha")).toBe(true);

      // Now complete Mission Alpha
      manager.completeObjective("mission_alpha", "obj_a1");
      expect(manager.isMissionCompleted("mission_alpha")).toBe(true);

      expect(store.getCompletedMissions()).toContain("mission_alpha");
      expect(store.getCompletedMissions()).toContain("mission_beta");
    });

    it("automatically reassigns tracked mission when current tracked mission completes", () => {
      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");
      expect(store.getTrackedMissionId()).toBe("mission_alpha");

      // Complete tracked mission alpha
      manager.completeMission("mission_alpha");
      // Tracking should fall back to next active mission beta
      expect(store.getTrackedMissionId()).toBe("mission_beta");
    });

    it("evaluates conditional availability (requires and unlocks)", () => {
      // Gamma requires Alpha
      expect(store.getAvailableMissions()).not.toContain("mission_gamma");

      manager.startMission("mission_alpha");
      manager.completeMission("mission_alpha");

      expect(store.getAvailableMissions()).toContain("mission_gamma");
    });

    it("respects blockedBy rules preventing conflicting missions", () => {
      const blockedMission: MissionDefinition = {
        id: "mission_blocked",
        title: "Blocked Mission",
        description: "Should be blocked by beta",
        category: "SIDE",
        giverNpcId: "npc-elias",
        objectives: [
          {
            id: "b_obj",
            type: "TALK",
            title: "Wait",
            description: "Wait",
            target: { npcId: "npc-elias" },
          },
        ],
        blockedBy: ["mission_beta"],
        rewards: { xp: 50 },
      };
      manager.registerMission(blockedMission);

      // When beta is active, blockedMission is not available
      manager.startMission("mission_beta");
      manager.refreshAvailableMissions();
      expect(store.getAvailableMissions()).not.toContain("mission_blocked");
    });

    it("handles mission chaining automatically via chainNextMissionId", () => {
      const chainedStep2: MissionDefinition = {
        id: "chained_part_2",
        title: "Chained Mission Part 2",
        description: "Follows Part 1",
        category: "SIDE",
        giverNpcId: "npc-maya",
        objectives: [
          {
            id: "step2_obj",
            type: "TALK",
            title: "Report to Maya",
            description: "Talk to Maya",
            target: { npcId: "npc-maya" },
          },
        ],
        rewards: { xp: 150 },
      };
      const chainedStep1: MissionDefinition = {
        id: "chained_part_1",
        title: "Chained Mission Part 1",
        description: "Starts first",
        category: "SIDE",
        giverNpcId: "npc-maya",
        objectives: [
          {
            id: "step1_obj",
            type: "TALK",
            title: "Talk to Maya",
            description: "Initial talk",
            target: { npcId: "npc-maya" },
          },
        ],
        chainNextMissionId: "chained_part_2",
        rewards: { xp: 100 },
      };

      manager.registerMission(chainedStep2);
      manager.registerMission(chainedStep1);

      manager.startMission("chained_part_1");
      manager.completeMission("chained_part_1");

      // Chained step 2 should start automatically
      expect(manager.isMissionActive("chained_part_2")).toBe(true);
    });

    it("evaluates PREVIOUS_CHOICE and MISSION_DECLINED conditions correctly", () => {
      manager.declineMission("mission_alpha");
      expect(
        arePrerequisitesMet(
          [{ type: "MISSION_DECLINED", key: "mission_alpha" }],
          new Set(),
          flagStore,
          new Set(),
          new Set(["mission_alpha"]),
        ),
      ).toBe(true);

      flagStore.setFlag("player_chose_mercy", true);
      expect(
        arePrerequisitesMet(
          [{ type: "PREVIOUS_CHOICE", key: "player_chose_mercy", expectedValue: true }],
          new Set(),
          flagStore,
        ),
      ).toBe(true);
    });

    it("exports and imports serializable state snapshot for persistence", () => {
      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");
      manager.trackMission("mission_beta");
      manager.completeMission("mission_alpha");

      const snapshot = manager.exportState();
      expect(snapshot.completedMissions).toContain("mission_alpha");
      expect(snapshot.activeMissions.some((m) => m.id === "mission_beta")).toBe(true);
      expect(snapshot.trackedMissionId).toBe("mission_beta");

      // Create new clean store and restore
      const newStore = new MissionStore(registry);
      const newManager = new MissionManager(registry, newStore, eventBus);
      newManager.importState(snapshot);

      expect(newManager.isMissionCompleted("mission_alpha")).toBe(true);
      expect(newManager.isMissionActive("mission_beta")).toBe(true);
      expect(newStore.getTrackedMissionId()).toBe("mission_beta");
    });

    it("generates typed map markers for active missions and flags tracked state", () => {
      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");
      manager.trackMission("mission_beta");

      const markers = store.getMapMarkers();
      expect(markers).toHaveLength(2);

      const betaMarker = markers.find((m) => m.missionId === "mission_beta");
      expect(betaMarker?.tracked).toBe(true);
      expect(betaMarker?.position).toEqual([-30, 0, 20]);

      const alphaMarker = markers.find((m) => m.missionId === "mission_alpha");
      expect(alphaMarker?.tracked).toBe(false);
      expect(alphaMarker?.position).toEqual([20, 0, 10]);
    });

    it("shows ACTIVE_TARGET only for the currently tracked active mission", () => {
      const talkAlpha: MissionDefinition = {
        id: "talk_alpha",
        title: "Talk Alpha",
        description: "Talk to Clara",
        category: "SIDE",
        giverNpcId: "npc-clara",
        objectives: [
          {
            id: "talk_c",
            type: "TALK",
            title: "Talk Clara",
            description: "Talk",
            target: { npcId: "npc-clara" },
          },
        ],
        rewards: { xp: 50 },
      };
      const talkBeta: MissionDefinition = {
        id: "talk_beta",
        title: "Talk Beta",
        description: "Talk to Samuel",
        category: "SIDE",
        giverNpcId: "npc-samuel",
        objectives: [
          {
            id: "talk_s",
            type: "TALK",
            title: "Talk Samuel",
            description: "Talk",
            target: { npcId: "npc-samuel" },
          },
        ],
        rewards: { xp: 50 },
      };
      manager.registerMission(talkAlpha);
      manager.registerMission(talkBeta);

      manager.startMission("mission_alpha");
      manager.startMission("mission_beta");
      manager.startMission("talk_alpha");
      manager.startMission("talk_beta");
      manager.trackMission("talk_alpha");

      // Indicator for Clara should be ACTIVE_TARGET since alpha is tracked
      expect(store.getNpcMissionIndicator("npc-clara", registry)).toBe("ACTIVE_TARGET");
      // Indicator for Samuel should NOT be ACTIVE_TARGET since beta is untracked
      expect(store.getNpcMissionIndicator("npc-samuel", registry)).toBe("NONE");

      // Switch tracking to beta
      manager.trackMission("talk_beta");
      expect(store.getNpcMissionIndicator("npc-samuel", registry)).toBe("ACTIVE_TARGET");
      expect(store.getNpcMissionIndicator("npc-clara", registry)).toBe("NONE");
    });

    it("validates all 4 real Varanaya missions definitions", () => {
      const realMissions = [
        VARANAYA_SMALL_FAVOR,
        VARANAYA_MISSING_LEDGER,
        VARANAYA_HARBOR_LIGHTS,
        VARANAYA_GARDEN_WHISPERS,
      ];

      for (const m of realMissions) {
        expect(m.id).toBeTruthy();
        expect(m.title).toBeTruthy();
        expect(m.description).toBeTruthy();
        expect(m.giverNpcId).toBeTruthy();
        expect(m.objectives.length).toBeGreaterThan(0);
        expect(m.rewards.xp).toBeGreaterThan(0);
      }
    });
  });
});
