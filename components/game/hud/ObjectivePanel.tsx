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

  const [isDismissed, setIsDismissed] = useState(false);

  // Only track legacy context mission if explicitly marked tracked
  const legacyTracked = state.missions.find((m) => m.tracked);

  if (isDismissed || (!trackedInstance && !legacyTracked)) return null;

  const handleUnpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    missionStore.untrackMission();
  };

  if (trackedInstance) {
    const currentIdx = trackedInstance.currentObjectiveIndex;
    const currentObj = trackedInstance.definition.objectives[currentIdx];

    return (
      <div
        className="group pointer-events-auto flex max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-xl backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-black/60"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-display text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Mission
            </span>
          </div>
          <div className="flex items-center gap-2">
            {currentObj?.target?.position && (
              <span className="font-mono text-[10px] text-neutral-400 transition group-hover:text-cyan-300">
                Target Marked
              </span>
            )}
            <button
              type="button"
              onClick={handleUnpin}
              className="rounded px-1.5 py-0.5 text-[9px] font-mono text-neutral-400 hover:bg-white/10 hover:text-white"
              title="Unpin mission (Free Exploration)"
              aria-label="Unpin mission"
            >
              ✕
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openMenu("missions")}
          className="text-left"
          aria-label="View mission details"
        >
          <div className="font-display text-xs font-semibold tracking-wide text-white hover:text-cyan-300 transition">
            {trackedInstance.definition.title}
          </div>
        </button>

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
      </div>
    );
  }

  // Fallback renderer when no Phase 9 mission is tracked yet
  if (!legacyTracked) return null;

  return (
    <div
      className="group pointer-events-auto flex max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-black/45 p-3.5 text-left shadow-xl backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-black/65"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
          <span className="font-display text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
            Current Objective
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-neutral-400 transition group-hover:text-cyan-300">
            {legacyTracked.distance}
          </span>
          <button
            type="button"
            onClick={handleUnpin}
            className="rounded px-1.5 py-0.5 text-[9px] font-mono text-neutral-400 hover:bg-white/10 hover:text-white"
            title="Unpin (Free Exploration)"
            aria-label="Unpin mission"
          >
            ✕
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => openMenu("missions")}
        className="text-left font-display text-xs font-semibold tracking-wide text-white hover:text-cyan-300 transition"
      >
        {legacyTracked.title}
      </button>

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

      {/* Open-world player guidance */}
      <div className="mt-0.5 flex items-center gap-1.5 border-t border-white/10 pt-1.5 text-[10px] text-amber-300">
        <span>🧭 Free Open-World Exploration · Explore districts & landmarks at your own pace.</span>
      </div>
    </div>
  );
}
