"use client";

import { useGame } from "@/game/core/state/GameContext";

export function DebugPanel() {
  const { state, toggleDebugGrid, toggleDebugAxes, toggleDebugStats, toggleDebugMode } = useGame();
  const { debug } = state;

  if (!debug.enabled) {
    return (
      <div className="pointer-events-auto fixed bottom-3 left-3 z-40">
        <button
          type="button"
          onClick={toggleDebugMode}
          className="rounded-full border border-white/5 bg-black/30 px-2.5 py-1 font-mono text-[9px] text-neutral-500 backdrop-blur-sm transition hover:border-cyan-500/30 hover:text-cyan-300"
          title="Toggle Debug Panel (F3 or ~)"
        >
          ⚙ DEV
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Developer diagnostics"
      className="pointer-events-auto fixed bottom-3 left-3 z-50 flex min-w-[240px] flex-col gap-2.5 rounded-2xl border border-cyan-500/30 bg-slate-950/85 p-4 font-mono text-xs text-neutral-300 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-bold text-cyan-400">DEV / DEBUG ENGINE</span>
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
          <span className="font-bold text-emerald-400">60.0 FPS</span>
        </div>
        <div className="flex justify-between">
          <span>Camera Pos:</span>
          <span className="text-white">[0.0, 12.0, 28.0]</span>
        </div>
        <div className="flex justify-between">
          <span>World Origin:</span>
          <span className="text-white">[0.0, 0.0, 0.0]</span>
        </div>
        <div className="flex justify-between">
          <span>Region ID:</span>
          <span className="text-cyan-300">central_district_01</span>
        </div>
      </div>

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
      </div>

      <span className="text-[9px] text-neutral-500">Shortcut: Press F3 or ~ to toggle</span>
    </div>
  );
}
