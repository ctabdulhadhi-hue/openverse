export interface WorldStatusState {
  timeFormatted: string;
  period: "MORNING" | "DAY" | "EVENING" | "NIGHT";
  weatherCondition: "CLEAR" | "CLOUDY" | "RAIN" | "FOG" | "STORM";
  dayNumber: number;
  currentRegion: string;
  currentZone: string;
  temperatureCelsius: number;
}

export const DEFAULT_WORLD_STATUS: WorldStatusState = {
  timeFormatted: "08:42 AM",
  period: "MORNING",
  weatherCondition: "CLEAR",
  dayNumber: 1,
  currentRegion: "Westport Town",
  currentZone: "Town Square",
  temperatureCelsius: 22,
};
