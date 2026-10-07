import type { NPCController } from "@/game/npcs/NPCController";
import { npcRegistry, type NPCRegistry } from "@/game/npcs/NPCRegistry";

import { dialogueFlagStore, type DialogueFlagStore } from "./DialogueFlags";
import { dialogueRegistry, type DialogueRegistry } from "./DialogueRegistry";
import { dialogueRunner, type DialogueRunner } from "./DialogueRunner";
import { dialogueStore, type DialogueStore } from "./DialogueStore";
import type { DialogueConversation } from "./DialogueTypes";

/**
 * DialogueManager.
 *
 * Central coordinator linking registry, runner, NPC entities, and streaming lifecycle.
 */
export class DialogueManager {
  private registry: DialogueRegistry;
  private runner: DialogueRunner;
  private store: DialogueStore;
  private flagStore: DialogueFlagStore;
  private npcs: NPCRegistry;

  constructor(
    registry: DialogueRegistry = dialogueRegistry,
    runner: DialogueRunner = dialogueRunner,
    store: DialogueStore = dialogueStore,
    flagStore: DialogueFlagStore = dialogueFlagStore,
    npcs: NPCRegistry = npcRegistry,
  ) {
    this.registry = registry;
    this.runner = runner;
    this.store = store;
    this.flagStore = flagStore;
    this.npcs = npcs;
  }

  public isDialogueActive(): boolean {
    return this.runner.isActive();
  }

  /**
   * Start a conversation with an NPC by its unique NPC ID or controller instance.
   */
  public startConversation(
    npcOrId: string | NPCController,
    playerPos?: [number, number, number],
  ): boolean {
    const npc = typeof npcOrId === "string" ? this.npcs.get(npcOrId) : npcOrId;
    const npcId = typeof npcOrId === "string" ? npcOrId : npcOrId.id;

    // Retrieve conversation from registry
    let conversation = this.registry.getByNPCId(npcId);

    // Fallback if no specific conversation is registered: generate conversational tree from NPC metadata
    if (!conversation && npc) {
      conversation = this.createDefaultConversation(
        npc.id,
        npc.def.name,
        npc.def.title ?? npc.def.type,
        npc.def.dialogueText,
      );
    }

    if (!conversation) {
      console.warn(`[DialogueManager] No dialogue found for NPC "${npcId}".`);
      return false;
    }

    this.runner.start(conversation, npc, playerPos);
    return true;
  }

  /**
   * Conclude current dialogue cleanly.
   */
  public endConversation(reason = "normal"): void {
    this.runner.end(reason);
  }

  /**
   * Streaming safety check: if chunk unloads, terminate dialogue safely.
   */
  public handleChunkUnload(chunkKey: string): void {
    const activeNPC = this.runner.getActiveNPC();
    if (activeNPC && activeNPC.def.chunkKey === chunkKey) {
      this.endConversation("chunk_unloaded");
    }
  }

  /**
   * Despawn safety check: if active NPC is despawned, terminate dialogue safely.
   */
  public handleNPCDespawn(npcId: string): void {
    const activeNPC = this.runner.getActiveNPC();
    if (activeNPC && activeNPC.id === npcId) {
      this.endConversation("npc_despawned");
    }
  }

  /**
   * Proximity check: terminate dialogue if player moves too far.
   */
  public checkProximity(playerPos: [number, number, number], maxDistance = 9.0): void {
    const activeNPC = this.runner.getActiveNPC();
    if (!activeNPC || !this.isDialogueActive()) return;

    const dx = playerPos[0] - activeNPC.position[0];
    const dz = playerPos[2] - activeNPC.position[2];
    const dist = Math.hypot(dx, dz);

    if (dist > maxDistance) {
      this.endConversation("distance_exceeded");
    }
  }

  private createDefaultConversation(
    npcId: string,
    speakerName: string,
    speakerRole: string,
    dialogueText: string,
  ): DialogueConversation {
    return {
      id: `default-${npcId}`,
      npcId,
      title: `${speakerName} Dialogue`,
      startNodeId: "node_start",
      nodes: {
        node_start: {
          id: "node_start",
          speaker: speakerName,
          speakerRole,
          text: dialogueText,
          type: "TEXT",
          choices: [
            {
              id: "choice_thanks",
              text: "Thank you for the information.",
              nextNodeId: "node_end",
            },
          ],
        },
        node_end: {
          id: "node_end",
          speaker: speakerName,
          speakerRole,
          text: "Safe travels out there.",
          type: "END",
        },
      },
    };
  }

  public reset(): void {
    this.endConversation("reset");
    this.flagStore.clear();
  }
}

export const dialogueManager = new DialogueManager();
