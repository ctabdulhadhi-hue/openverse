import { describe, expect, it } from "vitest";

import { ambientAudioSystem } from "@/game/audio";

describe("Open-World Ambient Audio System", () => {
  it("initializes safely without crashing in jsdom/headless environment", () => {
    expect(() => {
      ambientAudioSystem.init();
      ambientAudioSystem.setVolume(0.5);
      ambientAudioSystem.setMuted(true);
      ambientAudioSystem.setMuted(false);
      ambientAudioSystem.updatePlayerPosition(10, 1.2, 5);
      ambientAudioSystem.playDiscoveryChime();
    }).not.toThrow();
  });
});
