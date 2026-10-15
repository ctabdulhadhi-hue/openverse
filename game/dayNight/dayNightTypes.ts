export type DayPeriod = "MORNING" | "DAY" | "EVENING" | "NIGHT";

export interface DayNightState {
  timeNormalized: number; // 0.0 to 1.0 (0.25 = 6:00 AM, 0.5 = 12:00 PM, 0.75 = 6:00 PM)
  timeFormatted: string; // "08:42 AM", "07:15 PM"
  hours: number;
  minutes: number;
  dayNumber: number;
  period: DayPeriod;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  hemisphereSkyColor: string;
  hemisphereGroundColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  starOpacity: number;
  isNight: boolean;
}
