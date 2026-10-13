"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { introStore } from "@/game/cinematic/introStore";
import type { IntroTelemetry } from "@/game/cinematic/introTypes";

export function CinematicIntroOverlay() {
  const [telemetry, setTelemetry] = useState<IntroTelemetry>(() => introStore.getTelemetry());
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    return introStore.subscribe((t) => {
      setTelemetry(t);
    });
  }, []);

  // Synchronize HTML5 video element with intro phase
  useEffect(() => {
    if (telemetry.phase === "TITLE") {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch((err) => {
            console.warn("[CinematicIntro] Video autoplay error:", err);
          });
        }
      }
    } else {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [telemetry.phase]);

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

  const isWaitingInteraction = telemetry.phase === "WAITING_FOR_INTERACTION";
  const isTitlePhase = telemetry.phase === "TITLE";
  const isFlyoverPhase = telemetry.phase === "FLYOVER" || telemetry.phase === "HANDOFF";

  return (
    <div
      data-testid="cinematic-intro-overlay"
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ======================================================== */}
      {/* 1. BLACK VIDEO INTRO CANVAS (WAITING & TITLE PHASES)     */}
      {/* ======================================================== */}
      <div
        data-testid="intro-title-screen"
        className={`absolute inset-0 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
          isTitlePhase || isWaitingInteraction ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Supplied Opening Title: Hey Video (Replacing previous JPG) */}
        <div
          data-testid="intro-video-container"
          className="relative flex h-full max-h-[88vh] w-full max-w-[90vw] items-center justify-center"
        >
          {!videoError ? (
            <video
              ref={videoRef}
              data-testid="intro-video-element"
              src="/assets/intro/hey-intro.mp4"
              poster="/assets/intro/hey-title-poster.png"
              playsInline
              muted
              autoPlay
              onLoadedMetadata={(e) => {
                const dur = e.currentTarget.duration;
                if (dur && !isNaN(dur)) {
                  introStore.setIntroDuration(dur);
                }
              }}
              onEnded={() => {
                introStore.onVideoEnded();
              }}
              onError={(e) => {
                console.warn("[IntroVideo] Video error, using poster fallback:", e);
                setVideoError(true);
              }}
              className="h-full max-h-[88vh] w-full max-w-[90vw] object-contain shadow-2xl"
            />
          ) : (
            <div className="relative h-full w-full max-w-md">
              <Image
                src="/assets/intro/hey-title-poster.png"
                alt="Hey Title Card Fallback"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Autoplay Fallback Prompt (When audio requires explicit user click) */}
        {isWaitingInteraction && (
          <div
            data-testid="intro-autoplay-prompt"
            className="absolute bottom-16 z-20 flex flex-col items-center gap-3 px-4 text-center"
          >
            <button
              type="button"
              data-testid="intro-start-button"
              onClick={() => {
                void introStore.startWithUserGesture();
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="group font-display flex items-center gap-3 rounded-2xl border border-amber-400/50 bg-gradient-to-r from-amber-600/80 to-amber-700/80 px-8 py-3.5 text-sm font-bold tracking-[0.25em] text-white uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] active:scale-95"
            >
              <span>🔊</span>
              <span>ENTER OPENVERSE</span>
              <span className="transition-transform group-hover:translate-x-1">›</span>
            </button>
            <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
              Click to begin cinematic experience with soundtrack
            </span>
          </div>
        )}
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
      {/* 4. OVERLAY CONTROLS: MUTE TOGGLE (Top Right)             */}
      {/* ======================================================== */}
      <div className="relative z-40 flex w-full items-center justify-end p-4 sm:p-6">
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
      </div>

      {/* ======================================================== */}
      {/* 5. OVERLAY CONTROLS: SKIP INTRO BUTTON (Bottom Right)    */}
      {/* ======================================================== */}
      <div className="relative z-40 flex w-full items-center justify-end p-4 sm:p-6">
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
    </div>
  );
}
