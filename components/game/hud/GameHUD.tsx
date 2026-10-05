"use client";

import { useGame } from "@/game/core/state/GameContext";

import { Compass } from "./Compass";
import { ControlHints } from "./ControlHints";
import { InteractionPrompt } from "./InteractionPrompt";
import { LocationIndicator } from "./LocationIndicator";
import { MiniMap } from "./MiniMap";
import { NotificationStack } from "./NotificationStack";
import { ObjectivePanel } from "./ObjectivePanel";
import { PlayerStatus } from "./PlayerStatus";
import { WorldStatus } from "./WorldStatus";

/**
 * Master Game HUD overlay.
 * Active during gameplay, hidden during modal menus.
 */
export function GameHUD() {
  const { state, openMenu } = useGame();
  const isMenuOpen = state.ui.activeMenu !== "none";

  if (isMenuOpen || !state.settings.interface.showHud) {
    return null;
  }

  return (
    <div
      data-testid="game-hud-root"
      className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 select-none sm:p-6"
    >
      {/* Dynamic Toast Notifications */}
      <NotificationStack />

      {/* Top Header Bar */}
      <div className="flex items-start justify-between gap-4">
        {/* Top-Left: Player Avatar & Level / XP */}
        <PlayerStatus />

        {/* Top-Center: Sleek Navigation Compass */}
        {state.settings.interface.showCompass && <Compass />}

        {/* Top-Right: Weather Clock & Currency */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <WorldStatus />
            <button
              type="button"
              onClick={() => openMenu("pause")}
              className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-neutral-300 shadow-lg backdrop-blur-md transition hover:border-cyan-400 hover:text-white"
              title="Pause Menu (ESC)"
              aria-label="Pause Menu (ESC)"
            >
              MENU [ESC]
            </button>
          </div>

          {/* Upper-Right Objective Tracker */}
          <ObjectivePanel />
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom-Left: Circular Radar Minimap & Location */}
        <div className="flex flex-col items-start gap-2">
          {state.settings.interface.showMinimap && <MiniMap />}
          <LocationIndicator />
        </div>

        {/* Bottom-Center: Contextual Keycap Interaction Prompt */}
        <div className="flex justify-center pb-2">
          <InteractionPrompt />
        </div>

        {/* Bottom-Right: Quick Keyboard Control Hints */}
        <div className="flex justify-end">
          <ControlHints />
        </div>
      </div>
    </div>
  );
}
