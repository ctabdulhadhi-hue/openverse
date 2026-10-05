"use client";

import { useGame } from "@/game/core/state/GameContext";

/**
 * Upper-right objective panel.
 * Displays currently tracked mission and step-by-step checklist objectives.
 */
export function ObjectivePanel() {
  const { state, openMenu } = useGame();
  const trackedMission = state.missions.find((m) => m.tracked) ?? state.missions[0];

  if (!trackedMission) return null;

  return (
    <button
      type="button"
      onClick={() => openMenu("missions")}
      className="group pointer-events-auto flex max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-xl backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-black/60"
      aria-label="View mission details"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-display text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
          Current Objective
        </span>
        <span className="font-mono text-[10px] text-neutral-400 transition group-hover:text-cyan-300">
          {trackedMission.distance}
        </span>
      </div>

      <div className="font-display text-xs font-semibold tracking-wide text-white">
        {trackedMission.title}
      </div>

      <ul className="flex flex-col gap-1.5 text-xs text-neutral-300">
        {trackedMission.objectives.map((obj) => (
          <li key={obj.id} className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                obj.completed
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                  : "border-neutral-500 bg-transparent text-transparent"
              }`}
            >
              {obj.completed ? "✓" : "○"}
            </span>
            <span
              className={`${obj.completed ? "text-neutral-400 line-through" : "text-neutral-200"}`}
            >
              {obj.text}
            </span>
          </li>
        ))}
      </ul>
    </button>
  );
}
