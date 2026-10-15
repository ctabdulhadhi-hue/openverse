import type { WeatherCondition, WeatherState } from "./weatherTypes";

type WeatherObserver = (state: WeatherState) => void;

export class WeatherSystem {
  private condition: WeatherCondition = "CLEAR";
  private observers = new Set<WeatherObserver>();
  private weatherTimer = 0;
  // Weather shifts roughly every 8 minutes
  private weatherShiftInterval = 480;

  private weatherPresets: Record<WeatherCondition, Omit<WeatherState, "condition">> = {
    CLEAR: {
      cloudDensity: 0.35,
      fogMultiplier: 1.0,
      windSpeed: 1.0,
      temperatureCelsius: 27,
    },
    CLOUDY: {
      cloudDensity: 0.75,
      fogMultiplier: 1.3,
      windSpeed: 1.8,
      temperatureCelsius: 24,
    },
    MIST: {
      cloudDensity: 0.85,
      fogMultiplier: 1.8,
      windSpeed: 0.6,
      temperatureCelsius: 22,
    },
    GOLDEN_HOUR: {
      cloudDensity: 0.45,
      fogMultiplier: 1.1,
      windSpeed: 1.2,
      temperatureCelsius: 25,
    },
  };

  public getState(): WeatherState {
    const preset = this.weatherPresets[this.condition];
    return {
      condition: this.condition,
      ...preset,
    };
  }

  public setCondition(cond: WeatherCondition): void {
    if (this.condition !== cond) {
      this.condition = cond;
      this.weatherTimer = 0;
      this.notify();
    }
  }

  public update(deltaSeconds: number): void {
    this.weatherTimer += deltaSeconds;
    if (this.weatherTimer >= this.weatherShiftInterval) {
      this.weatherTimer = 0;
      // Cycle through conditions naturally
      const sequence: WeatherCondition[] = ["CLEAR", "GOLDEN_HOUR", "CLOUDY", "MIST"];
      const nextIdx = (sequence.indexOf(this.condition) + 1) % sequence.length;
      const nextCond = sequence[nextIdx] ?? "CLEAR";
      this.setCondition(nextCond);
    }
  }

  public subscribe(observer: WeatherObserver): () => void {
    this.observers.add(observer);
    observer(this.getState());
    return () => {
      this.observers.delete(observer);
    };
  }

  private notify(): void {
    const state = this.getState();
    for (const observer of this.observers) {
      observer(state);
    }
  }
}

export const weatherStore = new WeatherSystem();
export const weatherSystem = weatherStore;
