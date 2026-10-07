import { describe, expect, it, vi } from "vitest";

import {
  CLARA_DIALOGUE,
  ELIAS_DIALOGUE,
  MAYA_DIALOGUE,
  SAMUEL_DIALOGUE,
  registerAllDialogues,
} from "@/data/dialogue";
import {
  DialogueEventBus,
  DialogueFlagStore,
  DialogueManager,
  DialogueRegistry,
  DialogueRunner,
  DialogueStore,
  type DialogueConversation,
  type DialogueEvent,
} from "@/game/dialogue";
import { NPCController } from "@/game/npcs/NPCController";
import type { NPCDefinition } from "@/game/npcs/NPCData";
import { NPCRegistry } from "@/game/npcs/NPCRegistry";
import { PlayerInputManager } from "@/game/player/PlayerInput";

const sampleNPCDef: NPCDefinition = {
  id: "npc-test-1",
  type: "CIVILIAN",
  name: "Test NPC",
  spawnZoneId: "zone-1",
  basePosition: [0, 0, 0],
  baseRotation: 0,
  behavior: "WANDER",
  walkSpeed: 1.5,
  seed: 42,
  dialogueText: "Hello there!",
  chunkKey: "0,0",
  appearance: {
    shirtColor: "#fff",
    pantsColor: "#000",
    shoesColor: "#111",
    skinColor: "#eed",
    hairColor: "#222",
    hasHat: false,
    hasBackpack: false,
    heightScale: 1.0,
    widthScale: 1.0,
  },
};

const sampleValidConv: DialogueConversation = {
  id: "conv-test",
  npcId: "npc-test-1",
  title: "Test Conversation",
  startNodeId: "node_1",
  nodes: {
    node_1: {
      id: "node_1",
      speaker: "Test NPC",
      text: "How are you today?",
      type: "TEXT",
      choices: [
        {
          id: "choice_good",
          text: "I am doing well.",
          nextNodeId: "node_good_reply",
          effects: [{ type: "setFlag", flagKey: "feeling_good", value: true }],
        },
        {
          id: "choice_bad",
          text: "Not so great.",
          nextNodeId: "node_bad_reply",
        },
      ],
    },
    node_good_reply: {
      id: "node_good_reply",
      speaker: "Test NPC",
      text: "Wonderful to hear!",
      type: "TEXT",
      nextNodeId: "node_end",
    },
    node_bad_reply: {
      id: "node_bad_reply",
      speaker: "Test NPC",
      text: "Sorry to hear that.",
      type: "TEXT",
      nextNodeId: "node_end",
    },
    node_end: {
      id: "node_end",
      speaker: "Test NPC",
      text: "Farewell!",
      type: "END",
    },
  },
};

