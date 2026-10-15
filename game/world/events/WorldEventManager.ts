import { ambientAudioSystem } from "@/game/audio";
import { dayNightStore } from "@/game/dayNight";
import { weatherSystem } from "@/game/weather";
import type { WeatherCondition } from "@/game/weather/weatherTypes";

import type { ActiveWorldEvent, WorldEventDefinition, WorldEventType } from "./worldEventTypes";

export const WORLD_EVENT_DEFINITIONS: Record<WorldEventType, WorldEventDefinition> = {
  HARBOR_RUSH: {
    type: "HARBOR_RUSH",
    title: "Morning Trade Fleet Arrival",
    description: "Sailing dhows and outrigger catamarans moor along the quays with fresh cargo.",
    location: "Royal Waterfront & Quays",
    startHour: 7,
    endHour: 10,
    soundCue: "SEAFARER_CONCH",
  },
  TEMPLE_BELL_HOUR: {
    type: "TEMPLE_BELL_HOUR",
    title: "Golden Hour Temple Chimes",
    description: "Ceremonial bronze bells resonate across the valley from the Grand Sanctuary.",
    location: "Grand Sanctuary & Royal Promenade",
    startHour: 17,
    endHour: 19,
    soundCue: "SACRED_BELL",
  },
  COASTAL_MIST_CALL: {
    type: "COASTAL_MIST_CALL",
    title: "Coastal Mist & Fog Beacons",
    description: "Sea mist enshrouds Azure Bay; harbor beacons and oil lanterns flare bright.",
    location: "Azure Bay & Grand Causeway",
    requiredWeather: "MIST",
    soundCue: "DISCOVERY_CHIME",
  },
  MARITIME_DHOW_PASS: {
    type: "MARITIME_DHOW_PASS",
    title: "Midday Lagoon Flotilla",
    description: "A cruising dhow navigates the coastal waters between the city and outer island.",
    location: "Azure Bay Lagoon",
    startHour: 12,
    endHour: 14,
    soundCue: "WATER_SPLASH",
  },
};

type EventObserver = (activeEvents: ActiveWorldEvent[]) => void;

export class WorldEventManager {
  private activeEvents = new Map<WorldEventType, ActiveWorldEvent>();
  private observers = new Set<EventObserver>();
  private playedCues = new Set<WorldEventType>();

  /**
   * Evaluate conditions based on simulated world hour and active weather.
   */
  public evaluate(currentHour: number, weather: WeatherCondition): ActiveWorldEvent[] {
    const hour = ((currentHour % 24) + 24) % 24;
    const now = Date.now();
    let stateChanged = false;

    for (const def of Object.values(WORLD_EVENT_DEFINITIONS)) {
      let isMet = true;

      // 1. Check time window if defined
      if (def.startHour !== undefined && def.endHour !== undefined) {
        const inWindow =
          def.startHour <= def.endHour
            ? hour >= def.startHour && hour < def.endHour
            : hour >= def.startHour || hour < def.endHour;
        if (!inWindow) {
          isMet = false;
        }
      }

      // 2. Check weather requirement if defined
      if (def.requiredWeather && def.requiredWeather !== weather) {
        isMet = false;
      }

      const isCurrentlyActive = this.activeEvents.has(def.type);

      if (isMet && !isCurrentlyActive) {
        // Activate event
        const active: ActiveWorldEvent = {
          type: def.type,
          title: def.title,
          description: def.description,
          location: def.location,
          startedAt: now,
        };
        this.activeEvents.set(def.type, active);
        stateChanged = true;

        // Play sound cue once upon start
        if (!this.playedCues.has(def.type) && def.soundCue) {
          this.playedCues.add(def.type);
          this.triggerSoundCue(def.soundCue);
        }
      } else if (!isMet && isCurrentlyActive) {
        // Deactivate event
        this.activeEvents.delete(def.type);
        this.playedCues.delete(def.type);
        stateChanged = true;
      }
    }

    if (stateChanged) {
      this.notify();
    }

    return Array.from(this.activeEvents.values());
  }

  public isEventActive(type: WorldEventType): boolean {
    return this.activeEvents.has(type);
  }

  public getActiveEvents(): ActiveWorldEvent[] {
    return Array.from(this.activeEvents.values());
  }

  public subscribe(observer: EventObserver): () => void {
    this.observers.add(observer);
    observer(this.getActiveEvents());
    return () => {
      this.observers.delete(observer);
    };
  }

  private notify(): void {
    const list = this.getActiveEvents();
    for (const obs of this.observers) {
      obs(list);
    }
  }

  private triggerSoundCue(cue: "SACRED_BELL" | "SEAFARER_CONCH" | "DISCOVERY_CHIME" | "WATER_SPLASH"): void {
    try {
      switch (cue) {
        case "SACRED_BELL":
          ambientAudioSystem.playSacredBell();
          break;
        case "SEAFARER_CONCH":
          ambientAudioSystem.playSeafarerConch();
          break;
        case "DISCOVERY_CHIME":
          ambientAudioSystem.playDiscoveryChime();
          break;
        case "WATER_SPLASH":
          ambientAudioSystem.playWaterSplash();
          break;
      }
    } catch {
      // Audio fallback
    }
  }

  public update(): void {
    const hours = dayNightStore.getState().hours;
    const weather = weatherSystem.getState().condition;
    this.evaluate(hours, weather);
  }

  public reset(): void {
    this.activeEvents.clear();
    this.playedCues.clear();
    this.notify();
  }
}

export const worldEventManager = new WorldEventManager();
