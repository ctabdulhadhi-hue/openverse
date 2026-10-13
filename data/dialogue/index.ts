import { dialogueRegistry, type DialogueRegistry } from "@/game/dialogue/DialogueRegistry";
import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

import { LAGOON_DIALOGUES } from "./lagoonIslandDialogues";
import { CLARA_DIALOGUE } from "./westportClara";
import { ELIAS_DIALOGUE } from "./westportElias";
import { MAYA_DIALOGUE } from "./westportMaya";
import { SAMUEL_DIALOGUE } from "./westportSamuel";
import { SELENE_DIALOGUE } from "./westportSelene";

export { CLARA_DIALOGUE } from "./westportClara";
export { ELIAS_DIALOGUE } from "./westportElias";
export { MAYA_DIALOGUE } from "./westportMaya";
export { SAMUEL_DIALOGUE } from "./westportSamuel";
export { SELENE_DIALOGUE } from "./westportSelene";
export * from "./lagoonIslandDialogues";

export const WESTPORT_DIALOGUES: DialogueConversation[] = [
  MAYA_DIALOGUE,
  ELIAS_DIALOGUE,
  SAMUEL_DIALOGUE,
  CLARA_DIALOGUE,
  SELENE_DIALOGUE,
];

export const ALL_DIALOGUES: DialogueConversation[] = WESTPORT_DIALOGUES;

/**
 * Register all default Westport conversations into the DialogueRegistry.
 */
export function registerAllDialogues(registry: DialogueRegistry = dialogueRegistry): void {
  for (const dialogue of WESTPORT_DIALOGUES) {
    if (!registry.get(dialogue.id)) {
      registry.register(dialogue);
    }
  }
}

/**
 * Register all Lagoon Isle conversations into the DialogueRegistry.
 */
export function registerLagoonDialogues(registry: DialogueRegistry = dialogueRegistry): void {
  for (const dialogue of LAGOON_DIALOGUES) {
    if (!registry.get(dialogue.id)) {
      registry.register(dialogue);
    }
  }
}
