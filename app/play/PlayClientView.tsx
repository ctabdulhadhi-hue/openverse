"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import type * as THREE from "three";

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
import { initMissionSystem } from "@/game/missions/MissionIntegration";
import { getRegionAt } from "@/game/world/WorldRegions";

const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoader statusText="Initializing OPENVERSE 3D World..." />,
  },
);

function PlayContent() {
  const { state, setCurrentRegion, showLocationBanner, pushNotification } = useGame();
  const { activeMenu } = state.ui;

  useEffect(() => {
    initMissionSystem((notif) => {
      pushNotification(notif);
    });
  }, [pushNotification]);

  // Track active region to detect when player crosses boundaries
  const currentRegionIdRef = useRef<string>("");

  const handlePlayerRuntimeUpdate = useCallback(
    (pos: THREE.Vector3) => {
      const region = getRegionAt(pos.x, pos.z);
      if (region.id !== currentRegionIdRef.current) {
        currentRegionIdRef.current = region.id;
        setCurrentRegion(region.name, region.category);
        showLocationBanner(region.name, region.category);
      }
    },
    [setCurrentRegion, showLocationBanner],
  );

  return (
    <div
      data-testid="play-view-container"
      className="relative h-screen w-screen overflow-hidden bg-[color:var(--color-ov-night,#0a0f1d)] text-white select-none"
    >
      {/* 3D Canvas Viewport - Dominates the screen */}
      <div className="absolute inset-0 z-0">
        <GameCanvas
          showDebugGrid={state.debug.showGrid}
          freeCamera={state.debug.freeCamera}
          onPlayerRuntimeUpdate={handlePlayerRuntimeUpdate}
        />
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
