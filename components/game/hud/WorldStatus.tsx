"use client";

import { useGame } from "@/game/core/state/GameContext";

/**
 * Top-right world clock, atmospheric weather, and currency widget.
 */
export function WorldStatus() {
  const { state } = useGame();
  const { world, player } = state;

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-2 text-right">
      {/* Time & Weather Card */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 shadow-xl backdrop-blur-md">
        <span className="text-lg text-amber-400" aria-hidden="true">
          ☀
        </span>
        <div className="flex flex-col text-left">
          <span className="font-mono text-xs font-bold tracking-wider text-white">
            {world.timeFormatted}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            <span>{world.weatherCondition}</span>
            <span className="text-neutral-600">·</span>
            <span>DAY {world.dayNumber}</span>
          </div>
        </div>
      </div>

      {/* Currency Display */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-black/40 px-3.5 py-1.5 shadow-lg backdrop-blur-md">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-300">
          ₹
        </span>
        <span className="font-mono text-xs font-bold tracking-wider text-amber-300">
          {player.currency.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
