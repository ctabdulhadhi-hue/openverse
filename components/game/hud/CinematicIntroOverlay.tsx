"use client";

import { useEffect, useState } from "react";

import { introStore } from "@/game/cinematic/introStore";
import type { IntroTelemetry } from "@/game/cinematic/introTypes";

export function CinematicIntroOverlay() {
  const [telemetry, setTelemetry] = useState<IntroTelemetry>(() => introStore.getTelemetry());
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    return introStore.subscribe((t) => {
      setTelemetry(t);
      if (t.phase === "FLYOVER" || t.phase === "HANDOFF" || t.phase === "COMPLETED") {
        setIsFadingOut(true);
      } else {
        setIsFadingOut(false);
      }
    });
  }, []);

  // Keyboard shortcut listener: ESC or Space to skip, M to mute
  useEffect(() => {
    if (!introStore.isActive()) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") {
        e.preventDefault();
        introStore.skip();
      } else if (e.key === "m" || e.key === "M") {
        introStore.toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [telemetry.phase]);

  // When intro completes, unmount completely
  if (telemetry.phase === "COMPLETED" || telemetry.phase === "UNINITIALIZED") {
    return null;
  }

  const isFlyoverPhase = telemetry.phase === "FLYOVER" || telemetry.phase === "HANDOFF";

  return (
    <div
      data-testid="cinematic-intro-overlay"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ======================================================== */}
      {/* 1. PURE BLACK ANIMATED LOADING SCREEN (#000000)          */}
      {/* Smoothly fades to transparent over 1.8s when FLYOVER begins */}
      {/* ======================================================== */}
      <div
        data-testid="intro-loading-screen"
        className={`pointer-events-auto absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-center text-white transition-opacity duration-[1800ms] ease-out ${
          isFadingOut ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-6 px-6">
          {/* Elegant Centered Loading Text */}
          <h2
            data-testid="intro-loading-text"
            className="font-sans text-xl font-light tracking-[0.25em] text-neutral-200 drop-shadow-sm sm:text-2xl"
          >
            Loading Openverse…
          </h2>

          {/* Smooth Animated Loading Indicator: Thin Sleek Progress Line */}
          <div
            data-testid="intro-loading-indicator"
            className="relative h-[2px] w-56 overflow-hidden rounded-full border border-white/5 bg-neutral-900 sm:w-72"
          >
            <div
              data-testid="intro-loading-progress-bar"
              className="h-full rounded-full bg-gradient-to-r from-neutral-600 via-neutral-200 to-white/90 shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out"
              style={{ width: `${Math.max(6, telemetry.loadingProgress)}%` }}
            />
          </div>

          {/* Three Smooth Pulsing Dots */}
          <div className="flex items-center justify-center gap-2" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:200ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:400ms]" />
          </div>

          {/* Asset-Loading Error Handling & Clear Recovery / Retry Path */}
          {telemetry.loadingError && (
            <div
              data-testid="intro-loading-error-panel"
              className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-amber-500/30 bg-neutral-950/80 px-5 py-3 backdrop-blur-md"
            >
              <p className="font-mono text-xs text-amber-300/90">
                Notice: Some assets delayed or unavailable.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-testid="intro-retry-button"
                  onClick={() => introStore.retryLoading()}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-neutral-200 transition hover:bg-white/20"
                >
                  Retry Loading
                </button>
                <button
                  type="button"
                  data-testid="intro-continue-button"
                  onClick={() => introStore.onWorldReady()}
                  className="rounded-lg border border-amber-400/40 bg-amber-500/20 px-3 py-1 font-mono text-xs text-amber-200 transition hover:bg-amber-500/30"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CINEMATIC WIDESCREEN LETTERBOXING (During Flyover)    */}
      {/* ======================================================== */}
      {isFlyoverPhase && (
        <>
          {/* Top Cinema Bar */}
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-30 h-10 bg-black/90 backdrop-blur-xs transition-opacity duration-700 sm:h-14" />
          {/* Bottom Cinema Bar */}
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 h-12 bg-black/90 backdrop-blur-xs transition-opacity duration-700 sm:h-16" />
        </>
      )}

      {/* ======================================================== */}
      {/* 3. DYNAMIC LANDMARK LOCATION CARD (During Flyover)       */}
      {/* ======================================================== */}
      {isFlyoverPhase && (
        <div
          data-testid="intro-landmark-card"
          className="absolute bottom-6 left-6 z-40 flex flex-col gap-1 transition-all duration-500 sm:bottom-8 sm:left-10"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400" />
            <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-amber-400 uppercase sm:text-xs">
              CINEMATIC DRONE TOUR
            </span>
          </div>
          <h2 className="font-display text-xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl">
            {telemetry.activeLocationTitle}
          </h2>
          <p className="font-sans text-xs font-medium tracking-wide text-neutral-300 drop-shadow sm:text-sm">
            {telemetry.activeSubtitle}
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. OVERLAY CONTROLS: MUTE / ENABLE SOUND (Top Right)     */}
      {/* ======================================================== */}
      {isFlyoverPhase && (
        <div className="pointer-events-auto relative z-40 flex w-full items-center justify-end p-4 sm:p-6">
          {!telemetry.audioAllowed ? (
            <button
              type="button"
              data-testid="intro-sound-enable-button"
              onClick={() => {
                void introStore.enableSound();
              }}
              className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-black/70 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-300 backdrop-blur-md transition hover:border-amber-400 hover:text-white"
              title="Autoplay was blocked. Click to enable soundtrack"
            >
              <span>🔊</span>
              <span>ENABLE SOUND</span>
            </button>
          ) : (
            <button
              type="button"
              data-testid="intro-mute-button"
              onClick={() => {
                introStore.toggleMute();
              }}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 font-mono text-xs font-semibold text-neutral-300 backdrop-blur-md transition hover:border-white/40 hover:text-white"
              title="Toggle audio (Shortcut: M)"
            >
              <span>{telemetry.isMuted ? "🔇" : "🔊"}</span>
              <span>{telemetry.isMuted ? "MUTED" : "SOUND ON"}</span>
            </button>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. OVERLAY CONTROLS: SKIP INTRO BUTTON (Bottom Right)    */}
      {/* ======================================================== */}
      {isFlyoverPhase && (
        <div className="pointer-events-auto relative z-40 flex w-full items-center justify-end p-4 sm:p-6">
          <button
            type="button"
            data-testid="intro-skip-button"
            onClick={() => {
              introStore.skip();
            }}
            className="font-display flex items-center gap-2 rounded-xl border border-white/25 bg-black/60 px-4 py-2 text-xs font-bold tracking-widest text-neutral-200 backdrop-blur-md transition-all hover:border-amber-400/60 hover:bg-black/80 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
            title="Skip intro to normal gameplay (Shortcut: ESC / SPACE)"
          >
            <span>SKIP INTRO</span>
            <span className="font-mono text-[10px] text-neutral-400">[ESC]</span>
          </button>
        </div>
      )}
    </div>
  );
}
