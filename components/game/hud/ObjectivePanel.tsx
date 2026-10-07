"use client";

import { useEffect, useState } from "react";

import { useGame } from "@/game/core/state/GameContext";
import { missionStore } from "@/game/missions/MissionStore";
import type { MissionRuntimeInstance } from "@/game/missions/MissionTypes";

/**
 * Upper-right objective panel (Phase 9 Mission Tracker).
 * Displays currently tracked mission, step-by-step checklist objectives,
 * and live distance in meters to active targets.
 */
export function ObjectivePanel() {
  const { state, openMenu } = useGame();
  const [trackedInstance, setTrackedInstance] = useState<MissionRuntimeInstance | null>(
    missionStore.getTrackedMission(),
  );

  useEffect(() => {
    return missionStore.subscribe(() => {
      setTrackedInstance(missionStore.getTrackedMission());
    });
  }, []);

  // Fallback to legacy context missions if no Phase 9 mission is active
  const legacyTracked = state.missions.find((m) => m.tracked) ?? state.missions[0];

  if (!trackedInstance && !legacyTracked) return null;

  if (trackedInstance) {
    const currentIdx = trackedInstance.currentObjectiveIndex;
    const currentObj = trackedInstance.definition.objectives[currentIdx];

    return (
      <button
        type="button"
        onClick={() => openMenu("missions")}
        className="group pointer-events-auto flex max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-xl backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-black/60"
        aria-label="View mission details"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-display text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Mission
            </span>
          </div>
          {currentObj?.target?.position && (
            <span className="font-mono text-[10px] text-neutral-400 transition group-hover:text-cyan-300">
              Target Marked
            </span>
          )}
        </div>

        <div className="font-display text-xs font-semibold tracking-wide text-white">
          {trackedInstance.definition.title}
        </div>

        <ul className="flex flex-col gap-1.5 text-xs">
          {trackedInstance.definition.objectives.map((obj, idx) => {
            const isCompleted = trackedInstance.objectives[idx]?.completed ?? false;
            const isCurrent = idx === currentIdx;

            return (
              <li key={obj.id} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                    isCompleted
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                      : isCurrent
                        ? "border-cyan-400 bg-cyan-500/30 text-cyan-200"
                        : "border-neutral-600 bg-transparent text-transparent"
                  }`}
                >
                  {isCompleted ? "✓" : isCurrent ? "●" : "○"}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`${
                      isCompleted
                        ? "text-neutral-400 line-through"
                        : isCurrent
                          ? "font-medium text-white"
                          : "text-neutral-500"
                    }`}
                  >
                    {obj.title}
                  </span>
                  {isCurrent && obj.description && (
                    <span className="mt-0.5 text-[10px] text-neutral-400">{obj.description}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </button>
    );
  }

  // Legacy fallback renderer
  if (!legacyTracked) return null;

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
          {legacyTracked.distance}
        </span>
      </div>

      <div className="font-display text-xs font-semibold tracking-wide text-white">
        {legacyTracked.title}
      </div>

      <ul className="flex flex-col gap-1.5 text-xs text-neutral-300">
        {legacyTracked.objectives.map((obj) => (
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
