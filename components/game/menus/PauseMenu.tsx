"use client";

import Image from "next/image";
import Link from "next/link";

import { useGame } from "@/game/core/state/GameContext";

export function PauseMenu() {
  const { state, closeMenu, openMenu, pushNotification } = useGame();
  const { world } = state;

  const handleSaveGame = () => {
    pushNotification({
      type: "discovery",
      title: "GAME SAVED",
      subtitle: "Progression preserved locally.",
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pause menu"
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-xl"
    >
      <div className="flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="font-display text-3xl font-black tracking-[0.25em] text-white uppercase">
              OPENVERSE
            </h1>
            <p className="font-display mt-0.5 text-xs tracking-widest text-cyan-400 uppercase">
              Pause Menu
            </p>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold text-neutral-300 transition hover:border-cyan-400 hover:text-white"
          >
            <span>ESC</span>
            <span>Resume Game</span>
          </button>
        </div>

        {/* Main Content Grid: Menu Items (Left) vs Location Card (Right) */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Menu Actions (Left 7 cols) */}
          <div className="flex flex-col gap-2.5 md:col-span-6">
            <button
              type="button"
              onClick={closeMenu}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-cyan-400/60 bg-cyan-500/25 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] transition hover:bg-cyan-500/35"
            >
              <span>▶</span>
              <span>RESUME</span>
            </button>

            <button
              type="button"
              onClick={() => openMenu("map")}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-neutral-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <span>🗺</span>
              <span>MAP</span>
            </button>

            <button
              type="button"
              onClick={() => openMenu("missions")}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-neutral-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <span>📋</span>
              <span>MISSIONS</span>
            </button>

            <button
              type="button"
              onClick={() => openMenu("inventory")}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-neutral-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <span>🎒</span>
              <span>INVENTORY</span>
            </button>

            <button
              type="button"
              onClick={() => openMenu("character")}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-neutral-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <span>👤</span>
              <span>CHARACTER</span>
            </button>

            <button
              type="button"
              onClick={() => openMenu("settings")}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-neutral-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <span>⚙</span>
              <span>SETTINGS</span>
            </button>

            <button
              type="button"
              onClick={() => openMenu("controls")}
              className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-bold tracking-[0.18em] text-neutral-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <span>🎮</span>
              <span>CONTROLS</span>
            </button>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveGame}
                className="font-display flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-xs font-bold tracking-[0.18em] text-neutral-400 transition hover:border-emerald-400/40 hover:text-emerald-300"
              >
                <span>💾</span>
                <span>SAVE GAME</span>
              </button>

              <Link
                href="/"
                className="font-display flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-left text-xs font-bold tracking-[0.18em] text-red-300 transition hover:bg-red-500/20"
              >
                <span>🚪</span>
                <span>QUIT TO MENU</span>
              </Link>
            </div>
          </div>

          {/* Current Location Card (Right 6 cols) */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl md:col-span-6">
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src="/images/district_central.jpg"
                alt="Central District Preview"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold tracking-wider text-white uppercase">
                    {world.currentRegion}
                  </h3>
                  <span className="font-display text-xs font-semibold tracking-widest text-cyan-400 uppercase">
                    {world.currentZone}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-neutral-300">
                  <span className="text-amber-400">☀</span>
                  <span>{world.timeFormatted}</span>
                  <span className="text-neutral-500">·</span>
                  <span>Day {world.dayNumber}</span>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                A vibrant district with modern architecture and rich culture. There&apos;s always
                something new to discover around every corner.
              </p>
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-neutral-400">
          <span>[ESC] Back to Game</span>
          <span>[ENTER] Select Option</span>
        </div>
      </div>
    </div>
  );
}
