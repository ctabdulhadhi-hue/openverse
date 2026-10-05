import type { PlayerProfile } from "@/data/characters/characterData";
import type { ItemDefinition } from "@/data/items/itemsData";
import type { LocationDefinition } from "@/data/locations/locationsData";
import type { MissionDefinition } from "@/data/missions/missionsData";
import type { WorldStatusState } from "@/data/world/worldData";

export type GameMenu =
  | "none"
  | "pause"
  | "map"
  | "missions"
  | "inventory"
  | "character"
  | "settings"
  | "controls"
  | "about";

export interface GameNotification {
  id: string;
  type: "location" | "mission" | "item" | "discovery";
  title: string;
  subtitle: string;
  timestamp: number;
}

export interface GameGraphicsSettings {
  quality: "High" | "Medium" | "Low";
  shadows: "High" | "Medium" | "Low";
  effects: "High" | "Medium" | "Low";
  renderDistance: "Far" | "Medium" | "Near";
  fpsLimit: "60 FPS" | "120 FPS" | "Unlimited";
}

export interface GameAudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
}

export interface GameControlsSettings {
  mouseSensitivity: number;
  invertY: boolean;
}

export interface GameInterfaceSettings {
  showHud: boolean;
  showMinimap: boolean;
  showControlHints: boolean;
  showCompass: boolean;
}

export interface GameSettings {
  graphics: GameGraphicsSettings;
  audio: GameAudioSettings;
  controls: GameControlsSettings;
  interface: GameInterfaceSettings;
}

export interface DebugState {
  enabled: boolean;
  showGrid: boolean;
  showAxes: boolean;
  showStats: boolean;
  freeCamera: boolean;
}

export interface GameState {
  player: PlayerProfile;
  world: WorldStatusState;
  missions: MissionDefinition[];
  inventory: ItemDefinition[];
  locations: LocationDefinition[];
  settings: GameSettings;
  debug: DebugState;
  ui: {
    activeMenu: GameMenu;
    isPaused: boolean;
    interactionPrompt: string | null;
    locationIndicator: { name: string; region: string } | null;
    notifications: GameNotification[];
  };
}
