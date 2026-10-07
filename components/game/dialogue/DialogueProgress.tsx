"use client";

import React from "react";

export interface DialogueProgressProps {
  isEnding: boolean;
  onAdvance: () => void;
}

/**
 * DialogueProgress component.
 * Prompts the player to advance or conclude linear dialogue.
 */
export function DialogueProgress({ isEnding, onAdvance }: DialogueProgressProps) {
  return (
    <div className="mt-4 flex items-center justify-end">
      <button
        type="button"
        onClick={onAdvance}
        data-testid="dialogue-continue-button"
        className="flex animate-pulse items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-600/30 px-4 py-2 text-xs font-semibold tracking-wider text-cyan-200 transition-all duration-150 hover:animate-none hover:bg-cyan-500/50 md:text-sm"
      >
        <span>{isEnding ? "CONCLUDE" : "CONTINUE"}</span>
        <kbd className="rounded border border-cyan-500/40 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">
          E / ENTER
        </kbd>
      </button>
    </div>
  );
}
