"use client";

import { useEffect } from "react";

import { useGame } from "@/game/core/state/GameContext";

export function NotificationStack() {
  const { state, dismissNotification } = useGame();
  const notifications = state.ui.notifications;

  // Automatically dismiss notifications after 4 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const now = Date.now();
    const timers = notifications.map((n) => {
      const elapsed = now - n.timestamp;
      const remaining = Math.max(300, 4000 - elapsed);
      return setTimeout(() => {
        dismissNotification(n.id);
      }, remaining);
    });
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [notifications, dismissNotification]);

  if (notifications.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="In-game notifications"
      className="pointer-events-none fixed top-20 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4"
    >
      {notifications.map((n) => {
        let badgeColor = "border-cyan-400/60 bg-cyan-500/20 text-cyan-300";
        if (n.type === "mission") badgeColor = "border-amber-400/60 bg-amber-500/20 text-amber-300";
        if (n.type === "item")
          badgeColor = "border-emerald-400/60 bg-emerald-500/20 text-emerald-300";
        if (n.type === "location")
          badgeColor = "border-amber-500/60 bg-amber-600/20 text-amber-200";

        return (
          <div
            key={n.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-xs items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/75 px-3 py-2 shadow-xl backdrop-blur-md transition hover:border-white/30"
          >
            <div className="flex flex-col">
              <span
                className={`w-fit rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${badgeColor}`}
              >
                {n.title}
              </span>
              <span className="font-display mt-0.5 text-xs font-semibold tracking-wide text-white">
                {n.subtitle}
              </span>
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(n.id)}
              className="rounded p-1 text-xs text-neutral-400 transition hover:text-white"
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
