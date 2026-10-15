import { describe, expect, it, beforeEach } from "vitest";

import { weatherStore } from "@/game/weather";

describe("Open-World Weather System", () => {
  beforeEach(() => {
    weatherStore.setCondition("CLEAR");
  });

  it("initializes with default CLEAR parameters", () => {
    const state = weatherStore.getState();
    expect(state.condition).toBe("CLEAR");
    expect(state.fogMultiplier).toBe(1.0);
    expect(state.cloudDensity).toBeLessThan(0.5);
  });

  it("updates atmospheric fog and cloud density when condition changes", () => {
    weatherStore.setCondition("MIST");
    let state = weatherStore.getState();
    expect(state.condition).toBe("MIST");
    expect(state.fogMultiplier).toBeGreaterThan(1.0);
    expect(state.cloudDensity).toBeGreaterThan(0.7);

    weatherStore.setCondition("CLOUDY");
    state = weatherStore.getState();
    expect(state.condition).toBe("CLOUDY");
    expect(state.windSpeed).toBeGreaterThan(1.5);
  });

  it("subscribes to weather state changes", () => {
    let observedCondition = "";
    const unsub = weatherStore.subscribe((s) => {
      observedCondition = s.condition;
    });

    weatherStore.setCondition("GOLDEN_HOUR");
    expect(observedCondition).toBe("GOLDEN_HOUR");
    unsub();
  });
});
