"use client";

import { useGame } from "@/game/core/state/GameContext";

export function NotificationStack() {
  const { state, dismissNotification } = useGame();
  const notifications = state.ui.notifications;

  if (notifications.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="In-game notifications"
      className="pointer-events-none fixed top-16 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2.5 px-4"
    >
      {notifications.map((n) => {
        let badgeColor = "border-cyan-400 bg-cyan-500/20 text-cyan-300";
        if (n.type === "mission") badgeColor = "border-amber-400 bg-amber-500/20 text-amber-300";
        if (n.type === "item") badgeColor = "border-emerald-400 bg-emerald-500/20 text-emerald-300";

        return (
          <div
            key={n.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/80 p-3.5 shadow-2xl backdrop-blur-xl transition hover:border-white/30"
          >
            <div className="flex flex-col">
              <span
                className={`w-fit rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${badgeColor}`}
              >
                {n.title}
              </span>
              <span className="font-display mt-1 text-sm font-semibold tracking-wide text-white">
                {n.subtitle}
              </span>
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(n.id)}
              className="rounded px-2 py-1 text-xs text-neutral-400 transition hover:text-white"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
