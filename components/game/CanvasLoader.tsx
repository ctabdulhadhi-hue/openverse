"use client";

import Image from "next/image";

import { PROJECT } from "@/lib/config/project";

interface CanvasLoaderProps {
  statusText?: string;
  progressPercent?: number;
  tipText?: string;
}

/**
 * Cinematic loading screen matching panel 9 of the concept reference collage.
 * Displays atmospheric backdrop, progress bar, and discovery tips.
 */
export function CanvasLoader({
  statusText = "Loading world...",
  progressPercent = 68,
  tipText = "Some discoveries are hidden away from the main roads.",
}: CanvasLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-slate-950 p-8 text-center text-white sm:p-12"
    >
      {/* Background Image Vista */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/landing_hero.jpg"
          alt="Loading backdrop"
          fill
          sizes="100vw"
          className="scale-105 object-cover opacity-35 blur-[2px] filter"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950" />
      </div>

      <div className="h-6" aria-hidden="true" />

      {/* Center Hero Logo & Progress Bar */}
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
        <h2 className="font-display text-4xl font-black tracking-[0.25em] text-white uppercase drop-shadow-xl sm:text-5xl">
          {PROJECT.name}
        </h2>

        <p className="font-display text-sm tracking-wider text-neutral-300">{statusText}</p>

        {/* Progress Bar with Cyan Glow */}
        <div className="mt-2 flex w-full flex-col gap-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/10 backdrop-blur-sm">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-right font-mono text-xs font-bold text-cyan-300">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Bottom Tip Card */}
      <div className="flex justify-center">
        <div className="flex max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-5 py-3 text-xs text-neutral-300 shadow-xl backdrop-blur-md">
          <span className="text-base text-amber-400" aria-hidden="true">
            💡
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase">
            TIP:
          </span>
          <span className="font-medium text-neutral-200">{tipText}</span>
        </div>
      </div>
    </div>
  );
}
