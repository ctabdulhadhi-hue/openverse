import { missionManager } from "@/game/missions/MissionManager";
import type { NPCController } from "@/game/npcs/NPCController";

import { filterAvailableChoices } from "./DialogueConditions";
import { dialogueEventBus, type DialogueEventBus } from "./DialogueEvents";
import { dialogueFlagStore, type DialogueFlagStore } from "./DialogueFlags";
import { dialogueStore, type DialogueStore } from "./DialogueStore";
import type { DialogueChoice, DialogueConversation, DialogueEffect } from "./DialogueTypes";

/**
 * DialogueRunner.
 *
 * Framework-agnostic execution engine managing the graph traversal of a dialogue conversation.
 * Handles node transitions, choice selection, effect application, and NPC state synchronization.
 */
export class DialogueRunner {
  private store: DialogueStore;
  private flagStore: DialogueFlagStore;
  private eventBus: DialogueEventBus;

  private currentConversation: DialogueConversation | null = null;
  private activeNPC: NPCController | null = null;
  private history: string[] = [];

  constructor(
    store: DialogueStore = dialogueStore,
    flagStore: DialogueFlagStore = dialogueFlagStore,
    eventBus: DialogueEventBus = dialogueEventBus,
  ) {
    this.store = store;
    this.flagStore = flagStore;
    this.eventBus = eventBus;
  }

  public getActiveConversation(): DialogueConversation | null {
    return this.currentConversation;
  }

  public getActiveNPC(): NPCController | null {
    return this.activeNPC;
  }

  public isActive(): boolean {
    return this.store.isActive();
  }

  /**
   * Start a new conversation.
   */
  public start(
    conversation: DialogueConversation,
    npc?: NPCController | null,
    playerPos?: [number, number, number],
  ): void {
    this.currentConversation = conversation;
    this.activeNPC = npc ?? null;
    this.history = [];

    // 1. If NPC is provided, halt wandering and face the player
    if (this.activeNPC) {
      this.activeNPC.transitionTo("TALKING", 999999);
      this.activeNPC.speed = 0;
      if (playerPos) {
        const dx = playerPos[0] - this.activeNPC.position[0];
        const dz = playerPos[2] - this.activeNPC.position[2];
        this.activeNPC.yaw = Math.atan2(dx, dz);
        this.activeNPC.headYaw = 0;
      }
    }

    // 2. Emit dialogue_started event
    this.eventBus.emit({
      type: "dialogue_started",
      conversationId: conversation.id,
      npcId: conversation.npcId,
      timestamp: Date.now(),
    });

    // 3. Load starting node
    this.goToNode(conversation.startNodeId);
  }

  /**
   * Navigate to a specific node by ID.
   */
  public goToNode(nodeId: string): void {
    if (!this.currentConversation) return;

    const node = this.currentConversation.nodes[nodeId];
    if (!node) {
      console.warn(`[DialogueRunner] Target node "${nodeId}" not found in conversation.`);
      this.end("missing_node");
      return;
    }

    this.history.push(nodeId);

    // 1. Apply node effects
    this.applyEffects(node.effects);

    // 2. Emit node entered event
    this.eventBus.emit({
      type: "dialogue_node_entered",
      conversationId: this.currentConversation.id,
      npcId: this.currentConversation.npcId,
      nodeId,
      node,
      timestamp: Date.now(),
    });

    // 3. Check for END node
    if (node.type === "END") {
      this.store.updateSnapshot({
        status: "ENDING",
        conversationId: this.currentConversation.id,
        npcId: this.currentConversation.npcId,
        speakerName: node.speaker,
        speakerRole: node.speakerRole ?? null,
        currentNodeId: node.id,
        currentNode: node,
        availableChoices: [],
        selectedChoiceIndex: 0,
        history: [...this.history],
      });
      return;
    }

    // 4. Filter choices based on condition flags
    const availableChoices = filterAvailableChoices(node.choices, this.flagStore);
    const hasChoices = availableChoices.length > 0;

    this.store.updateSnapshot({
      status: hasChoices ? "WAITING_FOR_CHOICE" : "ACTIVE",
      conversationId: this.currentConversation.id,
      npcId: this.currentConversation.npcId,
      speakerName: node.speaker,
      speakerRole: node.speakerRole ?? null,
      currentNodeId: node.id,
      currentNode: node,
      availableChoices,
      selectedChoiceIndex: 0,
      history: [...this.history],
    });
  }

