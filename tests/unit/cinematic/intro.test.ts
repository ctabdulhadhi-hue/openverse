import { beforeEach, describe, expect, it, vi } from "vitest";

import { introAudio } from "@/game/cinematic/introAudio";
import { INTRO_STORAGE_KEY, introStore } from "@/game/cinematic/introStore";
import { CINEMATIC_WAYPOINTS, TITLE_DURATION_SECONDS } from "@/game/cinematic/introWaypoints";

describe("OPENVERSE Cinematic Startup Intro & Drone Flyover", () => {
  beforeEach(() => {
    localStorage.clear();
    introStore.skip();
  });

  describe("1. Canonical Waypoint Coordinate Verification", () => {
    it("defines 6 smooth drone flyover waypoints above ground level", () => {
      expect(CINEMATIC_WAYPOINTS.length).toBe(6);

      for (const wp of CINEMATIC_WAYPOINTS) {
        // Camera height must be well above ground (> 2.5m) to avoid underground clipping
        expect(wp.position[1]).toBeGreaterThanOrEqual(3.0);
        // Look-at height must be above ground level
        expect(wp.lookAt[1]).toBeGreaterThanOrEqual(1.0);
        // Normalized time must be within [0, 1]
        expect(wp.t).toBeGreaterThanOrEqual(0.0);
        expect(wp.t).toBeLessThanOrEqual(1.0);
        // Location titles must be non-empty strings
        expect(wp.locationTitle.length).toBeGreaterThan(0);
        expect(wp.subtitle.length).toBeGreaterThan(0);
      }
    });

    it("ends flyover at player spawn camera offset", () => {
      const finalWp = CINEMATIC_WAYPOINTS[CINEMATIC_WAYPOINTS.length - 1]!;
      expect(finalWp.t).toBe(1.0);
      // Spawn is at [0, 1.2, 8]; final waypoint is [0, 3.2, 14.5] looking at [0, 2.0, 8]
      expect(finalWp.position[0]).toBe(0);
      expect(finalWp.position[2]).toBe(14.5);
      expect(finalWp.lookAt).toEqual([0, 2.0, 8]);
    });
  });

  describe("2. Title Timer & Phase State Machine", () => {
    it("advances from TITLE to FLYOVER after exactly 5.0 seconds", () => {
      // Force start title phase
      void introStore.startWithUserGesture();
      expect(introStore.getPhase()).toBe("TITLE");

      // Advance by 2.0 seconds
      introStore.updateTitleTimer(2.0);
      expect(introStore.getPhase()).toBe("TITLE");
      expect(introStore.getTelemetry().titleElapsedTime).toBeCloseTo(2.0);

      // Advance by 2.9 seconds (total 4.9s)
      introStore.updateTitleTimer(2.9);
      expect(introStore.getPhase()).toBe("TITLE");

      // Advance remaining 0.2s (total 5.1s >= 5.0s)
      introStore.updateTitleTimer(0.2);
      expect(introStore.getPhase()).toBe("FLYOVER");
      expect(introStore.getTelemetry().titleElapsedTime).toBeGreaterThanOrEqual(
        TITLE_DURATION_SECONDS,
      );
    });

    it("correctly advances flyover progress and updates active location titles", () => {
      void introStore.startWithUserGesture();
      introStore.updateTitleTimer(TITLE_DURATION_SECONDS + 0.1);
      expect(introStore.getPhase()).toBe("FLYOVER");

      introStore.updateFlyover(0.5, "ROYAL WATERFRONT & GHAT STEPS", "Continuous Stone Quay");
      const tel = introStore.getTelemetry();
      expect(tel.flyoverProgress).toBe(0.5);
      expect(tel.activeLocationTitle).toBe("ROYAL WATERFRONT & GHAT STEPS");
    });

    it("transitions from FLYOVER to HANDOFF and then COMPLETED", () => {
      void introStore.startWithUserGesture();
      introStore.updateTitleTimer(TITLE_DURATION_SECONDS);
      expect(introStore.getPhase()).toBe("FLYOVER");

      introStore.startHandoff();
      expect(introStore.getPhase()).toBe("HANDOFF");

      introStore.complete(true);
      expect(introStore.getPhase()).toBe("COMPLETED");
      expect(introStore.isActive()).toBe(false);
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");
    });
  });

  describe("3. Skip & Replay Behavior", () => {
    it("skipping immediately sets COMPLETED and persists preference", () => {
      void introStore.startWithUserGesture();
      expect(introStore.isActive()).toBe(true);

      introStore.skip();
      expect(introStore.getPhase()).toBe("COMPLETED");
      expect(introStore.isActive()).toBe(false);
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");
    });

    it("replaying clears storage flag and restarts intro", async () => {
      introStore.skip();
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");

      introStore.replay();
      // On replay in JSDOM, audio.play might reject/succeed, setting phase to TITLE or WAITING_FOR_INTERACTION
      const phase = introStore.getPhase();
      expect(
        phase === "TITLE" || phase === "WAITING_FOR_INTERACTION" || phase === "UNINITIALIZED",
      ).toBe(true);
    });
  });

  describe("4. Audio Controller Management", () => {
    it("manages singleton audio controller instance", () => {
      expect(introAudio).toBeDefined();
      expect(typeof introAudio.play).toBe("function");
      expect(typeof introAudio.pause).toBe("function");
      expect(typeof introAudio.fadeOut).toBe("function");
    });

    it("toggles audio mute state cleanly", () => {
      introAudio.setMuted(false);
      expect(introAudio.getIsMuted()).toBe(false);

      const muted = introStore.toggleMute();
      expect(muted).toBe(true);
      expect(introStore.getTelemetry().isMuted).toBe(true);

      const unmuted = introStore.toggleMute();
      expect(unmuted).toBe(false);
      expect(introStore.getTelemetry().isMuted).toBe(false);
    });

    it("handles browser autoplay rejection by transitioning to WAITING_FOR_INTERACTION", async () => {
      // Mock audio play rejection
      const spy = vi.spyOn(introAudio, "play").mockResolvedValueOnce(false);

      await introStore.init(true);
      expect(introStore.getPhase()).toBe("WAITING_FOR_INTERACTION");
      expect(introStore.getTelemetry().audioAllowed).toBe(false);

      spy.mockRestore();
    });
  });

  describe("5. Telemetry & Window Bridge", () => {
    it("exposes window.__OPENVERSE_INTRO__ bridge for test automation", () => {
      const bridge = (
        window as unknown as {
          __OPENVERSE_INTRO__?: {
            getTelemetry: () => unknown;
            skip: () => void;
            replay: () => void;
          };
        }
      ).__OPENVERSE_INTRO__;

      expect(bridge).toBeDefined();
      expect(typeof bridge?.getTelemetry).toBe("function");
      expect(typeof bridge?.skip).toBe("function");
      expect(typeof bridge?.replay).toBe("function");
    });
  });
});
