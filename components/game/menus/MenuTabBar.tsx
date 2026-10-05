"use client";

import { useGame } from "@/game/core/state/GameContext";
import type { GameMenu } from "@/game/core/state/gameStateTypes";

interface MenuTabBarProps {
  currentTab: GameMenu;
}

const TABS: { id: GameMenu; label: string }[] = [
  { id: "map", label: "MAP" },
  { id: "missions", label: "MISSIONS" },
  { id: "inventory", label: "INVENTORY" },
  { id: "character", label: "CHARACTER" },
  { id: "settings", label: "SETTINGS" },
];

/**
 * Top menu tab bar matching panels 4-8 in the concept reference collage.
 * Provides consistent tab navigation between Map, Missions, Inventory, Character, and Settings.
 */
export function MenuTabBar({ currentTab }: MenuTabBarProps) {
  const { openMenu, closeMenu } = useGame();

  const handlePrevTab = () => {
    const currentIndex = TABS.findIndex((t) => t.id === currentTab);
    const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    const prevTab = TABS[prevIndex];
    if (prevTab) openMenu(prevTab.id);
  };

  const handleNextTab = () => {
    const currentIndex = TABS.findIndex((t) => t.id === currentTab);
    const nextIndex = (currentIndex + 1) % TABS.length;
    const nextTab = TABS[nextIndex];
    if (nextTab) openMenu(nextTab.id);
  };

  return (
    <div className="relative flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-3.5 backdrop-blur-xl">
      {/* Previous Tab Key (Q) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevTab}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs font-bold text-neutral-400 transition hover:border-cyan-400 hover:text-white"
          aria-label="Previous tab (Q)"
        >
          Q
        </button>
      </div>

      {/* Tabs List */}
      <nav aria-label="Game sub-menus" className="flex items-center gap-1.5 sm:gap-3">
        {TABS.map((tab) => {
          const isActive = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => openMenu(tab.id)}
              className={`font-display relative rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition sm:text-sm ${
                isActive
                  ? "border border-cyan-400/50 bg-cyan-500/25 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.35)]"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Next Tab Key (E) & Close Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNextTab}
          className="hidden h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs font-bold text-neutral-400 transition hover:border-cyan-400 hover:text-white sm:flex"
          aria-label="Next tab (E)"
        >
          E
        </button>

        <button
          type="button"
          onClick={closeMenu}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-semibold text-neutral-300 transition hover:border-red-400/40 hover:text-red-300"
        >
          <span>ESC</span>
          <span className="hidden sm:inline">Close</span>
        </button>
      </div>
    </div>
  );
}
