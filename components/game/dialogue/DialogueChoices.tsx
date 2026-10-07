"use client";

import React from "react";

import type { DialogueChoice } from "@/game/dialogue/DialogueTypes";

export interface DialogueChoicesProps {
  choices: DialogueChoice[];
  selectedIndex: number;
  onSelectChoice: (index: number) => void;
  onHoverChoice: (index: number) => void;
}

/**
 * DialogueChoices component.
 * Displays interactive branching choices with keyboard & mouse selection indicators.
 */
export function DialogueChoices({
  choices,
  selectedIndex,
  onSelectChoice,
  onHoverChoice,
}: DialogueChoicesProps) {
  if (!choices || choices.length === 0) return null;

  return (
    <div
      role="menu"
      aria-label="Dialogue options"
      data-testid="dialogue-choices-container"
      className="mt-4 flex flex-col gap-2"
    >
      {choices.map((choice, index) => {
        const isSelected = index === selectedIndex;
        const numberKey = index + 1;

        return (
          <button
            key={choice.id}
            type="button"
            role="menuitem"
            data-testid={`dialogue-choice-${index}`}
            onClick={() => onSelectChoice(index)}
            onMouseEnter={() => onHoverChoice(index)}
            className={`group flex w-full items-center rounded-lg border px-4 py-2.5 text-left transition-all duration-150 ${
              isSelected
                ? "scale-[1.01] border-cyan-400 bg-cyan-950/80 text-cyan-100 shadow-md shadow-cyan-950/50"
                : "border-slate-700/60 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80"
            }`}
          >
            {/* Number key shortcut badge */}
            <span
              className={`mr-3 inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                isSelected
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-cyan-300"
              }`}
            >
              {numberKey}
            </span>

            {/* Choice Text */}
            <span className="flex-1 text-sm font-medium md:text-base">{choice.text}</span>

            {/* Selection chevron indicator */}
            {isSelected && (
              <span className="ml-2 animate-pulse text-xs font-bold tracking-wider text-cyan-400">
                [ENTER / E]
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
