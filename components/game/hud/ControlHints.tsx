"use client";

import { useGame } from "@/game/core/state/GameContext";

const HINTS = [
  { keys: "W A S D", action: "Move" },
  { keys: "SHIFT", action: "Sprint" },
  { keys: "SPACE", action: "Jump" },
  { keys: "Mouse", action: "Look" },
  { keys: "E", action: "Interact" },
  { keys: "M", action: "Map" },
  { keys: "TAB", action: "Inventory" },
  { keys: "ESC", action: "Menu" },
];

/**
 * Bottom-right keybinding overlay card.
 * Clearly displays controls with styled keycaps.
 */
export function ControlHints() {
  const { state } = useGame();

  if (!state.settings.interface.showControlHints) return null;

  return (
    <div
      role="region"
      data-testid="control-hints"
      aria-label="Controls overview"
      className="pointer-events-none hidden flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-3.5 text-neutral-300 shadow-xl backdrop-blur-md lg:flex"
    >
      <div className="flex flex-col gap-1">
        {HINTS.map((h) => (
          <div key={h.keys} className="flex items-center justify-between gap-4 text-[11px]">
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
              {h.keys}
            </span>
            <span className="font-medium text-neutral-300">{h.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
