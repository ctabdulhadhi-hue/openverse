import { interactionRegistry, interactionStore, type InteractionTarget } from "@/game/interaction";

import type { NPCController } from "./NPCController";

/**
 * NPC Interaction Helper Functions for OPENVERSE (Phase 7).
 * Integrates directly with Phase 6 InteractionRegistry and InteractionStore.
 */

export function createNPCInteractionTarget(controller: NPCController): InteractionTarget {
  return {
    id: `npc-${controller.id}`,
    name: controller.def.name,
    type: "TALK",
    promptLabel: "TALK",
    position: controller.position,
    range: controller.config.interactionRange,
    priority: 15,
    enabled: true,
    chunkKey: controller.def.chunkKey,
    requiresLineOfSight: false,
    action: () => {
      interactionStore.openReadable({
        title: controller.def.name,
        subtitle: controller.def.title
          ? `${controller.def.title} • ${controller.def.type}`
          : controller.def.type,
        location: "Westport Town",
        content: controller.def.dialogueText,
      });
    },
  };
}

export function registerNPCInteraction(controller: NPCController): void {
  const target = createNPCInteractionTarget(controller);
  interactionRegistry.register(target);
}

export function unregisterNPCInteraction(id: string): void {
  interactionRegistry.unregister(`npc-${id}`);
}

export function updateNPCInteractionPosition(id: string, position: [number, number, number]): void {
  const target = interactionRegistry.get(`npc-${id}`);
  if (target) {
    target.position = position;
  }
}
