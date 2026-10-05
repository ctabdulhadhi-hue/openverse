"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CURRENT_PHASE, NEXT_PHASE, PROJECT } from "@/lib/config/project";

type ModalTab = "about" | "settings" | "controls" | "news" | "community" | "load" | null;

export function LandingView() {
  const [activeModal, setActiveModal] = useState<ModalTab>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-white select-none">
      {/* Fullscreen Hero Background with Cinematic Tone */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing_hero.jpg"
          alt="OPENVERSE Vista"
          fill
          priority
          sizes="100vw"
          className="scale-[1.02] object-cover object-center brightness-90 contrast-[1.05] filter"
        />
        {/* Subtle Vignette & Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,10,25,0.65)_100%)]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        {/* Brand & Nav Links */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="font-display text-2xl font-black tracking-[0.25em] text-white transition hover:text-cyan-300"
          >
            {PROJECT.name}
          </Link>

          <nav className="font-display hidden items-center gap-8 text-xs font-semibold tracking-[0.16em] text-neutral-300 uppercase md:flex">
            <Link href="/" className="text-white transition hover:text-cyan-300">
              Home
            </Link>
            <button
              type="button"
              onClick={() => setActiveModal("about")}
              className="cursor-pointer uppercase transition hover:text-cyan-300"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("community")}
              className="cursor-pointer uppercase transition hover:text-cyan-300"
            >
              Community
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("news")}
              className="cursor-pointer uppercase transition hover:text-cyan-300"
            >
              News
            </button>
          </nav>
        </div>

        {/* Search & Profile Icons */}
        <div className="flex items-center gap-4">
          {showSearch ? (
            <div className="animate-fade-in flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <svg
                className="h-3.5 w-3.5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lore, regions..."
                className="w-32 bg-transparent text-xs text-white placeholder-neutral-400 outline-none md:w-48"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-neutral-300 backdrop-blur-md transition hover:border-cyan-400/50 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveModal("about")}
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 backdrop-blur-md transition hover:bg-cyan-500/20"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/hadhi_avatar.jpg"
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Center Hero Content */}
      <main className="relative z-10 flex min-h-[calc(100vh-140px)] flex-col items-center justify-center px-6 text-center">
        {/* Main Title & Tagline */}
        <h1 className="font-display text-5xl font-black tracking-[0.24em] text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
          {PROJECT.name}
        </h1>

        <p className="font-display mt-3 text-sm tracking-[0.16em] text-neutral-200 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-base md:text-lg">
          {PROJECT.tagline}
        </p>

        {/* Primary Action Button: PLAY */}
        <div className="mt-10">
          <Link
            href="/play"
            id="play-button"
            className="group font-display relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-cyan-400/60 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 px-14 py-3.5 text-base font-bold tracking-[0.24em] text-white uppercase shadow-[0_0_35px_rgba(34,211,238,0.35)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_50px_rgba(34,211,238,0.55)]"
          >
            <span className="relative z-10">PLAY</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              ›
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>

        {/* Menu Navigation Items (Matching Panel 1 of Reference) */}
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
          <Link
            href="/play"
            className="font-display flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs font-bold tracking-[0.2em] text-neutral-200 uppercase backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
          >
            <span>CONTINUE</span>
            <span className="text-cyan-400">›</span>
          </Link>

          <Link
            href="/play"
            className="font-display flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs font-bold tracking-[0.2em] text-neutral-200 uppercase backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
          >
            <span>NEW GAME</span>
            <span className="text-cyan-400">›</span>
          </Link>

          <button
            type="button"
            onClick={() => setActiveModal("load")}
            className="font-display flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs font-bold tracking-[0.2em] text-neutral-200 uppercase backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
          >
            <span>LOAD GAME</span>
            <span className="text-cyan-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("settings")}
            className="font-display flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs font-bold tracking-[0.2em] text-neutral-200 uppercase backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
          >
            <span>SETTINGS</span>
            <span className="text-cyan-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("controls")}
            className="font-display flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs font-bold tracking-[0.2em] text-neutral-200 uppercase backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
          >
            <span>CONTROLS</span>
            <span className="text-cyan-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("about")}
            className="font-display flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs font-bold tracking-[0.2em] text-neutral-200 uppercase backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
          >
            <span>ABOUT</span>
            <span className="text-cyan-400">›</span>
          </button>
        </div>
      </main>

      {/* Footer System / Subtitle Tagline */}
      <footer className="relative z-20 flex flex-col items-center justify-between px-6 py-4 text-[10px] tracking-[0.24em] text-neutral-400 uppercase md:flex-row md:px-12">
        <div>A BROWSER-BASED OPEN WORLD EXPERIENCE</div>
        <div className="mt-2 flex items-center gap-3 font-mono md:mt-0">
          <span
            data-testid="phase-badge"
            className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-cyan-300"
          >
            Phase {CURRENT_PHASE.number} — {CURRENT_PHASE.name}
          </span>
          <span className="text-neutral-500">
            Upcoming: Phase {NEXT_PHASE.number} — {NEXT_PHASE.name}
          </span>
        </div>
      </footer>

      {/* Modals for Settings, Controls, About, News, Community, Load */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-xl"
        >
          <div className="flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-display text-2xl font-black tracking-[0.22em] text-white uppercase">
                  {activeModal.toUpperCase()}
                </h2>
                <p className="font-display mt-0.5 text-xs tracking-widest text-cyan-400 uppercase">
                  OPENVERSE SYSTEM OVERLAY
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold text-neutral-300 transition hover:border-cyan-400 hover:text-white"
              >
                <span>✕</span>
                <span>Close</span>
              </button>
            </div>

            {/* Modal Content Switch */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 text-neutral-300">
              {activeModal === "about" && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed">
                    OPENVERSE is an original browser-based open-world experience built around
                    exploration, freedom, and discovery. Explore an expansive fictional continent
                    featuring vibrant coastal cities, mountain peaks, and dense wilderness.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="font-display text-xs font-bold text-cyan-400 uppercase">
                        Seamless World
                      </div>
                      <div className="mt-1 text-xs text-neutral-400">
                        Real-time 3D engine running directly inside the browser.
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="font-display text-xs font-bold text-cyan-400 uppercase">
                        Non-Linear Exploration
                      </div>
                      <div className="mt-1 text-xs text-neutral-400">
                        Carve your own trajectory through missions and activities.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "settings" && (
                <div className="flex flex-col gap-4 text-xs">
                  <p className="text-neutral-400">
                    Settings can also be modified in-game via the Pause Menu (ESC).
                  </p>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <span className="font-bold tracking-wider text-white uppercase">
                      Quality Preset
                    </span>
                    <span className="font-mono text-cyan-400">Ultra / High</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <span className="font-bold tracking-wider text-white uppercase">
                      Audio Output
                    </span>
                    <span className="font-mono text-cyan-400">Dynamic Stereo</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <span className="font-bold tracking-wider text-white uppercase">
                      Target Framerate
                    </span>
                    <span className="font-mono text-cyan-400">60 FPS</span>
                  </div>
                </div>
              )}

              {activeModal === "controls" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">W A S D</span>
                    <span className="text-neutral-400">Movement</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">SHIFT</span>
                    <span className="text-neutral-400">Sprint</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">SPACE</span>
                    <span className="text-neutral-400">Jump</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">MOUSE</span>
                    <span className="text-neutral-400">Look / Camera</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">E</span>
                    <span className="text-neutral-400">Interact</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">M</span>
                    <span className="text-neutral-400">World Map</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">TAB</span>
                    <span className="text-neutral-400">Inventory</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="font-mono font-bold text-white">ESC</span>
                    <span className="text-neutral-400">Pause Menu</span>
                  </div>
                </div>
              )}

              {activeModal === "news" && (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold tracking-wider text-white uppercase">
                        Concept Template Live
                      </span>
                      <span className="font-mono text-neutral-500">Oct 2026</span>
                    </div>
                    <p className="mt-1 text-neutral-400">
                      The full OPENVERSE UI shell and game template are now active, integrating the
                      HUD, world map, mission log, inventory, and character views.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold tracking-wider text-white uppercase">
                        Phase 2 on Horizon
                      </span>
                      <span className="font-mono text-neutral-500">Upcoming</span>
                    </div>
                    <p className="mt-1 text-neutral-400">
                      Player character controller, physics collision system, and smooth WASD
                      navigation will arrive in the next major development phase.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "community" && (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-neutral-300">
                    Connect with other OPENVERSE explorers, share discoveries, and contribute
                    feedback.
                  </p>
                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-4">
                    <div className="font-bold text-cyan-300 uppercase">Community Hub</div>
                    <p className="mt-1 text-neutral-400">
                      Discord server, development devlogs, and creator workshops will open alongside
                      Phase 2.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "load" && (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between rounded-xl border border-cyan-400/40 bg-cyan-950/30 p-4">
                    <div>
                      <div className="font-bold text-white uppercase">
                        Slot 1: Hadhi — Central District
                      </div>
                      <div className="mt-0.5 text-[11px] text-neutral-400">
                        Day 1 · Level 01 · 320 XP · Saved Recently
                      </div>
                    </div>
                    <Link
                      href="/play"
                      className="font-display rounded-lg bg-cyan-500 px-4 py-2 font-bold text-black uppercase transition hover:bg-cyan-400"
                    >
                      Load
                    </Link>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 opacity-50">
                    <div>
                      <div className="font-bold text-neutral-400 uppercase">Slot 2: Empty</div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">
                        No save file recorded
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-600">EMPTY</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action */}
            <div className="flex justify-end border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="font-display rounded-xl bg-white/10 px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-white/20"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
