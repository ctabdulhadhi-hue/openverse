import type { DayNightState, DayPeriod } from "./dayNightTypes";

type DayNightObserver = (state: DayNightState) => void;

/**
 * 24-hour Day/Night cycle simulation for OPENVERSE.
 * Calculates dynamic sun vector, sky tones, atmospheric fog, and lighting intensities.
 */
export class DayNightSystem {
  // Real seconds for a full 24-hour cycle. 1200s = 20 minutes.
  private cycleDurationSeconds = 1200;
  // Start at morning 08:42 AM (8.7 / 24 = 0.3625)
  private timeNormalized = 0.3625;
  private dayNumber = 1;
  private isPaused = false;
  private observers = new Set<DayNightObserver>();
  private cachedState: DayNightState;

  constructor() {
    this.cachedState = this.computeState();
  }

  public setCycleDuration(seconds: number): void {
    this.cycleDurationSeconds = Math.max(10, seconds);
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public setTime(hours: number, minutes = 0): void {
    const clampedH = Math.max(0, Math.min(23, hours));
    const clampedM = Math.max(0, Math.min(59, minutes));
    this.timeNormalized = (clampedH + clampedM / 60) / 24;
    this.cachedState = this.computeState();
    this.notify();
  }

  public advanceHours(hours: number): void {
    const increment = hours / 24;
    const previousTime = this.timeNormalized;
    this.timeNormalized = (this.timeNormalized + increment) % 1.0;
    if (this.timeNormalized < previousTime) {
      this.dayNumber += 1;
    }
    this.cachedState = this.computeState();
    this.notify();
  }

  public update(deltaSeconds: number): void {
    if (this.isPaused || deltaSeconds <= 0) return;

    const previousTime = this.timeNormalized;
    const increment = deltaSeconds / this.cycleDurationSeconds;
    this.timeNormalized = (this.timeNormalized + increment) % 1.0;

    // Check if new day rolled over
    if (this.timeNormalized < previousTime) {
      this.dayNumber += 1;
    }

    this.cachedState = this.computeState();
    this.notify();
  }

  public getState(): DayNightState {
    return this.cachedState;
  }

  public subscribe(observer: DayNightObserver): () => void {
    this.observers.add(observer);
    observer(this.cachedState);
    return () => {
      this.observers.delete(observer);
    };
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer(this.cachedState);
    }
  }

  private computeState(): DayNightState {
    const totalMinutes = Math.round(this.timeNormalized * 24 * 60);
    const hours24 = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    // 12-hour formatted string
    const ampm = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const timeFormatted = `${hours12 < 10 ? `0${hours12}` : hours12}:${formattedMinutes} ${ampm}`;

    // Period categorization
    let period: DayPeriod = "DAY";
    if (hours24 >= 5 && hours24 < 11) {
      period = "MORNING";
    } else if (hours24 >= 11 && hours24 < 17) {
      period = "DAY";
    } else if (hours24 >= 17 && hours24 < 21) {
      period = "EVENING";
    } else {
      period = "NIGHT";
    }

    // Celestial sun angle calculations
    // 0.25 (6am) = Sun at horizon (0 rad)
    // 0.50 (12pm) = Sun at zenith (+PI/2 rad)
    // 0.75 (6pm) = Sun at sunset (PI rad)
    // 0.00 (12am) = Sun under the world (-PI/2 rad)
    const sunAngle = (this.timeNormalized - 0.25) * Math.PI * 2;
    const sunElevation = Math.sin(sunAngle); // >0 daytime, <0 nighttime
    const sunAzimuth = Math.cos(sunAngle);

    const orbitRadius = 160;
    const sunX = sunAzimuth * orbitRadius;
    const sunY = Math.max(-40, sunElevation * orbitRadius * 0.85);
    const sunZ = Math.sin(sunAngle * 0.5) * 60 + 40;

    const isNight = period === "NIGHT";
    const dayFactor = isNight ? 0 : Math.max(0, Math.min(1, (sunElevation + 0.1) / 0.6));

    // Dynamic color blends
    let sunColor = "#fff5e0";
    let sunIntensity = 2.35 * Math.max(0.15, dayFactor);
    let ambientColor = "#e0f2fe";
    let ambientIntensity = 0.38;
    let hemisphereSkyColor = "#bae6fd";
    let hemisphereGroundColor = "#c48446";
    let fogColor = "#bae6fd";
    let fogNear = 110;
    let fogFar = 540;
    let starOpacity = 0;

    if (period === "MORNING") {
      // Warm golden morning
      sunColor = "#fed7aa";
      sunIntensity = 1.6 + dayFactor * 0.7;
      ambientColor = "#fef08a";
      hemisphereSkyColor = "#bae6fd";
      hemisphereGroundColor = "#b45309";
      fogColor = "#cbd5e1";
      starOpacity = Math.max(0, (0.3 - this.timeNormalized) * 10);
    } else if (period === "DAY") {
      // Bright crisp afternoon
      sunColor = "#fffdf7";
      sunIntensity = 2.4;
      ambientColor = "#f0fdf4";
      hemisphereSkyColor = "#93c5fd";
      hemisphereGroundColor = "#d97706";
      fogColor = "#bae6fd";
      starOpacity = 0;
    } else if (period === "EVENING") {
      // Golden hour & amber dusk
      sunColor = "#fb923c";
      sunIntensity = Math.max(0.4, dayFactor * 2.0);
      ambientColor = "#fed7aa";
      hemisphereSkyColor = "#fdba74";
      hemisphereGroundColor = "#78350f";
      fogColor = "#fca5a5";
      starOpacity = Math.max(0, (this.timeNormalized - 0.72) * 8);
    } else {
      // Nocturnal moonlit serenity
      sunColor = "#38bdf8"; // Cool moonlight
      sunIntensity = 0.45;
      ambientColor = "#0f172a";
      ambientIntensity = 0.25;
      hemisphereSkyColor = "#0284c7";
      hemisphereGroundColor = "#0f172a";
      fogColor = "#091426";
      fogNear = 60;
      fogFar = 380;
      starOpacity = 0.95;
    }

    return {
      timeNormalized: this.timeNormalized,
      timeFormatted,
      hours: hours24,
      minutes,
      dayNumber: this.dayNumber,
      period,
      sunPosition: [sunX, Math.max(8, sunY), sunZ],
      sunColor,
      sunIntensity,
      ambientColor,
      ambientIntensity,
      hemisphereSkyColor,
      hemisphereGroundColor,
      fogColor,
      fogNear,
      fogFar,
      starOpacity,
      isNight,
    };
  }
}

export const dayNightStore = new DayNightSystem();
