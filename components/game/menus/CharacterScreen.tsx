"use client";

import Image from "next/image";
import { useState } from "react";

import { useGame } from "@/game/core/state/GameContext";

import { MenuTabBar } from "./MenuTabBar";

type CharacterTab = "OVERVIEW" | "APPEARANCE" | "STATS" | "GAMEPLAY" | "ACHIEVEMENTS";

const SUBTABS: CharacterTab[] = ["OVERVIEW", "APPEARANCE", "STATS", "GAMEPLAY", "ACHIEVEMENTS"];

export function CharacterScreen() {
  const { state } = useGame();
  const { player } = state;
  const [activeTab, setActiveTab] = useState<CharacterTab>("OVERVIEW");

  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Character profile"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-slate-950 text-white"
    >
      <MenuTabBar currentTab="character" />

      {/* Main 3-Column Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-6 overflow-hidden p-6 md:flex-row">
        {/* Left Column: Sub-Tabs */}
        <aside className="flex w-full shrink-0 gap-2 self-start md:w-52 md:flex-col">
          {SUBTABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`font-display rounded-2xl border px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </aside>

        {/* Middle Column: Full-Body Character Concept Showcase */}
        <section
          aria-label="Character preview"
          className="relative flex h-full max-h-[640px] min-h-[420px] w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-md"
        >
          <div className="relative h-full w-full">
            <Image
              src={player.fullImage}
              alt="Hadhi Character Model"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain p-4 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>
          {/* Subtle character pedestal glow */}
          <div className="pointer-events-none absolute bottom-4 h-16 w-3/4 rounded-full bg-cyan-500/10 blur-xl" />
        </section>

        {/* Right Column: Player Progression & Statistics */}
        <aside className="flex w-full shrink-0 flex-col gap-6 self-start rounded-3xl border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur-xl md:w-96">
          {/* Level Header */}
          <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
                Rank Level
              </span>
              <span className="font-display text-3xl font-black text-white">
                LEVEL {String(player.level).padStart(2, "0")}
              </span>
            </div>

            {/* XP Bar */}
            <div className="mt-1 flex flex-col gap-1">
              <div className="flex justify-between font-mono text-[11px] text-cyan-300">
                <span>
                  {player.currentXp} / {player.nextLevelXp} XP
                </span>
                <span>{xpPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Core Progression Stat Bars */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-display text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Progression Overview
            </h4>

            {[
              { label: "EXPLORATION", value: player.stats.exploration },
              { label: "MISSIONS", value: player.stats.missions },
              { label: "DISCOVERY", value: player.stats.discovery },
              { label: "ACTIVITIES", value: player.stats.activities },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="font-display flex justify-between text-xs font-bold text-neutral-300">
                  <span>{stat.label}</span>
                  <span className="font-mono text-cyan-300">{stat.value}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400/80 transition-all"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
            <div className="flex flex-col rounded-xl bg-white/5 p-2.5">
              <span className="font-mono text-[10px] text-neutral-400">PLAY TIME</span>
              <span className="mt-1 font-mono text-xs font-bold text-white">{player.playTime}</span>
            </div>
            <div className="flex flex-col rounded-xl bg-white/5 p-2.5">
              <span className="font-mono text-[10px] text-neutral-400">LOCATIONS</span>
              <span className="mt-1 font-mono text-xs font-bold text-cyan-300">
                {player.locationsCount.discovered} / {player.locationsCount.total}
              </span>
            </div>
            <div className="flex flex-col rounded-xl bg-white/5 p-2.5">
              <span className="font-mono text-[10px] text-neutral-400">ACHIEVEMENTS</span>
              <span className="mt-1 font-mono text-xs font-bold text-amber-300">
                {player.achievementsCount.unlocked} / {player.achievementsCount.total}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
