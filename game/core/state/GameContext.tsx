"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_PLAYER_PROFILE } from "@/data/characters/characterData";
import { ITEMS } from "@/data/items/itemsData";
import { LOCATIONS } from "@/data/locations/locationsData";
import { MISSIONS } from "@/data/missions/missionsData";
import { DEFAULT_WORLD_STATUS } from "@/data/world/worldData";

import type { GameMenu, GameNotification, GameSettings, GameState } from "./gameStateTypes";

interface GameContextValue {
  state: GameState;
  openMenu: (menu: GameMenu) => void;
  closeMenu: () => void;
  toggleMenu: (menu: GameMenu) => void;
  trackMission: (missionId: string) => void;
  setInteractionPrompt: (prompt: string | null) => void;
  showLocationBanner: (name: string, region: string) => void;
  pushNotification: (item: Omit<GameNotification, "id" | "timestamp">) => void;
  dismissNotification: (id: string) => void;
  updateSettings: (updater: (prev: GameSettings) => GameSettings) => void;
  setCurrentRegion: (region: string, zone?: string) => void;
  toggleDebugGrid: () => void;
  toggleDebugAxes: () => void;
  toggleDebugStats: () => void;
  toggleDebugMode: () => void;
  toggleFreeCamera: () => void;
}

const defaultSettings: GameSettings = {
  graphics: {
    quality: "High",
    shadows: "High",
    effects: "High",
    renderDistance: "Far",
    fpsLimit: "60 FPS",
  },
  audio: {
    masterVolume: 85,
    musicVolume: 75,
    sfxVolume: 90,
    ambientVolume: 80,
  },
  controls: {
    mouseSensitivity: 50,
    invertY: false,
  },
  interface: {
    showHud: true,
    showMinimap: true,
    showControlHints: true,
    showCompass: true,
  },
};

const initialGameState: GameState = {
  player: DEFAULT_PLAYER_PROFILE,
  world: DEFAULT_WORLD_STATUS,
  missions: MISSIONS,
  inventory: ITEMS,
  locations: LOCATIONS,
  settings: defaultSettings,
  debug: {
    enabled: false,
    showGrid: false,
    showAxes: false,
    showStats: false,
    freeCamera: false,
  },
  ui: {
    activeMenu: "none",
    isPaused: false,
    interactionPrompt: "INTERACT",
    locationIndicator: {
      name: "Royal Promenade",
      region: "Varanaya",
    },
    notifications: [
      {
        id: "initial-notif-1",
        type: "location",
        title: "LOCATION DISCOVERED",
        subtitle: "Royal Promenade",
        timestamp: Date.now(),
      },
    ],
  },
};

const SETTINGS_STORAGE_KEY = "openverse_settings_v1";

