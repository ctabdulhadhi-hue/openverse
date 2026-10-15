import type { WeatherCondition } from "@/game/weather/weatherTypes";

export type WorldEventType =
  | "HARBOR_RUSH"
  | "TEMPLE_BELL_HOUR"
  | "COASTAL_MIST_CALL"
  | "MARITIME_DHOW_PASS";

export interface WorldEventDefinition {
  type: WorldEventType;
  title: string;
  description: string;
  location: string;
  startHour?: number;
  endHour?: number;
  requiredWeather?: WeatherCondition;
  soundCue?: "SACRED_BELL" | "SEAFARER_CONCH" | "DISCOVERY_CHIME" | "WATER_SPLASH";
}

export interface ActiveWorldEvent {
  type: WorldEventType;
  title: string;
  description: string;
  location: string;
  startedAt: number;
}
