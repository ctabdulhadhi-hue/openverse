"use client";

import { useGame } from "@/game/core/state/GameContext";

/**
 * Bottom-left circular game HUD minimap.
 * Displays radar orientation, player position pointer, road lines, and waypoint markers.
 * Clicking opens the full-screen world map.
 */
export function MiniMap() {
  const { openMenu } = useGame();

  return (
    <button
      type="button"
      data-testid="minimap"
      onClick={() => openMenu("map")}
      className="group pointer-events-auto relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-slate-950/70 p-2 shadow-2xl backdrop-blur-md transition hover:scale-105 hover:border-cyan-400 sm:h-40 sm:w-40"
      aria-label="Open full world map (Key M)"
    >
      {/* Outer compass ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20" />

      {/* North marker */}
      <div className="absolute top-1.5 flex flex-col items-center">
        <span className="font-mono text-[9px] font-extrabold text-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]">
          N
        </span>
      </div>

      {/* Stylized vector radar terrain & roads */}
      <svg
        className="h-full w-full opacity-60 transition group-hover:opacity-85"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Radar range concentric rings */}
        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="28"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <circle cx="50" cy="50" r="14" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Stylized road & river contours */}
        <path
          d="M10 50 Q30 45 50 50 T90 55"
          stroke="#475569"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M50 10 Q52 35 50 50 T48 90"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M25 80 Q45 60 75 30" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        {/* River accent */}
        <path
          d="M30 15 Q20 50 35 85"
          stroke="#0284c7"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />

        {/* POI Markers */}
        {/* Mission waypoint (Gold diamond) */}
        <polygon points="68,34 72,38 68,42 64,38" fill="#f59e0b" />
        <circle cx="68" cy="38" r="5" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />

        {/* Shop marker (Cyan circle) */}
        <circle cx="34" cy="54" r="2.5" fill="#38bdf8" />

        {/* Activity marker (Emerald) */}
        <circle cx="58" cy="72" r="2" fill="#10b981" />
      </svg>

      {/* Center Player Pointer (glowing cyan delta arrow) */}
      <div className="absolute flex h-5 w-5 items-center justify-center">
        <div className="h-0 w-0 border-x-4 border-b-[10px] border-x-transparent border-b-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,1)]" />
      </div>

      {/* Subtle hover prompt overlay */}
      <div className="absolute bottom-2 font-mono text-[8px] font-semibold tracking-widest text-neutral-400 uppercase opacity-0 transition group-hover:opacity-100">
        Press M
      </div>
    </button>
  );
}
