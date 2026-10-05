"use client";

import dynamic from "next/dynamic";

import { CanvasLoader } from "@/components/game/CanvasLoader";
import { GameHUD } from "@/components/game/hud/GameHUD";
import { AboutScreen } from "@/components/game/menus/AboutScreen";
import { CharacterScreen } from "@/components/game/menus/CharacterScreen";
import { ControlsScreen } from "@/components/game/menus/ControlsScreen";
import { DebugPanel } from "@/components/game/menus/DebugPanel";
import { InventoryScreen } from "@/components/game/menus/InventoryScreen";
import { MissionsScreen } from "@/components/game/menus/MissionsScreen";
import { PauseMenu } from "@/components/game/menus/PauseMenu";
import { SettingsScreen } from "@/components/game/menus/SettingsScreen";
import { WorldMapScreen } from "@/components/game/menus/WorldMapScreen";
import { GameProvider, useGame } from "@/game/core/state/GameContext";

const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoader statusText="Initializing OPENVERSE 3D World..." />,
  },
);

function PlayContent() {
  const { state } = useGame();
  const { activeMenu } = state.ui;

  return (
    <div
      data-testid="play-view-container"
      className="relative h-screen w-screen overflow-hidden bg-[color:var(--color-ov-night,#0a0f1d)] text-white select-none"
    >
      {/* 3D Canvas Viewport - Dominates the screen */}
      <div className="absolute inset-0 z-0">
        <GameCanvas showDebugGrid={state.debug.showGrid} />
      </div>

      {/* Primary In-Game HUD (Visible during active gameplay) */}
      <GameHUD />

      {/* Game Menu Overlays */}
      {activeMenu === "pause" && <PauseMenu />}
      {activeMenu === "map" && <WorldMapScreen />}
      {activeMenu === "missions" && <MissionsScreen />}
      {activeMenu === "inventory" && <InventoryScreen />}
      {activeMenu === "character" && <CharacterScreen />}
      {activeMenu === "settings" && <SettingsScreen />}
      {activeMenu === "controls" && <ControlsScreen />}
      {activeMenu === "about" && <AboutScreen />}

      {/* Developer Diagnostics Panel (Hidden by default, toggleable via F3 or ~) */}
      <DebugPanel />
    </div>
  );
}

export function PlayClientView() {
  return (
    <GameProvider>
      <PlayContent />
    </GameProvider>
  );
}
