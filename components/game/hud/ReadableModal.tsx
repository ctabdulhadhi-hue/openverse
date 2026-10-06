"use client";

import { useEffect, useState } from "react";

import { interactionStore, type ReadableModalData } from "@/game/interaction";

/**
 * In-game reading overlay for interactive Signs, Kiosks, and Terminals.
 * Styled with OPENVERSE's dark glassmorphism aesthetic.
 */
export function ReadableModal() {
  const [readable, setReadable] = useState<ReadableModalData | null>(() =>
    interactionStore.getActiveReadable(),
  );

  useEffect(() => {
    return interactionStore.subscribeReadable((data) => {
      setReadable(data);
    });
  }, []);

  // Keyboard shortcut listener to close with E or ESC
  useEffect(() => {
    if (!readable) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE" || e.code === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        interactionStore.closeReadable();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [readable]);

  if (!readable) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={readable.title}
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <div className="animate-in fade-in zoom-in-95 relative flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-cyan-500/40 bg-slate-950/90 p-6 font-sans text-white shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-xl duration-200">
        {/* Header Tag / Subtitle */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              {readable.subtitle ?? "WORLD ARCHIVE"}
            </span>
          </div>
          {readable.location && (
            <span className="font-mono text-[11px] text-neutral-400">{readable.location}</span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-black tracking-wide text-white uppercase">
          {readable.title}
        </h2>

        {/* Content Body */}
        <div className="py-2 text-sm leading-relaxed whitespace-pre-line text-neutral-300">
          {readable.content}
        </div>

        {/* Footer Dismiss Button / Hints */}
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white">
              E
            </span>
            <span>or</span>
            <span className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white">
              ESC
            </span>
            <span>to close</span>
          </div>

          <button
            type="button"
            onClick={() => interactionStore.closeReadable()}
            className="rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-4 py-1.5 font-mono text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