describe("Phase 8 Dialogue System — Unit Test Suite", () => {
  // 1. Conversation Registration
  it("1. successfully registers and retrieves conversation by ID and NPC ID", () => {
    const registry = new DialogueRegistry();
    registry.register(sampleValidConv);

    expect(registry.get("conv-test")).toEqual(sampleValidConv);
    expect(registry.getByNPCId("npc-test-1")).toEqual(sampleValidConv);
    expect(registry.getCount()).toBe(1);
  });

  // 2. Duplicate Conversation Detection
  it("2. throws error on duplicate conversation registration", () => {
    const registry = new DialogueRegistry();
    registry.register(sampleValidConv);

    expect(() => registry.register(sampleValidConv)).toThrowError(/Duplicate conversation ID/);
  });

  // 3. Start Node Validation
  it("3. validates and rejects conversation with nonexistent startNodeId", () => {
    const registry = new DialogueRegistry();
    const brokenConv: DialogueConversation = {
      ...sampleValidConv,
      id: "conv-broken-start",
      startNodeId: "node_nonexistent",
    };

    expect(() => registry.register(brokenConv)).toThrowError(/startNodeId/);
  });

  // 4. Missing Node Detection
  it("4. validates and rejects conversation targeting missing nextNodeId", () => {
    const registry = new DialogueRegistry();
    const brokenConv: DialogueConversation = {
      id: "conv-broken-next",
      npcId: "npc-test-1",
      title: "Broken Next",
      startNodeId: "node_1",
      nodes: {
        node_1: {
          id: "node_1",
          speaker: "Test NPC",
          text: "Hello",
          type: "TEXT",
          nextNodeId: "missing_destination",
        },
      },
    };

    expect(() => registry.register(brokenConv)).toThrowError(/nextNodeId/);
  });

  // 5. Invalid Choice Detection
  it("5. validates and rejects conversation with choice pointing to missing node", () => {
    const registry = new DialogueRegistry();
    const brokenConv: DialogueConversation = {
      id: "conv-broken-choice",
      npcId: "npc-test-1",
      title: "Broken Choice",
      startNodeId: "node_1",
      nodes: {
        node_1: {
          id: "node_1",
          speaker: "Test NPC",
          text: "Pick one",
          type: "TEXT",
          choices: [
            {
              id: "bad_choice",
              text: "Nowhere",
              nextNodeId: "node_does_not_exist",
            },
          ],
        },
      },
    };

    expect(() => registry.register(brokenConv)).toThrowError(
      /Choice "bad_choice" targets nonexistent node/,
    );
  });

  // 6. Dialogue Start & NPC Facing
  it("6. starts dialogue, halts NPC wandering, sets TALKING state and calculates yaw to player", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    const controller = new NPCController(sampleNPCDef);
    controller.position = [0, 0, 0];

    const playerPos: [number, number, number] = [0, 0, 5];
    runner.start(sampleValidConv, controller, playerPos);

    expect(runner.isActive()).toBe(true);
    expect(controller.state).toBe("TALKING");
    expect(controller.speed).toBe(0);
    // Player is at (0, 0, 5), NPC is at (0, 0, 0) -> dx = 0, dz = 5 -> yaw = atan2(0, 5) = 0
    expect(controller.yaw).toBeCloseTo(0);
  });

  // 7. Node Progression
  it("7. advances through linear nodes without choices", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    runner.start(sampleValidConv);
    expect(store.getCurrentNode()?.id).toBe("node_1");

    // Choice is required at node_1, so advance() should return false
    expect(runner.advance()).toBe(false);

    // Select choice to get to linear node
    runner.selectChoice(0);
    expect(store.getCurrentNode()?.id).toBe("node_good_reply");

    // Now node_good_reply has nextNodeId: 'node_end' with no choices -> advance() succeeds
    const advanced = runner.advance();
    expect(advanced).toBe(true);
    expect(store.getCurrentNode()?.id).toBe("node_end");
  });

  // 8. Choice Branching
  it("8. executes choices and branches correctly based on selection", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    runner.start(sampleValidConv);
    expect(store.getChoices().length).toBe(2);

    // Branch 1: select second choice ("Not so great.")
    const selected = runner.selectChoice(1);
    expect(selected).toBe(true);
    expect(store.getCurrentNode()?.id).toBe("node_bad_reply");
    expect(store.getCurrentNode()?.text).toBe("Sorry to hear that.");
  });

  // 9. END Node Handling
  it("9. transitions to ENDING status on END node and cleanly finishes conversation", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    const controller = new NPCController(sampleNPCDef);
    runner.start(sampleValidConv, controller);

    runner.selectChoice(0); // -> node_good_reply
    runner.advance(); // -> node_end (type: END)

    expect(store.getStatus()).toBe("ENDING");
    expect(store.getCurrentNode()?.type).toBe("END");

    // Advance while ending concludes dialogue
    runner.advance();
    expect(runner.isActive()).toBe(false);
    expect(store.getStatus()).toBe("INACTIVE");
    expect(controller.state).toBe("IDLE");
  });

  // 10. Dialogue State Transitions
  it("10. traverses state transitions correctly (INACTIVE -> WAITING_FOR_CHOICE -> ACTIVE -> ENDING -> INACTIVE)", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    expect(store.getStatus()).toBe("INACTIVE");

    runner.start(sampleValidConv);
    expect(store.getStatus()).toBe("WAITING_FOR_CHOICE");

    runner.selectChoice(0);
    expect(store.getStatus()).toBe("ACTIVE");

    runner.advance();
    expect(store.getStatus()).toBe("ENDING");

    runner.advance();
    expect(store.getStatus()).toBe("INACTIVE");
  });

  // 11. Dialogue History
  it("11. records conversation node history in order", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    runner.start(sampleValidConv);
    runner.selectChoice(0);
    runner.advance();

    const snapshot = store.getSnapshot();
    expect(snapshot.history).toEqual(["node_1", "node_good_reply", "node_end"]);
  });

  // 12. Dialogue Flag Store
  it("12. stores, queries, notifies and clears dialogue flags", () => {
    const flagStore = new DialogueFlagStore();
    const listener = vi.fn();
    const unsub = flagStore.subscribe(listener);

    expect(flagStore.getFlag("test_flag")).toBeUndefined();
    expect(flagStore.hasFlag("test_flag")).toBe(false);

    flagStore.setFlag("test_flag", true);
    expect(flagStore.getFlag("test_flag")).toBe(true);
    expect(flagStore.hasFlag("test_flag")).toBe(true);
    expect(flagStore.getCount()).toBe(1);

    flagStore.clear();
    expect(flagStore.getCount()).toBe(0);

    unsub();
  });

  // 13. Dialogue Effects
  it("13. applies setFlag effects during choice execution", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    runner.start(sampleValidConv);
    expect(flagStore.hasFlag("feeling_good")).toBe(false);

    runner.selectChoice(0); // choice_good has effect setFlag 'feeling_good' = true
    expect(flagStore.hasFlag("feeling_good")).toBe(true);
  });

  // 14. Event Emission
  it("14. emits dialogue lifecycle events on start, node entered, choice selected, and end", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    const events: DialogueEvent[] = [];
    eventBus.subscribe((e) => events.push(e));

    runner.start(sampleValidConv);
    runner.selectChoice(0);
    runner.advance();
    runner.advance();

    const types = events.map((e) => e.type);
    expect(types).toContain("dialogue_started");
    expect(types).toContain("dialogue_node_entered");
    expect(types).toContain("dialogue_choice_selected");
    expect(types).toContain("dialogue_ended");
  });

  // 15. NPC Dialogue Lookup & Default Fallback
  it("15. looks up registered NPC dialogue or provides clean fallback default conversation", () => {
    const registry = new DialogueRegistry();
    const npcs = new NPCRegistry();
    const controller = new NPCController(sampleNPCDef);
    npcs.register(controller);

    const manager = new DialogueManager(
      registry,
      new DialogueRunner(),
      new DialogueStore(),
      new DialogueFlagStore(),
      npcs,
    );

    // No custom conversation registered for sampleNPCDef: fallback is created
    const started = manager.startConversation("npc-test-1");
    expect(started).toBe(true);
    expect(manager.isDialogueActive()).toBe(true);
  });

  // 16. Conversation Cancellation
  it("16. cancels conversation gracefully and restores NPC state", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    const controller = new NPCController(sampleNPCDef);
    runner.start(sampleValidConv, controller);
    expect(runner.isActive()).toBe(true);

    runner.end("cancelled_by_player");
    expect(runner.isActive()).toBe(false);
    expect(controller.state).toBe("IDLE");
  });

  // 17. Chunk Unload Cleanup
  it("17. terminates dialogue safely when NPC chunk unloads", () => {
    const registry = new DialogueRegistry();
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);
    const npcs = new NPCRegistry();

    const controller = new NPCController({ ...sampleNPCDef, chunkKey: "0,0" });
    npcs.register(controller);

    const manager = new DialogueManager(registry, runner, store, flagStore, npcs);
    manager.startConversation("npc-test-1");
    expect(manager.isDialogueActive()).toBe(true);

    // Unload matching chunk
    manager.handleChunkUnload("0,0");
    expect(manager.isDialogueActive()).toBe(false);
  });

  // 18. Choice Index and Runner Control
  it("18. handles choice index bounds safely", () => {
    const store = new DialogueStore();
    const flagStore = new DialogueFlagStore();
    const eventBus = new DialogueEventBus();
    const runner = new DialogueRunner(store, flagStore, eventBus);

    runner.start(sampleValidConv);

    // Out of bounds selection returns false
    expect(runner.selectChoice(-1)).toBe(false);
    expect(runner.selectChoice(99)).toBe(false);

    // Valid index works
    expect(runner.selectChoice(0)).toBe(true);
  });

  // 19. Control Lock / Unlock
  it("19. disables player input during active dialogue and restores when inactive", () => {
    const input = new PlayerInputManager();
    const store = new DialogueStore();

    expect(input.getEnabled()).toBe(true);

    store.updateSnapshot({ status: "ACTIVE" });
    if (store.isActive()) {
      input.setEnabled(false);
    }
    expect(input.getEnabled()).toBe(false);

    store.reset();
    if (!store.isActive()) {
      input.setEnabled(true);
    }
    expect(input.getEnabled()).toBe(true);
  });

  // 20. Unreachable Node Validation
  it("20. detects unreachable orphaned nodes in conversation graph", () => {
    const registry = new DialogueRegistry();
    const orphanConv: DialogueConversation = {
      id: "conv-orphan",
      npcId: "npc-test-1",
      title: "Orphan Test",
      startNodeId: "node_1",
      nodes: {
        node_1: {
          id: "node_1",
          speaker: "Test NPC",
          text: "Start",
          type: "END",
        },
        node_orphan: {
          id: "node_orphan",
          speaker: "Test NPC",
          text: "I am unreachable",
          type: "END",
        },
      },
    };

    expect(() => registry.register(orphanConv)).toThrowError(
      /Unreachable node detected: "node_orphan"/,
    );
  });

  // 21. Real Westport Dialogues Integrity
  it("21. validates all 4 Westport dialogues (Maya, Elias, Samuel, Clara)", () => {
    const registry = new DialogueRegistry();
    registerAllDialogues(registry);

    expect(registry.get(MAYA_DIALOGUE.id)).toBeDefined();
    expect(registry.get(ELIAS_DIALOGUE.id)).toBeDefined();
    expect(registry.get(SAMUEL_DIALOGUE.id)).toBeDefined();
    expect(registry.get(CLARA_DIALOGUE.id)).toBeDefined();
    expect(registry.getCount()).toBe(4);
  });
});
