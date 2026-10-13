"use client";

import { useEffect, useState } from "react";

import { introStore } from "@/game/cinematic/introStore";

interface CanvasLoaderProps {
  statusText?: string;
  progressPercent?: number;
  tipText?: string;
}

/**
 * Pure Black Cinematic Loading Screen for OPENVERSE.
 *
 * Requirements:
 * - Full-screen pure black background (#000000)
 * - Elegant centered loading text: "Loading Openverse…"
 * - Smooth animated loading indicator (thin animated progress line + pulsing dots)
 * - Clean, modern typography with subtle white/muted-grey styling
 * - Minimal, premium, and cinematic
 * - No logo, background image, title image, video, or extra UI elements
 */
export function CanvasLoader({
  statusText = "Loading Openverse…",
  progressPercent,
}: CanvasLoaderProps) {
  const [storeProgress, setStoreProgress] = useState(
    () => introStore.getTelemetry().loadingProgress,
  );

  useEffect(() => {
    if (progressPercent !== undefined) return;
    return introStore.subscribe((t) => {
      setStoreProgress(t.loadingProgress);
    });
  }, [progressPercent]);

  const progress = progressPercent !== undefined ? progressPercent : storeProgress;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="canvas-loader"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-center text-white select-none"
    >
      <div className="flex flex-col items-center gap-6 px-6">
        {/* Semantic / Accessibility Project Identifier */}
        <span className="sr-only">OPENVERSE</span>

        {/* Elegant Centered Loading Text */}
        <h2 className="font-sans text-xl font-light tracking-[0.25em] text-neutral-200 drop-shadow-sm sm:text-2xl">
          {statusText}
        </h2>

        {/* Animated Loading Indicator: Thin Sleek Progress Line */}
        <div className="relative h-[2px] w-56 overflow-hidden rounded-full border border-white/5 bg-neutral-900 sm:w-72">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neutral-600 via-neutral-200 to-white/90 shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>

        {/* Smooth Pulsing Dots */}
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
