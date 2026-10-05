"use client";

import Image from "next/image";

import { useGame } from "@/game/core/state/GameContext";

/**
 * Top-left player identity HUD widget.
 * Displays character avatar, name, level, and dynamic XP progress bar.
 */
export function PlayerStatus() {
  const { state, openMenu } = useGame();
  const { player } = state;
  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  return (
    <button
      type="button"
      onClick={() => openMenu("character")}
      className="group pointer-events-auto flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 p-2 pr-5 text-left shadow-xl backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-black/60"
      aria-label={`Open character profile for ${player.name}`}
    >
      {/* Circular Avatar */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-cyan-400/60 shadow-md">
        <Image
          src={player.avatarImage}
          alt={player.name}
          fill
          sizes="48px"
          className="object-cover"
          priority
        />
      </div>

      {/* Identity & Level */}
      <div className="flex min-w-[120px] flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-sm font-bold tracking-wider text-white uppercase transition group-hover:text-cyan-300">
            {player.name}
          </span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
            Lv. {player.level}
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all duration-300"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-medium text-neutral-300">
          <span className="font-mono">
            {player.currentXp} / {player.nextLevelXp} XP
          </span>
        </div>
      </div>
    </button>
  );
}
