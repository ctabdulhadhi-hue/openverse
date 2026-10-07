import type { DialogueConversation } from "./DialogueTypes";

export interface DialogueValidationError {
  conversationId: string;
  field: string;
  message: string;
}

/**
 * DialogueRegistry.
 *
 * Central catalog of all registered dialogue trees in OPENVERSE.
 * Validates conversational graph integrity at registration time.
 */
export class DialogueRegistry {
  private conversations = new Map<string, DialogueConversation>();
  private npcIndex = new Map<string, string>(); // npcId -> conversationId

  /**
   * Register a conversation tree and validate its graph integrity.
   */
  public register(conversation: DialogueConversation): void {
    if (this.conversations.has(conversation.id)) {
      throw new Error(`[DialogueRegistry] Duplicate conversation ID: "${conversation.id}"`);
    }

    const errors = this.validateConversation(conversation);
    if (errors.length > 0) {
      const errList = errors.map((e) => `${e.field}: ${e.message}`).join("; ");
      throw new Error(`[DialogueRegistry] Invalid conversation "${conversation.id}": ${errList}`);
    }

    this.conversations.set(conversation.id, conversation);
    this.npcIndex.set(conversation.npcId, conversation.id);
  }

  /**
   * Retrieve conversation by conversation ID.
   */
  public get(id: string): DialogueConversation | undefined {
    return this.conversations.get(id);
  }

  /**
   * Retrieve conversation associated with an NPC ID.
   */
  public getByNPCId(npcId: string): DialogueConversation | undefined {
    const convId = this.npcIndex.get(npcId);
    if (!convId) return undefined;
    return this.conversations.get(convId);
  }

  /**
   * Get all registered conversations.
   */
  public getAll(): DialogueConversation[] {
    return Array.from(this.conversations.values());
  }

  public getCount(): number {
    return this.conversations.size;
  }

  public clear(): void {
    this.conversations.clear();
    this.npcIndex.clear();
  }

  /**
   * Validate conversational graph integrity.
   */
  public validateConversation(conv: DialogueConversation): DialogueValidationError[] {
    const errors: DialogueValidationError[] = [];

    // 1. Check startNodeId exists
    if (!conv.startNodeId || !conv.nodes[conv.startNodeId]) {
      errors.push({
        conversationId: conv.id,
        field: "startNodeId",
        message: `Start node "${conv.startNodeId}" does not exist in nodes dictionary`,
      });
    }

    // 2. Validate node destinations and choices
    let hasEndNode = false;
    const referencedNodeIds = new Set<string>();
    if (conv.startNodeId) {
      referencedNodeIds.add(conv.startNodeId);
    }

    for (const [nodeId, node] of Object.entries(conv.nodes)) {
      if (node.id !== nodeId) {
        errors.push({
          conversationId: conv.id,
          field: `nodes[${nodeId}].id`,
          message: `Node key "${nodeId}" does not match internal node ID "${node.id}"`,
        });
      }

      if (node.type === "END") {
        hasEndNode = true;
      }

      // Check nextNodeId
      if (node.nextNodeId) {
        referencedNodeIds.add(node.nextNodeId);
        if (!conv.nodes[node.nextNodeId]) {
          errors.push({
            conversationId: conv.id,
            field: `nodes[${nodeId}].nextNodeId`,
            message: `Target nextNodeId "${node.nextNodeId}" does not exist`,
          });
        }
      }

      // Check choices
      if (node.choices && node.choices.length > 0) {
        for (let i = 0; i < node.choices.length; i++) {
          const choice = node.choices[i];
          if (!choice) continue;
          referencedNodeIds.add(choice.nextNodeId);
          if (!conv.nodes[choice.nextNodeId]) {
            errors.push({
              conversationId: conv.id,
              field: `nodes[${nodeId}].choices[${i}].nextNodeId`,
              message: `Choice "${choice.id}" targets nonexistent node "${choice.nextNodeId}"`,
            });
          }
        }
      }
    }

    // 3. Ensure an END node or terminal leaf exists
    if (!hasEndNode) {
      const hasLeafNode = Object.values(conv.nodes).some(
        (n) => !n.nextNodeId && (!n.choices || n.choices.length === 0),
      );
      if (!hasLeafNode) {
        errors.push({
          conversationId: conv.id,
          field: "nodes",
          message: `Conversation has no END node and no terminal leaf node to conclude dialogue`,
        });
      }
    }

    // 4. Check for unreachable nodes
    for (const nodeId of Object.keys(conv.nodes)) {
      if (!referencedNodeIds.has(nodeId)) {
        errors.push({
          conversationId: conv.id,
          field: `nodes[${nodeId}]`,
          message: `Unreachable node detected: "${nodeId}"`,
        });
      }
    }

    return errors;
  }
}

export const dialogueRegistry = new DialogueRegistry();
