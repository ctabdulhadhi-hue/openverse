export type WeatherCondition = "CLEAR" | "CLOUDY" | "MIST" | "GOLDEN_HOUR";

export interface WeatherState {
  condition: WeatherCondition;
  cloudDensity: number;
  fogMultiplier: number;
  windSpeed: number;
  temperatureCelsius: number;
}
