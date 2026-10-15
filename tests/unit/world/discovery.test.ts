import { describe, expect, it, beforeEach } from "vitest";

import { VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { discoveryManager, discoveryStore } from "@/game/discovery";

describe("Open-World Environmental Discovery System", () => {
  beforeEach(() => {
    discoveryStore.reset();
  });

  it("initializes with known default discovered locations", () => {
    const telemetry = discoveryStore.getTelemetry();
    expect(telemetry.totalDiscovered).toBeGreaterThan(0);
    expect(telemetry.totalLocations).toBe(VARANAYA_LOCATIONS.length);
    expect(discoveryStore.isDiscovered("royal-promenade")).toBe(true);
  });

  it("detects undiscovered locations when player moves within proximity", () => {
    // Find an initially undiscovered location (e.g. outer-island-sanctuary or lagoon-viewpoint)
    const targetLoc = VARANAYA_LOCATIONS.find((l) => l.id === "lagoon-viewpoint");
    expect(targetLoc).toBeDefined();

    if (targetLoc) {
      // Temporarily mark undiscovered for test isolation
      targetLoc.discovered = false;
      discoveryStore.reset();

      const discovered = discoveryManager.checkProximity([
        targetLoc.position[0],
        targetLoc.position[1],
        targetLoc.position[2],
      ]);

      expect(discovered.length).toBeGreaterThan(0);
      expect(discovered.some((d) => d.id === "lagoon-viewpoint")).toBe(true);
      expect(discoveryStore.isDiscovered("lagoon-viewpoint")).toBe(true);
      expect(targetLoc.discovered).toBe(true);
    }
  });

  it("does not re-discover already discovered locations", () => {
    const targetLoc = VARANAYA_LOCATIONS.find((l) => l.id === "royal-promenade");
    expect(targetLoc).toBeDefined();

    if (targetLoc) {
      const discovered = discoveryManager.checkProximity(targetLoc.position);
      expect(discovered.some((d) => d.id === "royal-promenade")).toBe(false);
    }
  });
});