  /**
   * Advance to next node if current node is a standard text node with nextNodeId.
   */
  public advance(): boolean {
    const currentNode = this.store.getCurrentNode();
    if (!currentNode) return false;

    // If currently ending, conclude the conversation
    if (this.store.getStatus() === "ENDING" || currentNode.type === "END") {
      this.end("concluded");
      return true;
    }

    // If choices are present, player must pick a choice instead of plain advancing
    const choices = this.store.getChoices();
    if (choices.length > 0) {
      return false;
    }

    // Advance along nextNodeId
    if (currentNode.nextNodeId) {
      this.goToNode(currentNode.nextNodeId);
      return true;
    }

    // If no nextNodeId and no choices, dialogue concludes
    this.end("concluded");
    return true;
  }

  /**
   * Select a choice by its index in availableChoices.
   */
  public selectChoice(choiceIndex: number): boolean {
    const choices = this.store.getChoices();
    if (choiceIndex < 0 || choiceIndex >= choices.length) {
      return false;
    }

    const choice = choices[choiceIndex];
    if (!choice) return false;
    return this.executeChoice(choice);
  }

  /**
   * Select a choice by choice ID.
   */
  public selectChoiceById(choiceId: string): boolean {
    const choices = this.store.getChoices();
    const choice = choices.find((c) => c.id === choiceId);
    if (!choice) return false;

    return this.executeChoice(choice);
  }

  private executeChoice(choice: DialogueChoice): boolean {
    if (!this.currentConversation) return false;

    const currentNode = this.store.getCurrentNode();

    // 1. Apply choice effects
    this.applyEffects(choice.effects);

    // 2. Emit choice selected event
    this.eventBus.emit({
      type: "dialogue_choice_selected",
      conversationId: this.currentConversation.id,
      npcId: this.currentConversation.npcId,
      nodeId: currentNode?.id,
      choiceId: choice.id,
      choice,
      timestamp: Date.now(),
    });

    // 3. Transition to destination node
    this.goToNode(choice.nextNodeId);
    return true;
  }

  /**
   * End active dialogue conversation cleanly.
   */
  public end(reason = "normal"): void {
    if (!this.currentConversation && !this.store.isActive()) {
      return;
    }

    const convId = this.currentConversation?.id ?? "";
    const npcId = this.currentConversation?.npcId ?? "";

    // 1. Restore NPC controller behavior
    if (this.activeNPC && this.activeNPC.state === "TALKING") {
      this.activeNPC.transitionTo("IDLE", 2.0);
    }

    // 2. Emit dialogue_ended event
    this.eventBus.emit({
      type: "dialogue_ended",
      conversationId: convId,
      npcId,
      reason,
      timestamp: Date.now(),
    });

    // 3. Reset internal references
    this.currentConversation = null;
    this.activeNPC = null;
    this.history = [];

    // 4. Reset store
    this.store.reset();
  }

  private applyEffects(effects?: DialogueEffect[]): void {
    if (!effects || effects.length === 0) return;

    for (const effect of effects) {
      if (effect.type === "setFlag") {
        this.flagStore.setFlag(effect.flagKey, effect.value);
      } else if (effect.type === "startMission") {
        missionManager.startMission(effect.missionId);
      } else if (effect.type === "declineMission") {
        missionManager.declineMission(effect.missionId);
      } else if (effect.type === "completeMission") {
        missionManager.completeMission(effect.missionId);
      } else if (effect.type === "completeObjective") {
        missionManager.completeObjective(effect.missionId, effect.objectiveId);
      }
    }
  }
}

export const dialogueRunner = new DialogueRunner();
