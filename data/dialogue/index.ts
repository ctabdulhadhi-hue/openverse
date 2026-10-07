import { dialogueRegistry, type DialogueRegistry } from "@/game/dialogue/DialogueRegistry";
import type { DialogueConversation } from "@/game/dialogue/DialogueTypes";

import { CLARA_DIALOGUE } from "./westportClara";
import { ELIAS_DIALOGUE } from "./westportElias";
import { MAYA_DIALOGUE } from "./westportMaya";
import { SAMUEL_DIALOGUE } from "./westportSamuel";

export { CLARA_DIALOGUE } from "./westportClara";
export { ELIAS_DIALOGUE } from "./westportElias";
export { MAYA_DIALOGUE } from "./westportMaya";
export { SAMUEL_DIALOGUE } from "./westportSamuel";

export const ALL_DIALOGUES: DialogueConversation[] = [
  MAYA_DIALOGUE,
  ELIAS_DIALOGUE,
  SAMUEL_DIALOGUE,
  CLARA_DIALOGUE,
];

/**
 * Register all default Westport conversations into the DialogueRegistry.
 */
export function registerAllDialogues(registry: DialogueRegistry = dialogueRegistry): void {
  for (const dialogue of ALL_DIALOGUES) {
    if (!registry.get(dialogue.id)) {
      registry.register(dialogue);
    }
  }
}
