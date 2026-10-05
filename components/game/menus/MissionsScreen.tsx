"use client";

import Image from "next/image";
import { useState } from "react";

import type { MissionCategory, MissionDefinition } from "@/data/missions/missionsData";
import { useGame } from "@/game/core/state/GameContext";

import { MenuTabBar } from "./MenuTabBar";

const CATEGORIES: { id: MissionCategory; label: string; icon: string }[] = [
  { id: "MAIN", label: "MAIN", icon: "⭐" },
  { id: "SIDE", label: "SIDE", icon: "◆" },
  { id: "ACTIVITIES", label: "ACTIVITIES", icon: "●" },
  { id: "COMPLETED", label: "COMPLETED", icon: "✓" },
];

export function MissionsScreen() {
  const { state, trackMission } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory>("MAIN");
  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    state.missions.find((m) => m.category === "MAIN")?.id ?? state.missions[0]?.id ?? "",
  );

  const filteredMissions = state.missions.filter((m) =>
    selectedCategory === "COMPLETED" ? false : m.category === selectedCategory,
  );

  const selectedMission: MissionDefinition | undefined =
    state.missions.find((m) => m.id === selectedMissionId) ?? filteredMissions[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Missions journal"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-slate-950 text-white"
    >
      <MenuTabBar currentTab="missions" />

      {/* Main 3-Column Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 overflow-hidden p-6 md:flex-row">
        {/* Left Column: Categories Sidebar */}
        <aside className="flex w-full shrink-0 gap-2 md:w-56 md:flex-col">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const firstInCat = state.missions.find((m) => m.category === cat.id);
                  if (firstInCat) setSelectedMissionId(firstInCat.id);
                }}
                className={`font-display flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Middle Column: Mission List Cards */}
        <section
          aria-label="Missions list"
          className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1"
        >
          {filteredMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-12 text-center text-neutral-500">
              <span className="text-2xl">📋</span>
              <p className="mt-2 text-sm">No missions currently in this log category.</p>
            </div>
          ) : (
            filteredMissions.map((mission) => {
              const isSelected = selectedMission?.id === mission.id;
              return (
                <button
                  key={mission.id}
                  type="button"
                  onClick={() => setSelectedMissionId(mission.id)}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-4.5 text-left transition ${
                    isSelected
                      ? "border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                      : "border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/60"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold tracking-wide text-white">
                        {mission.title}
                      </span>
                      {mission.tracked && (
                        <span className="py-0.2 rounded border border-cyan-400/40 bg-cyan-400/20 px-1.5 font-mono text-[9px] font-bold text-cyan-300">
                          TRACKED
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400">{mission.subtitle}</span>
                  </div>

                  <span className="shrink-0 font-mono text-xs font-semibold text-cyan-400">
                    {mission.distance}
                  </span>
                </button>
              );
            })
          )}
        </section>

        {/* Right Column: Selected Mission Detail View */}
        {selectedMission && (
          <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-xl md:w-96">
            {/* Header Image Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src="/images/district_central.jpg"
                alt="Mission area preview"
                fill
                sizes="384px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
              <div>
                <h3 className="font-display text-lg font-bold tracking-wider text-white uppercase">
                  {selectedMission.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                  {selectedMission.description}
                </p>
              </div>

              {/* Objectives Checklist */}
              <div>
                <h4 className="font-display border-b border-white/10 pb-2 text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
                  Objectives
                </h4>
                <ul className="mt-3 flex flex-col gap-2 text-xs">
                  {selectedMission.objectives.map((obj) => (
                    <li key={obj.id} className="flex items-start gap-2.5">
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
                        className={
                          obj.completed ? "text-neutral-500 line-through" : "text-neutral-200"
                        }
                      >
                        {obj.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rewards Box */}
              <div>
                <h4 className="font-display border-b border-white/10 pb-2 text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  Rewards
                </h4>
                <div className="mt-3 flex items-center gap-4 font-mono text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span>⭐</span>
                    <span>{selectedMission.rewards.xp} XP</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span>₹</span>
                    <span>{selectedMission.rewards.currency}</span>
                  </span>
                </div>
              </div>

              {/* Action Button: Track Mission */}
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => trackMission(selectedMission.id)}
                  disabled={selectedMission.tracked}
                  className={`font-display w-full rounded-xl py-3 text-xs font-bold tracking-widest uppercase transition ${
                    selectedMission.tracked
                      ? "cursor-default border border-cyan-400/50 bg-cyan-500/20 text-cyan-300"
                      : "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:bg-cyan-400"
                  }`}
                >
                  {selectedMission.tracked ? "CURRENTLY TRACKING" : "TRACK MISSION"}
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