function loadSavedSettings(): GameSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        graphics: { ...defaultSettings.graphics, ...(parsed.graphics ?? {}) },
        audio: { ...defaultSettings.audio, ...(parsed.audio ?? {}) },
        controls: { ...defaultSettings.controls, ...(parsed.controls ?? {}) },
        interface: { ...defaultSettings.interface, ...(parsed.interface ?? {}) },
      };
    }
  } catch {
    // Fall back to defaults on parse error
  }
  return defaultSettings;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...initialGameState,
    settings: loadSavedSettings(),
  }));

  const openMenu = useCallback((menu: GameMenu) => {
    setGameState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        activeMenu: menu,
        isPaused: menu !== "none",
      },
    }));
  }, []);

  const closeMenu = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        activeMenu: "none",
        isPaused: false,
      },
    }));
  }, []);

  const toggleMenu = useCallback((menu: GameMenu) => {
    setGameState((prev) => {
      const isCurrentlyActive = prev.ui.activeMenu === menu;
      const nextMenu = isCurrentlyActive ? "none" : menu;
      return {
        ...prev,
        ui: {
          ...prev.ui,
          activeMenu: nextMenu,
          isPaused: nextMenu !== "none",
        },
      };
    });
  }, []);

  const trackMission = useCallback((missionId: string) => {
    setGameState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) => ({
        ...m,
        tracked: m.id === missionId,
      })),
      ui: {
        ...prev.ui,
        notifications: [
          {
            id: `track-${Date.now()}`,
            type: "mission",
            title: "TRACKING OBJECTIVE",
            subtitle: prev.missions.find((m) => m.id === missionId)?.title || "Mission",
            timestamp: Date.now(),
          },
          ...prev.ui.notifications.slice(0, 3),
        ],
      },
    }));
  }, []);

  const setInteractionPrompt = useCallback((prompt: string | null) => {
    setGameState((prev) => ({
      ...prev,
      ui: { ...prev.ui, interactionPrompt: prompt },
    }));
  }, []);

  const showLocationBanner = useCallback((name: string, region: string) => {
    setGameState((prev) => {
      // Don't duplicate if already in this location
      if (
        prev.ui.locationIndicator?.name === name &&
        prev.ui.locationIndicator?.region === region
      ) {
        return prev;
      }

      // Filter out existing repeated location-entered notifications so they don't stack
      const otherNotifications = prev.ui.notifications.filter(
        (n) => n.title !== "LOCATION ENTERED",
      );

      const locNotif: GameNotification = {
        id: `loc-${Date.now()}`,
        type: "location",
        title: "LOCATION ENTERED",
        subtitle: `${name} · ${region}`,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        ui: {
          ...prev.ui,
          locationIndicator: { name, region },
          notifications: [locNotif, ...otherNotifications.slice(0, 2)],
        },
      };
    });
  }, []);

  const pushNotification = useCallback((item: Omit<GameNotification, "id" | "timestamp">) => {
    const newNotif: GameNotification = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    setGameState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        notifications: [newNotif, ...prev.ui.notifications.slice(0, 3)],
      },
    }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setGameState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        notifications: prev.ui.notifications.filter((n) => n.id !== id),
      },
    }));
  }, []);

  const updateSettings = useCallback((updater: (prev: GameSettings) => GameSettings) => {
    setGameState((prev) => {
      const nextSettings = updater(prev.settings);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
        } catch {
          // Ignore quota/security errors in sandbox
        }
      }
      return {
        ...prev,
        settings: nextSettings,
      };
    });
  }, []);

  const setCurrentRegion = useCallback((region: string, zone?: string) => {
    setGameState((prev) => {
      if (prev.world.currentRegion === region && (!zone || prev.world.currentZone === zone)) {
        return prev;
      }
      return {
        ...prev,
        world: {
          ...prev.world,
          currentRegion: region,
          currentZone: zone ?? prev.world.currentZone,
        },
      };
    });
  }, []);

  const toggleDebugGrid = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      debug: { ...prev.debug, showGrid: !prev.debug.showGrid },
    }));
  }, []);

  const toggleDebugAxes = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      debug: { ...prev.debug, showAxes: !prev.debug.showAxes },
    }));
  }, []);

  const toggleDebugStats = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      debug: { ...prev.debug, showStats: !prev.debug.showStats },
    }));
  }, []);

  const toggleDebugMode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      debug: { ...prev.debug, enabled: !prev.debug.enabled },
    }));
  }, []);

  const toggleFreeCamera = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      debug: { ...prev.debug, freeCamera: !prev.debug.freeCamera },
    }));
  }, []);

  // Keyboard shortcut listener for in-game navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      if (e.key === "Escape") {
        e.preventDefault();
        setGameState((prev) => {
          if (prev.ui.activeMenu === "none") {
            return {
              ...prev,
              ui: { ...prev.ui, activeMenu: "pause", isPaused: true },
            };
          } else if (prev.ui.activeMenu === "pause") {
            return {
              ...prev,
              ui: { ...prev.ui, activeMenu: "none", isPaused: false },
            };
          } else {
            // Return to pause menu from sub-screens
            return {
              ...prev,
              ui: { ...prev.ui, activeMenu: "pause", isPaused: true },
            };
          }
        });
      } else if (key === "m") {
        e.preventDefault();
        toggleMenu("map");
      } else if (e.key === "Tab") {
        e.preventDefault();
        toggleMenu("inventory");
      } else if (key === "j") {
        e.preventDefault();
        toggleMenu("missions");
      } else if (key === "c") {
        e.preventDefault();
        toggleMenu("character");
      } else if (e.key === "`" || e.key === "F3") {
        e.preventDefault();
        toggleDebugMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDebugMode, toggleMenu]);

  const value = useMemo<GameContextValue>(
    () => ({
      state: gameState,
      openMenu,
      closeMenu,
      toggleMenu,
      trackMission,
      setInteractionPrompt,
      showLocationBanner,
      pushNotification,
      dismissNotification,
      updateSettings,
      setCurrentRegion,
      toggleDebugGrid,
      toggleDebugAxes,
      toggleDebugStats,
      toggleDebugMode,
      toggleFreeCamera,
    }),
    [
      gameState,
      openMenu,
      closeMenu,
      toggleMenu,
      trackMission,
      setInteractionPrompt,
      showLocationBanner,
      pushNotification,
      dismissNotification,
      updateSettings,
      setCurrentRegion,
      toggleDebugGrid,
      toggleDebugAxes,
      toggleDebugStats,
      toggleDebugMode,
      toggleFreeCamera,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
