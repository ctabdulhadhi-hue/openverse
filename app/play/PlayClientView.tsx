"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import { CanvasLoader } from "@/components/game/CanvasLoader";
import { CURRENT_PHASE, PROJECT } from "@/lib/config/project";

// Dynamic import with ssr: false ensures WebGL / Canvas only initializes in the browser client
const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoader statusText="Initializing 3D Engine..." />,
  },
);

export function PlayClientView() {
  const [showDebugGrid, setShowDebugGrid] = useState(true);

  return (
    <div
      data-testid="play-view-container"
      className="relative h-screen w-screen overflow-hidden bg-[color:var(--color-ov-night,#0a0f1d)] text-white"
    >
      {/* 3D Canvas Viewport */}
      <div className="absolute inset-0">
        <GameCanvas showDebugGrid={showDebugGrid} />
      </div>

      {/* Top HUD Overlay */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-6">
        {/* Brand & Phase indicator */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-md">
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-[0.2em] text-white transition hover:text-amber-400"
          >
            {PROJECT.name}
          </Link>
          <span className="h-3 w-px bg-white/20" aria-hidden="true" />
          <span className="flex items-center gap-1.5 text-xs text-neutral-300">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            Phase {CURRENT_PHASE.number} · {CURRENT_PHASE.name}
          </span>
        </div>

        {/* Viewport & Navigation controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            id="toggle-grid-btn"
            onClick={() => setShowDebugGrid((prev) => !prev)}
            aria-pressed={showDebugGrid}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition ${
              showDebugGrid
                ? "border-sky-400/40 bg-sky-500/20 text-sky-200 hover:bg-sky-500/30"
                : "border-white/10 bg-black/40 text-neutral-400 hover:bg-white/10"
            }`}
          >
            Dev Grid: {showDebugGrid ? "ON" : "OFF"}
          </button>

          <Link
            href="/"
            id="exit-home-btn"
            className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-semibold tracking-wider text-neutral-200 uppercase backdrop-blur-md transition hover:border-amber-400/40 hover:text-amber-300"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Bottom Information Pill */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-4 pb-6 sm:p-6">
        <div className="pointer-events-auto max-w-lg rounded-2xl border border-white/10 bg-black/50 px-5 py-3 text-center text-xs text-neutral-300 shadow-xl backdrop-blur-md">
          <span className="font-semibold tracking-wider text-amber-400 uppercase">
            Phase 1 Prototype:
          </span>{" "}
          3D Canvas, Sky, Lighting & Shadows. Use mouse to orbit and inspect the environment.
          <span className="mt-0.5 block text-[11px] text-neutral-400">
            Player movement (WASD) and character physics arrive in Phase 2 & 3.
          </span>
        </div>
      </footer>
    </div>
  );
}
