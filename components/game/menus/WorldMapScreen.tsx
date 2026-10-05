"use client";

import Image from "next/image";
import { useState } from "react";

import type { LocationDefinition } from "@/data/locations/locationsData";
import { useGame } from "@/game/core/state/GameContext";

import { MenuTabBar } from "./MenuTabBar";

const LEGEND_ITEMS = [
  { label: "Player", icon: "▲", color: "text-cyan-400" },
  { label: "Main Mission", icon: "⭐", color: "text-amber-400" },
  { label: "Side Mission", icon: "◆", color: "text-sky-400" },
  { label: "Activity", icon: "●", color: "text-emerald-400" },
  { label: "Shop", icon: "❖", color: "text-purple-400" },
  { label: "Fast Travel", icon: "⛩", color: "text-cyan-300" },
  { label: "Discovered", icon: "◎", color: "text-neutral-300" },
  { label: "Undiscovered", icon: "?", color: "text-neutral-500" },
];

export function WorldMapScreen() {
  const { state, closeMenu, pushNotification } = useGame();
  const [selectedLocation, setSelectedLocation] = useState<LocationDefinition | null>(
    state.locations[0] ?? null,
  );

  const handleFastTravel = (loc: LocationDefinition) => {
    pushNotification({
      type: "location",
      title: "FAST TRAVELLED",
      subtitle: `Arrived at ${loc.name}`,
    });
    closeMenu();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="World map"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-slate-950 text-white"
    >
      {/* Top Tab Navigation */}
      <MenuTabBar currentTab="map" />

      {/* Main Map Content Viewport */}
      <div className="relative flex-1 overflow-hidden bg-slate-900">
        {/* Full Interactive Map Image Backdrop */}
        <div className="relative h-full w-full">
          <Image
            src="/images/world_map.jpg"
            alt="OPENVERSE World Map"
            fill
            sizes="100vw"
            className="object-contain sm:object-cover"
            priority
          />

          {/* Map Interactive Pins */}
          {state.locations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                style={{ top: `${loc.coordinates.y}%`, left: `${loc.coordinates.x}%` }}
                className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full p-2 transition ${
                  isSelected ? "z-30 scale-125" : "z-20 hover:scale-110"
                }`}
                aria-label={`Select location ${loc.name}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-xl backdrop-blur-md transition ${
                    isSelected
                      ? "border-cyan-300 bg-cyan-500/80 text-white shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                      : loc.discovered
                        ? "border-white/40 bg-black/60 text-cyan-300 hover:border-cyan-400"
                        : "border-neutral-600 bg-black/80 text-neutral-500"
                  }`}
                >
                  {loc.discovered ? "◎" : "?"}
                </div>
                <span className="font-display hidden rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-md sm:inline-block">
                  {loc.discovered ? loc.name : "Unexplored"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Left Side: Map Legend Card */}
        <aside className="absolute top-6 left-6 z-30 flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-xl">
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">
            Map Legend
          </h3>
          <ul className="flex flex-col gap-1.5 text-xs text-neutral-300">
            {LEGEND_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span className={`w-4 text-center font-bold ${item.color}`}>{item.icon}</span>
                <span className="text-[11px] font-medium text-neutral-300">{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Side: Selected Location Detail Card */}
        {selectedLocation && (
          <aside className="absolute right-6 bottom-16 z-30 flex max-w-sm flex-col gap-3 rounded-2xl border border-white/10 bg-black/75 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <h4 className="font-display text-base font-bold tracking-wider text-white uppercase">
                  {selectedLocation.discovered ? selectedLocation.name : "Undiscovered Location"}
                </h4>
                <span className="font-display text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                  {selectedLocation.region}
                </span>
              </div>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
                {selectedLocation.discovered ? "Discovered" : "Locked"}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-neutral-300">
              {selectedLocation.discovered
                ? selectedLocation.description
                : "Travel closer to this region to reveal its landscape, landmarks, and available missions."}
            </p>

            {selectedLocation.discovered && (
              <button
                type="button"
                onClick={() => handleFastTravel(selectedLocation)}
                className="font-display mt-2 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/25 py-2.5 text-xs font-bold tracking-widest text-cyan-300 uppercase shadow-[0_0_12px_rgba(56,189,248,0.3)] transition hover:bg-cyan-500/40"
              >
                <span>⛩</span>
                <span>Fast Travel</span>
              </button>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Map Controls Bar */}
      <footer className="flex items-center justify-between border-t border-white/10 bg-black/50 px-6 py-3 font-mono text-xs text-neutral-400 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <span>🔍 Zoom: Mouse Wheel</span>
          <span>📍 Click Marker to Inspect</span>
        </div>
        <div>
          <span>[ESC] Return to Game</span>
        </div>
      </footer>
    </div>
  );
}
