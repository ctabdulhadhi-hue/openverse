import { beforeEach, describe, expect, it } from "vitest";

import { MAYA_DIALOGUE, SAMUEL_DIALOGUE } from "@/data/dialogue";
import { evaluateDialogueCondition, filterAvailableChoices } from "@/game/dialogue/DialogueConditions";
import { DialogueFlagStore } from "@/game/dialogue/DialogueFlags";
import { discoveryStore } from "@/game/discovery";
import { npcRoutineSystem } from "@/game/npcs/NPCRoutineSystem";
import { worldEventManager } from "@/game/world/events";

describe("Phase 5 — Living World & Dynamic Gameplay Systems", () => {
  beforeEach(() => {
    discoveryStore.reset();
    worldEventManager.reset();
  });

  describe("1. NPC Daily Routine & Schedule Transitions", () => {
    it("resolves Samuel Drake's daily schedule across morning, afternoon, evening, and night", () => {
      // 08:00 AM (Morning) — Harbor dockside inspection
      const morning = npcRoutineSystem.getScheduleForNPC("npc-samuel", 8, "CLEAR");
      expect(morning.activity).toBe("WORK");
      expect(morning.targetPosition).toEqual([24.0, 0.1, 14.0]);
      expect(morning.isSheltered).toBe(false);

      // 14:00 PM (Afternoon) — Market freight coordination
      const afternoon = npcRoutineSystem.getScheduleForNPC("npc-samuel", 14, "CLEAR");
      expect(afternoon.activity).toBe("TRADE");
      expect(afternoon.targetPosition).toEqual([28.0, 0.1, 20.0]);

      // 18:00 PM (Evening) — Causeway ocean approach
      const evening = npcRoutineSystem.getScheduleForNPC("npc-samuel", 18, "CLEAR");
      expect(evening.activity).toBe("STROLL");
      expect(evening.targetPosition).toEqual([42.0, 0.1, 16.0]);

      // 23:00 PM (Night) — Harbor rest
      const night = npcRoutineSystem.getScheduleForNPC("npc-samuel", 23, "CLEAR");
      expect(night.activity).toBe("REST");
      expect(night.targetPosition).toEqual([26.0, 0.1, 12.0]);
    });

    it("triggers shelter behavior when weather shifts to coastal mist", () => {
      // During MIST at 08:00 AM, Samuel moves to covered shelter position
      const mistSchedule = npcRoutineSystem.getScheduleForNPC("npc-samuel", 8, "MIST");
      expect(mistSchedule.activity).toBe("SHELTER");
      expect(mistSchedule.isSheltered).toBe(true);
      expect(mistSchedule.targetPosition).toEqual([26.0, 0.1, 16.0]);
    });

    it("transitions Maya Lin toward Grand Sanctuary in the evening", () => {
      // 18:00 PM — Sanctuary Torana arch observation
      const eveningMaya = npcRoutineSystem.getScheduleForNPC("npc-maya", 18, "CLEAR");
      expect(eveningMaya.activity).toBe("WORSHIP");
      expect(eveningMaya.targetPosition).toEqual([0.0, 0.1, -26.0]);
    });
  });

  describe("2. Dynamic World Event Lifecycle & Conditions", () => {
    it("activates HARBOR_RUSH during morning hours and deactivates after window", () => {
      // At 08:00 AM Clear, HARBOR_RUSH is active
      const morningEvents = worldEventManager.evaluate(8, "CLEAR");
      expect(worldEventManager.isEventActive("HARBOR_RUSH")).toBe(true);
      expect(morningEvents.some((e) => e.type === "HARBOR_RUSH")).toBe(true);

      // At 11:00 AM Clear, HARBOR_RUSH deactivates
      worldEventManager.evaluate(11, "CLEAR");
      expect(worldEventManager.isEventActive("HARBOR_RUSH")).toBe(false);
    });

    it("activates TEMPLE_BELL_HOUR during golden hour and deactivates at night", () => {
      // At 18:00 PM Golden Hour
      worldEventManager.evaluate(18, "GOLDEN_HOUR");
      expect(worldEventManager.isEventActive("TEMPLE_BELL_HOUR")).toBe(true);

      // At 21:00 PM Night
      worldEventManager.evaluate(21, "CLEAR");
      expect(worldEventManager.isEventActive("TEMPLE_BELL_HOUR")).toBe(false);
    });

    it("activates COASTAL_MIST_CALL only during mist weather", () => {
      worldEventManager.evaluate(12, "CLEAR");
      expect(worldEventManager.isEventActive("COASTAL_MIST_CALL")).toBe(false);

      worldEventManager.evaluate(12, "MIST");
      expect(worldEventManager.isEventActive("COASTAL_MIST_CALL")).toBe(true);
    });

    it("notifies subscribers and unsubscribes cleanly without memory leaks", () => {
      let notifiedCount = 0;
      const unsubscribe = worldEventManager.subscribe(() => {
        notifiedCount++;
      });

      worldEventManager.evaluate(8, "CLEAR");
      expect(notifiedCount).toBeGreaterThanOrEqual(2); // Initial subscribe + evaluation update

      unsubscribe();
      const prevCount = notifiedCount;
      worldEventManager.evaluate(18, "GOLDEN_HOUR");
      expect(notifiedCount).toBe(prevCount); // No further notifications after unsubscribe
    });
  });

  describe("3. World Reactivity & Discovery-Driven Dialogue", () => {
    it("evaluates locationDiscovered condition accurately via discoveryStore", () => {
      const flagStore = new DialogueFlagStore();

      // Before discovery
      expect(
        evaluateDialogueCondition(
          { type: "locationDiscovered", locationId: "outer-island-sanctuary" },
          flagStore,
        ),
      ).toBe(false);

      // Discover Outer Island
      discoveryStore.discoverById("outer-island-sanctuary");

      // After discovery
      expect(
        evaluateDialogueCondition(
          { type: "locationDiscovered", locationId: "outer-island-sanctuary" },
          flagStore,
        ),
      ).toBe(true);
    });

    it("dynamically unlocks Samuel's causeway dialogue after player discovers outer island", () => {
      const flagStore = new DialogueFlagStore();
      const greetingChoices = SAMUEL_DIALOGUE.nodes.node_greeting!.choices;

      // Initially, causeway discovery choice is hidden
      const initialAvailable = filterAvailableChoices(greetingChoices, flagStore);
      expect(initialAvailable.some((c) => c.id === "choice_samuel_causeway_discovery")).toBe(false);

      // Player reaches and discovers outer island
      discoveryStore.discoverById("outer-island-sanctuary");

      // Now the choice is dynamically available
      const updatedAvailable = filterAvailableChoices(greetingChoices, flagStore);
      expect(updatedAvailable.some((c) => c.id === "choice_samuel_causeway_discovery")).toBe(true);
    });

    it("dynamically unlocks Maya's sanctuary dialogue after player discovers Grand Sanctuary", () => {
      const flagStore = new DialogueFlagStore();
      const mayaChoices = MAYA_DIALOGUE.nodes.node_greeting!.choices;

      // Discover grand sanctuary
      discoveryStore.discoverById("grand-sanctuary");

      const available = filterAvailableChoices(mayaChoices, flagStore);
      expect(available.some((c) => c.id === "choice_maya_sanctuary_discovery")).toBe(true);
    });
  });
});
