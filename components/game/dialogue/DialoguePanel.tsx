"use client";

import React, { useCallback, useEffect, useState } from "react";

import { dialogueManager } from "@/game/dialogue/DialogueManager";
import { dialogueRunner } from "@/game/dialogue/DialogueRunner";
import { dialogueStore } from "@/game/dialogue/DialogueStore";
import type { DialogueRuntimeSnapshot } from "@/game/dialogue/DialogueTypes";

import { DialogueChoices } from "./DialogueChoices";
import { DialogueProgress } from "./DialogueProgress";
import { DialogueSpeaker } from "./DialogueSpeaker";
import { DialogueText } from "./DialogueText";

/**
 * DialoguePanel component.
 *
 * Cinematic game dialogue UI for OPENVERSE.
 * Handles keyboard navigation (Arrow keys, Enter, E, Esc, 1-9), choice selection,
 * text progression, and accessibility controls.
 */
export function DialoguePanel() {
  const [snapshot, setSnapshot] = useState<DialogueRuntimeSnapshot>(() =>
    dialogueStore.getSnapshot(),
  );

  useEffect(() => {
    const unsubscribe = dialogueStore.subscribe((next) => {
      setSnapshot(next);
    });
    return unsubscribe;
  }, []);

  const isActive =
    snapshot.status === "ACTIVE" ||
    snapshot.status === "WAITING_FOR_CHOICE" ||
    snapshot.status === "ENDING" ||
    snapshot.status === "STARTING";

  const handleSelectChoice = useCallback((index: number) => {
    dialogueRunner.selectChoice(index);
  }, []);

  const handleHoverChoice = useCallback((index: number) => {
    dialogueStore.setSelectedChoiceIndex(index);
  }, []);

  const handleAdvance = useCallback(() => {
    dialogueRunner.advance();
  }, []);

  const handleDismiss = useCallback(() => {
    dialogueManager.endConversation("dismissed");
  }, []);

  // Global keyboard shortcuts during active dialogue
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Escape: dismiss/exit dialogue
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleDismiss();
        return;
      }

      const choices = snapshot.availableChoices;
      const hasChoices = choices.length > 0;

      // 2. Number keys (1 to 9): directly select choice
      if (hasChoices && /^[1-9]$/.test(e.key)) {
        const choiceIdx = parseInt(e.key, 10) - 1;
        if (choiceIdx < choices.length) {
          e.preventDefault();
          e.stopPropagation();
          handleSelectChoice(choiceIdx);
          return;
        }
      }

      // 3. Arrow Up: navigate previous choice
      if (hasChoices && (e.key === "ArrowUp" || e.code === "ArrowUp")) {
        e.preventDefault();
        e.stopPropagation();
        const currentIdx = snapshot.selectedChoiceIndex;
        const nextIdx = currentIdx <= 0 ? choices.length - 1 : currentIdx - 1;
        dialogueStore.setSelectedChoiceIndex(nextIdx);
        return;
      }

      // 4. Arrow Down: navigate next choice
      if (hasChoices && (e.key === "ArrowDown" || e.code === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();
        const currentIdx = snapshot.selectedChoiceIndex;
        const nextIdx = currentIdx >= choices.length - 1 ? 0 : currentIdx + 1;
        dialogueStore.setSelectedChoiceIndex(nextIdx);
        return;
      }

      // 5. Enter or KeyE: confirm choice OR advance linear node
      if (e.key === "Enter" || e.code === "Enter" || e.key === "e" || e.key === "E") {
        e.preventDefault();
        e.stopPropagation();
        if (hasChoices) {
          handleSelectChoice(snapshot.selectedChoiceIndex);
        } else {
          handleAdvance();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isActive, snapshot, handleAdvance, handleDismiss, handleSelectChoice]);

  if (!isActive) {
    return null;
  }

  const choices = snapshot.availableChoices;
  const isEnding = snapshot.status === "ENDING" || snapshot.currentNode?.type === "END";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dialogue"
      data-testid="dialogue-panel"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {/* Dialogue Box Container */}
      <div className="pointer-events-auto relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 shadow-2xl shadow-cyan-950/60 backdrop-blur-md md:p-6">
        {/* Top bar with speaker and close button */}
        <div className="flex items-start justify-between">
          <DialogueSpeaker
            speakerName={snapshot.speakerName ?? "Unknown Speaker"}
            speakerRole={snapshot.speakerRole}
          />

          {/* Dismiss / Close control */}
          <button
            type="button"
            name="DISMISS"
            aria-label="DISMISS"
            data-testid="dialogue-dismiss-btn"
            onClick={handleDismiss}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold tracking-wider text-slate-400 uppercase transition-colors hover:bg-slate-800/80 hover:text-slate-100"
          >
            <span>DISMISS</span>
            <kbd className="rounded border border-slate-600 bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-300">
              ESC
            </kbd>
          </button>
        </div>

        {/* Dialogue text body */}
        <DialogueText text={snapshot.currentNode?.text ?? ""} />

        {/* Choices if branch exists */}
        {choices.length > 0 && (
          <DialogueChoices
            choices={choices}
            selectedIndex={snapshot.selectedChoiceIndex}
            onSelectChoice={handleSelectChoice}
            onHoverChoice={handleHoverChoice}
          />
        )}

        {/* Continue / Conclude button if no choices */}
        {choices.length === 0 && <DialogueProgress isEnding={isEnding} onAdvance={handleAdvance} />}
      </div>
    </div>
  );
}
