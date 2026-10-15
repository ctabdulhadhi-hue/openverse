import { describe, expect, it, beforeEach } from "vitest";

import { dayNightStore } from "@/game/dayNight";

describe("Open-World Day/Night System", () => {
  beforeEach(() => {
    dayNightStore.setTime(8, 30);
  });

  it("initializes with morning time and sunny parameters", () => {
    const state = dayNightStore.getState();
    expect(state.period).toBe("MORNING");
    expect(state.hours).toBe(8);
    expect(state.minutes).toBe(30);
    expect(state.isNight).toBe(false);
    expect(state.sunIntensity).toBeGreaterThan(1.0);
  });

  it("calculates afternoon and sunset as time progresses", () => {
    dayNightStore.setTime(14, 0);
    let state = dayNightStore.getState();
    expect(state.period).toBe("DAY");
    expect(state.isNight).toBe(false);

    dayNightStore.setTime(19, 0);
    state = dayNightStore.getState();
    expect(state.period).toBe("EVENING");
    expect(state.isNight).toBe(false);
  });

  it("transitions to night with moonlit lighting and celestial orientation", () => {
    dayNightStore.setTime(23, 30);
    const state = dayNightStore.getState();
    expect(state.period).toBe("NIGHT");
    expect(state.isNight).toBe(true);
    expect(state.starOpacity).toBeGreaterThan(0.5);
    expect(state.fogNear).toBeLessThan(100);
  });

  it("progresses continuously on update tick", () => {
    dayNightStore.setTime(10, 0);
    const initialTime = dayNightStore.getState().timeNormalized;
    // Step forward 60 seconds (1 minute in 1200s cycle is 1/20 of full day)
    dayNightStore.update(60);
    const newTime = dayNightStore.getState().timeNormalized;
    expect(newTime).toBeGreaterThan(initialTime);
  });
});
