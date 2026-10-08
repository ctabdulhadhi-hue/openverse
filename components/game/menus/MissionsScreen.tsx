"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useGame } from "@/game/core/state/GameContext";
import { missionManager } from "@/game/missions/MissionManager";
import { missionStore } from "@/game/missions/MissionStore";
import type { MissionDefinition, MissionRuntimeInstance } from "@/game/missions/MissionTypes";
import { npcRegistry } from "@/game/npcs/NPCRegistry";

import { MenuTabBar } from "./MenuTabBar";

type JournalCategory = "ACTIVE" | "AVAILABLE" | "COMPLETED";

const JOURNAL_TABS: { id: JournalCategory; label: string; icon: string }[] = [
  { id: "ACTIVE", label: "ACTIVE", icon: "⭐" },
  { id: "AVAILABLE", label: "AVAILABLE", icon: "◆" },
  { id: "COMPLETED", label: "COMPLETED", icon: "✓" },
];

export function MissionsScreen() {
  const { trackMission: contextTrackMission } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<JournalCategory>("ACTIVE");
  const [selectedMissionId, setSelectedMissionId] = useState<string>("");

  const [activeMissions, setActiveMissions] = useState<MissionRuntimeInstance[]>(
    missionStore.getActiveMissions(),
  );
  const [availableMissionIds, setAvailableMissionIds] = useState<string[]>(
    missionStore.getAvailableMissions(),
  );
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>(
    missionStore.getCompletedMissions(),
  );
  const [trackedId, setTrackedId] = useState<string | null>(missionStore.getTrackedMissionId());

  useEffect(() => {
    return missionStore.subscribe((snap) => {
      setActiveMissions(snap.activeMissions);
      setAvailableMissionIds(snap.availableMissions);
      setCompletedMissionIds(snap.completedMissions);
      setTrackedId(snap.trackedMissionId);
    });
  }, []);

  // Compute list based on selected category
  const activeDefs: { def: MissionDefinition; instance?: MissionRuntimeInstance }[] =
    activeMissions.map((inst) => ({ def: inst.definition, instance: inst }));

  const availableDefs: { def: MissionDefinition; instance?: MissionRuntimeInstance }[] =
    availableMissionIds
      .map((id) => missionManager.getMission(id))
      .filter((m): m is MissionDefinition => Boolean(m))
      .map((def) => ({ def }));

  const completedDefs: { def: MissionDefinition; instance?: MissionRuntimeInstance }[] =
    completedMissionIds
      .map((id) => missionManager.getMission(id))
      .filter((m): m is MissionDefinition => Boolean(m))
      .map((def) => ({ def }));

  const categoryEntries =
    selectedCategory === "ACTIVE"
      ? activeDefs
      : selectedCategory === "AVAILABLE"
        ? availableDefs
        : completedDefs;

  const currentSelection =
    categoryEntries.find((item) => item.def.id === selectedMissionId) ?? categoryEntries[0] ?? null;

  const selectedDef = currentSelection?.def ?? null;
  const selectedInstance = currentSelection?.instance ?? null;

  const handleTrackMission = (missionId: string) => {
    missionManager.trackMission(missionId);
    contextTrackMission(missionId);
  };

  const handleUntrackMission = (missionId: string) => {
    missionManager.untrackMission(missionId);
  };

  const getNpcName = (npcId: string) => {
    const npc = npcRegistry.get(npcId);
    return npc ? `${npc.def.name} (${npc.def.title ?? "Westport"})` : npcId;
  };

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
          {JOURNAL_TABS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === "ACTIVE"
                ? activeDefs.length
                : cat.id === "AVAILABLE"
                  ? availableDefs.length
                  : completedDefs.length;

            return (
              <button
                key={cat.id}
                data-testid={`journal-tab-${cat.id.toLowerCase()}`}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const first =
                    cat.id === "ACTIVE"
                      ? activeDefs[0]
                      : cat.id === "AVAILABLE"
                        ? availableDefs[0]
                        : completedDefs[0];
                  if (first) setSelectedMissionId(first.def.id);
                }}
                className={`font-display flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
                <span className="font-mono text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </aside>

        {/* Middle Column: Mission List Cards */}
        <section
          aria-label="Missions list"
          className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1"
        >
          {categoryEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-12 text-center text-neutral-500">
              <span className="text-2xl">📋</span>
              <p className="mt-2 text-sm">No missions currently in this log category.</p>
              {selectedCategory === "ACTIVE" && (
                <p className="mt-1 text-xs text-neutral-600">
                  Talk to Maya Lin or other characters in town to discover missions.
                </p>
              )}
            </div>
          ) : (
            categoryEntries.map(({ def, instance }) => {
              const isSelected = selectedDef?.id === def.id;
              const isTracked = trackedId === def.id;

              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => setSelectedMissionId(def.id)}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-4.5 text-left transition ${
                    isSelected
                      ? "border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                      : "border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/60"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold tracking-wide text-white">
                        {def.title}
                      </span>
                      {isTracked && (
                        <span className="py-0.2 rounded border border-cyan-400/40 bg-cyan-400/20 px-1.5 font-mono text-[9px] font-bold text-cyan-300">
                          TRACKED
                        </span>
                      )}
                      <span className="py-0.2 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] text-neutral-400">
                        {def.category}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {def.subtitle ?? def.shortDescription ?? def.description}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-[10px] text-neutral-500">
                      Giver: {def.giverNpcId}
                    </span>
                    {instance && (
                      <span className="font-mono text-xs font-semibold text-cyan-400">
                        Obj {instance.currentObjectiveIndex + 1}/{def.objectives.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </section>

        {/* Right Column: Selected Mission Detail View */}
        {selectedDef && (
          <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-xl md:w-96">
            <div className="relative h-40 w-full overflow-hidden">
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
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase">
                    Status: {missionStore.getMissionState(selectedDef.id)}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">
                    ID: {selectedDef.id}
                  </span>
                </div>
                <h3 className="font-display mt-1 text-lg font-bold tracking-wider text-white uppercase">
                  {selectedDef.title}
                </h3>
                <div className="mt-1 font-mono text-xs text-neutral-400">
                  Mission Giver:{" "}
                  <span className="text-neutral-200">{getNpcName(selectedDef.giverNpcId)}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                  {selectedDef.description}
                </p>
              </div>

              {/* Objectives Checklist */}
              <div>
                <h4 className="font-display border-b border-white/10 pb-2 text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
                  Objectives
                </h4>
                <ul className="mt-3 flex flex-col gap-2 text-xs">
                  {selectedDef.objectives.map((obj, idx) => {
                    const isCompleted = selectedInstance?.objectives[idx]?.completed ?? false;
                    const isCurrent = selectedInstance?.currentObjectiveIndex === idx;

                    return (
                      <li key={obj.id} className="flex items-start gap-2.5">
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
                            className={
                              isCompleted
                                ? "text-neutral-500 line-through"
                                : isCurrent
                                  ? "font-semibold text-white"
                                  : "text-neutral-300"
                            }
                          >
                            {obj.title}
                          </span>
                          <span className="text-[10px] text-neutral-400">{obj.description}</span>
                        </div>
                      </li>
                    );
                  })}
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
                    <span>{selectedDef.rewards.xp} XP</span>
                  </span>
                  {selectedDef.rewards.currency && (
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <span>₹</span>
                      <span>{selectedDef.rewards.currency}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button: Track / Untrack Mission */}
              {selectedInstance && (
                <div className="mt-auto flex gap-2 pt-4">
                  {trackedId === selectedDef.id ? (
                    <button
                      type="button"
                      onClick={() => handleUntrackMission(selectedDef.id)}
                      className="font-display w-full rounded-xl border border-amber-400/50 bg-amber-500/20 py-3 text-xs font-bold tracking-widest text-amber-300 uppercase shadow-[0_0_12px_rgba(245,158,11,0.2)] transition hover:bg-amber-500/30"
                    >
                      UNTRACK MISSION
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTrackMission(selectedDef.id)}
                      className="font-display w-full rounded-xl bg-cyan-500 py-3 text-xs font-bold tracking-widest text-slate-950 uppercase shadow-[0_0_15px_rgba(56,189,248,0.5)] transition hover:bg-cyan-400"
                    >
                      TRACK MISSION
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
