"use client";

import { useGame } from "@/game/core/state/GameContext";

/**
 * Cinematic location entry title banner.
 * Displays when crossing district thresholds with subtle glow and letter-spacing.
 */
export function LocationIndicator() {
  const { state } = useGame();
  const indicator = state.ui.locationIndicator;

  if (!indicator) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-fade-in pointer-events-none flex flex-col items-center text-center"
    >
      <h2 className="font-display text-xl font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl">
        {indicator.name}
      </h2>
      <span className="font-display text-[10px] font-semibold tracking-[0.4em] text-cyan-400 uppercase drop-shadow-md sm:text-xs">
        {indicator.region}
      </span>
    </div>
  );
}
