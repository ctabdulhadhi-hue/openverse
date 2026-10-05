"use client";

import { useGame } from "@/game/core/state/GameContext";

const CONTROLS_LIST = [
  { keys: "W A S D", action: "Character Movement", note: "Forward, Left, Backward, Right" },
  { keys: "SHIFT", action: "Sprint", note: "Accelerate foot travel speed" },
  { keys: "SPACE", action: "Jump", note: "Leap over obstacles" },
  { keys: "Mouse", action: "Look / Camera", note: "Free rotational orbit & view angle" },
  { keys: "E", action: "Interact", note: "Talk to NPCs, open doors, trigger activities" },
  { keys: "M", action: "Map", note: "Open regional cartographic world map" },
  { keys: "TAB", action: "Inventory", note: "Access satchel, tools, and items" },
  { keys: "J", action: "Missions Journal", note: "View current objectives and tracked quests" },
  { keys: "C", action: "Character Profile", note: "View stats, levels, and achievements" },
  { keys: "ESC", action: "Pause Menu", note: "Game options, saving, and exit" },
  { keys: "F3 / ~", action: "Developer Mode", note: "Toggle debug overlay and coordinates" },
];

export function ControlsScreen() {
  const { closeMenu } = useGame();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Controls guide"
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-xl"
    >
      <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[0.2em] text-white uppercase">
              Controls
            </h2>
            <p className="font-display mt-0.5 text-xs tracking-widest text-cyan-400 uppercase">
              Default Desktop Keybindings
            </p>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold text-neutral-300 transition hover:border-cyan-400 hover:text-white"
          >
            <span>ESC</span>
            <span>Close</span>
          </button>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-3.5 overflow-y-auto pr-2 md:grid-cols-2">
          {CONTROLS_LIST.map((c) => (
            <div
              key={c.keys}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-3.5"
            >
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-wide text-white">
                  {c.action}
                </span>
                <span className="mt-0.5 text-[11px] text-neutral-400">{c.note}</span>
              </div>
              <span className="shrink-0 rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-300 shadow-sm">
                {c.keys}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-neutral-400">
          <span>Desktop First · Custom Key Remapping Planned</span>
          <button
            type="button"
            onClick={closeMenu}
            className="font-display font-semibold text-cyan-400 hover:underline"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}
