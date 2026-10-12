"use client";

import { useEffect, useState } from "react";

import { useGame } from "@/game/core/state/GameContext";
import { dialogueFlagStore, dialogueStore } from "@/game/dialogue";
import { interactionStore } from "@/game/interaction";
import { missionEventBus } from "@/game/missions/MissionEvents";
import { missionStore } from "@/game/missions/MissionStore";
import { npcStore } from "@/game/npcs";
import { aircraftStore } from "@/game/world/airport/aircraftStore";
import type { AirportTelemetry } from "@/game/world/airport/airportTypes";
import { streamingStore } from "@/game/world/streaming";

export function DebugPanel() {
  const {
    state,
    toggleDebugGrid,
    toggleDebugAxes,
    toggleDebugStats,
    toggleDebugMode,
    toggleFreeCamera,
  } = useGame();
  const { debug } = state;

  const [streamStats, setStreamStats] = useState(() => streamingStore.getStats());
  const [interactStats, setInteractStats] = useState(() => interactionStore.getTelemetry());
  const [npcStats, setNpcStats] = useState(() => npcStore.getTelemetry());
  const [dialogueSnapshot, setDialogueSnapshot] = useState(() => dialogueStore.getSnapshot());
  const [flagCount, setFlagCount] = useState(() => dialogueFlagStore.getCount());
  const [missionSnapshot, setMissionSnapshot] = useState(() => missionStore.getSnapshot());
  const [lastMissionEvent, setLastMissionEvent] = useState<string>("NONE");
  const [aircraftTelemetry, setAircraftTelemetry] = useState(() => aircraftStore.getTelemetry());

  useEffect(() => {
    if (!debug.enabled) return;
    const unsubStream = streamingStore.subscribe((stats) => {
      setStreamStats({ ...stats });
    });
    const unsubInteract = interactionStore.subscribe((telemetry) => {
      setInteractStats({ ...telemetry });
    });
    const unsubNpc = npcStore.subscribe((telemetry) => {
      setNpcStats({ ...telemetry });
    });
    const unsubDialogue = dialogueStore.subscribe((s) => {
      setDialogueSnapshot({ ...s });
    });
    const unsubFlags = dialogueFlagStore.subscribe(() => {
      setFlagCount(dialogueFlagStore.getCount());
    });
    const unsubMission = missionStore.subscribe((s) => {
      setMissionSnapshot({ ...s });
    });
    const unsubMissionEvents = missionEventBus.subscribe((e) => {
      setLastMissionEvent(`${e.type} (${e.missionId})`);
    });
    const unsubAircraft = aircraftStore.subscribe((t: AirportTelemetry) => {
      setAircraftTelemetry({ ...t });
    });
    return () => {
      unsubStream();
      unsubInteract();
      unsubNpc();
      unsubDialogue();
      unsubFlags();
      unsubMission();
      unsubMissionEvents();
      unsubAircraft();
    };
  }, [debug.enabled]);

  if (!debug.enabled) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Developer diagnostics"
      className="pointer-events-auto fixed bottom-3 left-3 z-50 flex min-w-[260px] flex-col gap-2.5 rounded-2xl border border-cyan-500/30 bg-slate-950/85 p-4 font-mono text-xs text-neutral-300 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-bold text-cyan-400">OPENVERSE STREAMING</span>
        <button
          type="button"
          onClick={toggleDebugMode}
          className="text-neutral-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1 text-[11px] text-neutral-400">
        <div className="flex justify-between">
          <span>Target FPS:</span>
          <span className="font-bold text-emerald-400">
            {streamStats.fpsEstimate.toFixed(1)} FPS
          </span>
        </div>
        <div className="flex justify-between">
          <span>Draw Calls:</span>
          <span className="font-bold text-cyan-300">{streamStats.drawCalls ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Triangles:</span>
          <span className="font-bold text-cyan-300">
            {streamStats.triangles ? streamStats.triangles.toLocaleString() : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Current Chunk:</span>
          <span className="font-bold text-white">
            [{streamStats.currentChunkX}, {streamStats.currentChunkZ}]
          </span>
        </div>
        <div className="flex justify-between">
          <span>Loaded Chunks:</span>
          <span className="font-bold text-cyan-300">{streamStats.loadedCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Active Chunks:</span>
          <span className="font-bold text-emerald-400">{streamStats.activeCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Active Bodies:</span>
          <span className="text-white">~{streamStats.activePhysicsBodies}</span>
        </div>
        <div className="flex justify-between">
          <span>Streaming Radius:</span>
          <span className="text-white">
            {streamStats.loadRadius} chunks ({streamStats.loadRadius * 200}m)
          </span>
        </div>
        <div className="flex justify-between">
          <span>World Region:</span>
          <span className="font-bold text-cyan-300">{streamStats.currentRegion}</span>
        </div>
        <div className="flex justify-between">
          <span>Camera Collision:</span>
          <span className="font-bold text-emerald-400">ON</span>
        </div>
        <div className="flex justify-between">
          <span>Mouse Invert:</span>
          <span className="text-white">
            X: OFF | Y: {state.settings.controls.invertY ? "ON" : "OFF"}
          </span>
        </div>

        {/* Interaction Telemetry (Phase 6) */}
        <div className="mt-1 flex flex-col gap-1 border-t border-white/10 pt-1.5">
          <span className="font-bold text-cyan-400">INTERACTION</span>
          <div className="flex justify-between">
            <span>Target:</span>
            <span className="font-bold text-white">{interactStats.targetName ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-bold text-cyan-300">{interactStats.targetType ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Distance:</span>
            <span className="text-white">
              {interactStats.distance !== null ? `${interactStats.distance.toFixed(1)}m` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Candidates:</span>
            <span className="text-white">{interactStats.candidateCount}</span>
          </div>
          <div className="flex justify-between">
            <span>LOS:</span>
            <span
              className={
                interactStats.targetName
                  ? interactStats.hasLineOfSight
                    ? "font-bold text-emerald-400"
                    : "font-bold text-amber-400"
                  : "text-neutral-500"
              }
            >
              {interactStats.targetName
                ? interactStats.hasLineOfSight
                  ? "CLEAR"
                  : "BLOCKED"
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Registry:</span>
            <span className="text-white">{interactStats.registryCount}</span>
          </div>
        </div>

        {/* NPC System Diagnostics (Phase 7) */}
        <div className="mt-1 flex flex-col gap-1 border-t border-white/10 pt-1.5">
          <span className="font-bold text-cyan-400">NPC SYSTEM</span>
          <div className="flex justify-between">
            <span>Active: </span>
            <span data-testid="npc-debug-active" className="font-bold text-white">
              {npcStats.activeCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Nearby:</span>
            <span className="font-bold text-emerald-400">{npcStats.nearbyCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Near Simulation:</span>
            <span className="text-white">{npcStats.nearTierCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Mid Simulation:</span>
            <span className="text-white">{npcStats.midTierCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Far Simulation:</span>
            <span className="text-white">{npcStats.farTierCount}</span>
          </div>
          {npcStats.target && (
            <div className="mt-1 flex flex-col gap-0.5 border-t border-white/5 pt-1 text-[10px]">
              <span className="font-semibold text-neutral-400">Target NPC:</span>
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="font-bold text-white">{npcStats.target.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-bold text-cyan-300">{npcStats.target.type}</span>
              </div>
              <div className="flex justify-between">
                <span>State:</span>
                <span className="font-bold text-emerald-400">{npcStats.target.state}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="text-white">{npcStats.target.distance.toFixed(1)}m</span>
              </div>
              <div className="flex justify-between">
                <span>Behavior:</span>
                <span className="text-neutral-300">{npcStats.target.behavior}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dialogue Diagnostics (Phase 8) */}
        <div
          data-testid="debug-dialogue-section"
          className="mt-1 flex flex-col gap-1 border-t border-white/10 pt-1.5"
        >
          <span className="font-bold text-cyan-400">DIALOGUE</span>
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              data-testid="dialogue-debug-status"
              className={
                dialogueSnapshot.status === "ACTIVE" ||
                dialogueSnapshot.status === "WAITING_FOR_CHOICE"
                  ? "font-bold text-emerald-400"
                  : "text-neutral-400"
              }
            >
              {dialogueSnapshot.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Conversation:</span>
            <span data-testid="dialogue-debug-conv" className="font-bold text-white">
              {dialogueSnapshot.conversationId ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>NPC:</span>
            <span data-testid="dialogue-debug-npc" className="text-white">
              {dialogueSnapshot.npcId ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Speaker:</span>
            <span className="text-cyan-300">{dialogueSnapshot.speakerName ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Node:</span>
            <span data-testid="dialogue-debug-node" className="text-white">
              {dialogueSnapshot.currentNodeId ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Choices:</span>
            <span data-testid="dialogue-debug-choices" className="text-white">
              {dialogueSnapshot.availableChoices.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Flags:</span>
            <span data-testid="dialogue-debug-flags" className="text-white">
              {flagCount}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Phase 9 & 10 Mission System Diagnostics */}
      {(() => {
        const trackedMission =
          missionSnapshot.activeMissions.find((m) => m.id === missionSnapshot.trackedMissionId) ??
          missionSnapshot.activeMissions[0] ??
          null;
        const currentObj = trackedMission
          ? trackedMission.definition.objectives[trackedMission.currentObjectiveIndex]
          : null;
        const depCount =
          (trackedMission?.definition.requires?.length ??
            trackedMission?.definition.prerequisites?.length ??
            0) + (trackedMission?.definition.blockedBy?.length ?? 0);

        return (
          <div className="flex flex-col gap-1 border-t border-white/10 pt-2 text-[11px]">
            <div className="flex items-center justify-between font-bold text-cyan-400">
              <span>MISSION SYSTEM:</span>
              <span data-testid="mission-debug-status" className="text-emerald-400">
                ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-1 gap-0.5 text-[10px] text-neutral-400">
              <div className="flex justify-between">
                <span>Active Missions:</span>
                <span data-testid="mission-debug-active-count" className="font-bold text-white">
                  {missionSnapshot.activeMissions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Available Missions:</span>
                <span data-testid="mission-debug-available-count" className="text-white">
                  {missionSnapshot.availableMissions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed Missions:</span>
                <span data-testid="mission-debug-completed-count" className="text-white">
                  {missionSnapshot.completedMissions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tracked Mission:</span>
                <span
                  data-testid="mission-debug-current-mission"
                  className="max-w-[130px] truncate font-semibold text-cyan-300"
                >
                  {trackedMission?.definition.title ?? "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Objective:</span>
                <span
                  data-testid="mission-debug-current-obj"
                  className="max-w-[130px] truncate text-white"
                >
                  {currentObj?.title ?? "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dependencies:</span>
                <span data-testid="mission-debug-deps" className="text-white">
                  {depCount} req / {trackedMission?.definition.unlocks?.length ?? 0} unlock
                </span>
              </div>
              <div className="flex justify-between">
                <span>Objective Progress:</span>
                <span data-testid="mission-debug-progress" className="text-amber-300">
                  {trackedMission
                    ? `${trackedMission.objectives[trackedMission.currentObjectiveIndex]?.currentCount ?? 0}/${trackedMission.objectives[trackedMission.currentObjectiveIndex]?.requiredCount ?? 1}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Event:</span>
                <span
                  data-testid="mission-debug-event"
                  className="max-w-[130px] truncate text-neutral-300"
                >
                  {lastMissionEvent}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col gap-1.5 border-t border-white/10 pt-2 text-[10px]">
        <button
          type="button"
          onClick={toggleDebugGrid}
          className={`flex items-center justify-between rounded px-2.5 py-1.5 font-bold transition ${
            debug.showGrid
              ? "border border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
              : "bg-white/5 text-neutral-400 hover:bg-white/10"
          }`}
        >
          <span>Terrain Grid:</span>
          <span>{debug.showGrid ? "ON" : "OFF"}</span>
        </button>

        <button
          type="button"
          onClick={toggleDebugAxes}
          className={`flex items-center justify-between rounded px-2.5 py-1.5 font-bold transition ${
            debug.showAxes
              ? "border border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
              : "bg-white/5 text-neutral-400 hover:bg-white/10"
          }`}
        >
          <span>Coordinate Axes:</span>
          <span>{debug.showAxes ? "ON" : "OFF"}</span>
        </button>

        <button
          type="button"
          onClick={toggleDebugStats}
          className={`flex items-center justify-between rounded px-2.5 py-1.5 font-bold transition ${
            debug.showStats
              ? "border border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
              : "bg-white/5 text-neutral-400 hover:bg-white/10"
          }`}
        >
          <span>Performance Graph:</span>
          <span>{debug.showStats ? "ON" : "OFF"}</span>
        </button>

        <button
          type="button"
          onClick={toggleFreeCamera}
          className={`flex items-center justify-between rounded px-2.5 py-1.5 font-bold transition ${
            debug.freeCamera
              ? "border border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
              : "bg-white/5 text-neutral-400 hover:bg-white/10"
          }`}
        >
          <span>Dev Free Camera:</span>
          <span>{debug.freeCamera ? "ON" : "OFF"}</span>
        </button>

        {/* Airport Flight Simulation Controls */}
        <div className="mt-1 flex flex-col gap-1 border-t border-white/10 pt-1.5 text-[10px]">
          <div className="flex justify-between">
            <span className="text-neutral-400">Airliner Stand 1:</span>
            <span className="font-bold text-sky-400">{aircraftTelemetry.aircraftState}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Boarding Gate:</span>
            <span className={aircraftTelemetry.isBoardingAllowed ? "font-bold text-emerald-400" : "font-bold text-amber-400"}>
              {aircraftTelemetry.isBoardingAllowed ? "OPEN" : "LOCKED"}
            </span>
          </div>
          <div className="mt-0.5 flex gap-1">
            <button
              type="button"
              onClick={() => aircraftStore.forceBoarding()}
              className="flex-1 rounded bg-sky-600/30 px-1.5 py-1 text-center font-bold text-sky-300 transition hover:bg-sky-600/50"
            >
              ✈ Force Board
            </button>
            <button
              type="button"
              onClick={() => aircraftStore.forceDeparting()}
              className="flex-1 rounded bg-amber-600/30 px-1.5 py-1 text-center font-bold text-amber-300 transition hover:bg-amber-600/50"
            >
              🛫 Force Depart
            </button>
          </div>
        </div>
      </div>

      <span className="text-[9px] text-neutral-500">Shortcut: Press F3 or ~ to toggle</span>
    </div>
  );
}
