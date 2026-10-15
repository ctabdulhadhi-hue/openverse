import { beforeEach, describe, expect, it, vi } from "vitest";

import { introAudio } from "@/game/cinematic/introAudio";
import { INTRO_STORAGE_KEY, introStore } from "@/game/cinematic/introStore";
import { CINEMATIC_WAYPOINTS, CLOUD_REVEAL_T } from "@/game/cinematic/introWaypoints";

describe("OPENVERSE Animated Loading Screen & Cinematic Drone Intro", () => {
  beforeEach(() => {
    introStore.skip();
    introAudio.reset();
    localStorage.clear();
  });

  describe("1. Canonical Waypoint Coordinate Verification", () => {
    it("defines smooth drone flyover waypoints starting high above clouds and descending to ground level", () => {
      expect(CINEMATIC_WAYPOINTS.length).toBe(9);

      // First waypoint must start high above the cloud layer (> 180m)
      expect(CINEMATIC_WAYPOINTS[0]!.position[1]).toBeGreaterThanOrEqual(180);

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

  describe("2. Animated Loading Screen & Real Event Progress", () => {
    it("initializes in LOADING phase on startup", async () => {
      await introStore.init();
      expect(introStore.getPhase()).toBe("LOADING");
      expect(introStore.isActive()).toBe(true);
      expect(introStore.getTelemetry().loadingStatus).toBe("Loading Openverse…");
    });

    it("updates progress from real loading events and does not complete early", () => {
      void introStore.init();
      expect(introStore.getPhase()).toBe("LOADING");

      // Report partial asset progress
      introStore.updateLoadingProgress(5, 10, "Loading Openverse…");
      expect(introStore.getTelemetry().loadingProgress).toBe(50);
      expect(introStore.getPhase()).toBe("LOADING"); // Must still be loading!

      introStore.setLoadingProgress(85);
      expect(introStore.getTelemetry().loadingProgress).toBe(85);
      expect(introStore.getPhase()).toBe("LOADING");
    });

    it("handles asset-loading errors with clear recovery / retry path", () => {
      void introStore.init();
      introStore.setLoadingError("Network timeout loading texture");
      expect(introStore.getTelemetry().loadingError).toContain("Network timeout");

      // Retry clears the error
      introStore.retryLoading();
      expect(introStore.getTelemetry().loadingError).toBeNull();
    });
  });

  describe("3. 3D World Readiness & Seamless Fade into Drone Flyover", () => {
    it("transitions from LOADING to FLYOVER once the world is fully ready", () => {
      void introStore.init();
      expect(introStore.getPhase()).toBe("LOADING");

      // Canvas and scene report ready
      introStore.setCanvasReady();
      introStore.setSceneReady();
      // Triggers world ready
      expect(introStore.getPhase()).toBe("FLYOVER");
      expect(introStore.getTelemetry().flyoverProgress).toBe(0);
      expect(introStore.getTelemetry().isWorldReady).toBe(true);
    });

    it("correctly advances flyover progress and updates active location titles", () => {
      void introStore.init();
      introStore.onWorldReady();
      expect(introStore.getPhase()).toBe("FLYOVER");

      introStore.updateFlyover(0.5, "ROYAL WATERFRONT & GHAT STEPS", "Continuous Stone Quay");
      const tel = introStore.getTelemetry();
      expect(tel.flyoverProgress).toBe(0.5);
      expect(tel.activeLocationTitle).toBe("ROYAL WATERFRONT & GHAT STEPS");
    });

    it("transitions from FLYOVER to HANDOFF and then COMPLETED", () => {
      void introStore.init();
      introStore.onWorldReady();
      expect(introStore.getPhase()).toBe("FLYOVER");

      introStore.startHandoff();
      expect(introStore.getPhase()).toBe("HANDOFF");

      introStore.complete(true);
      expect(introStore.getPhase()).toBe("COMPLETED");
      expect(introStore.isActive()).toBe(false);
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");
    });
  });

  describe("4. Skip & Replay Behavior", () => {
    it("skipping immediately sets COMPLETED and persists preference", () => {
      void introStore.init();
      expect(introStore.isActive()).toBe(true);

      introStore.skip();
      expect(introStore.getPhase()).toBe("COMPLETED");
      expect(introStore.isActive()).toBe(false);
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");
    });

    it("replaying restarts the intro sequence", async () => {
      introStore.skip();
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe("true");

      introStore.replay();
      expect(introStore.getPhase()).toBe("LOADING");
    });
  });

  describe("5. Audio Autoplay Resilience & Controller Management", () => {
    it("manages singleton audio controller instance", () => {
      expect(introAudio).toBeDefined();
      expect(typeof introAudio.play).toBe("function");
      expect(typeof introAudio.pause).toBe("function");
      expect(typeof introAudio.fadeOut).toBe("function");
      expect(typeof introAudio.fadeIn).toBe("function");
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

    it("keeps cinematic flyover running if audio autoplay is blocked, providing enable option", async () => {
      // Mock audio play rejection
      const spy = vi.spyOn(introAudio, "fadeIn").mockResolvedValueOnce(false);

      void introStore.init();
      introStore.onWorldReady();

      // Crucial requirement: flyover continues running!
      expect(introStore.getPhase()).toBe("FLYOVER");

      spy.mockRestore();
    });
  });

  describe("6. Telemetry & Window Bridge", () => {
    it("exposes window.__OPENVERSE_INTRO__ bridge for test automation", () => {
      const bridge = (
        window as unknown as {
          __OPENVERSE_INTRO__?: {
            getTelemetry: () => unknown;
            skip: () => void;
            replay: () => void;
            onWorldReady: () => void;
            onCloudReveal: () => void;
            enableSound: () => Promise<boolean>;
          };
        }
      ).__OPENVERSE_INTRO__;

      expect(bridge).toBeDefined();
      expect(typeof bridge?.getTelemetry).toBe("function");
      expect(typeof bridge?.skip).toBe("function");
      expect(typeof bridge?.replay).toBe("function");
      expect(typeof bridge?.onWorldReady).toBe("function");
      expect(typeof bridge?.onCloudReveal).toBe("function");
      expect(typeof bridge?.enableSound).toBe("function");
    });
  });

  describe("7. Cloud-Reveal Audio Synchronization", () => {
    it("does NOT start audio when world becomes ready (above-cloud silence)", () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn");
      const playSpy = vi.spyOn(introAudio, "play");

      void introStore.init();
      introStore.onWorldReady();

      expect(introStore.getPhase()).toBe("FLYOVER");

      // Audio must NOT have been called at world ready
      expect(fadeInSpy).not.toHaveBeenCalled();
      expect(playSpy).not.toHaveBeenCalled();

      // Telemetry confirms no cloud reveal yet
      expect(introStore.getTelemetry().cloudRevealed).toBe(false);

      fadeInSpy.mockRestore();
      playSpy.mockRestore();
    });

    it("does NOT start audio during above-cloud flyover progress", () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn");

      void introStore.init();
      introStore.onWorldReady();

      // Simulate flyover progress before cloud reveal (t < CLOUD_REVEAL_T)
      introStore.updateFlyover(0.1, "HIGH ABOVE THE CLOUDS", "Cruising the Azure Cloud Sea");
      introStore.updateFlyover(0.2, "DESCENDING THE CLOUD DECK", "Approaching");
      introStore.updateFlyover(0.35, "PASSING THROUGH THE CLOUDS", "Enveloped in Mist");

      // Audio should still not have been triggered
      expect(fadeInSpy).not.toHaveBeenCalled();
      expect(introStore.getTelemetry().cloudRevealed).toBe(false);

      fadeInSpy.mockRestore();
    });

    it("triggers audio fade-in precisely at the cloud-reveal moment (t >= CLOUD_REVEAL_T)", () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn").mockResolvedValue(true);

      void introStore.init();
      introStore.onWorldReady();

      // Trigger cloud reveal
      introStore.onCloudReveal();

      expect(fadeInSpy).toHaveBeenCalledWith(1500);
      expect(introStore.getTelemetry().cloudRevealed).toBe(true);

      fadeInSpy.mockRestore();
    });

    it("CLOUD_REVEAL_T matches the KINGDOM OF VARANAYA waypoint", () => {
      const varanayaWp = CINEMATIC_WAYPOINTS.find(
        (wp) => wp.locationTitle === "KINGDOM OF VARANAYA",
      );

      expect(varanayaWp).toBeDefined();
      expect(CLOUD_REVEAL_T).toBe(varanayaWp!.t);
    });

    it("prevents duplicate audio playback on repeated cloud-reveal calls", () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn").mockResolvedValue(true);

      void introStore.init();
      introStore.onWorldReady();

      introStore.onCloudReveal();
      introStore.onCloudReveal();
      introStore.onCloudReveal();

      // fadeIn should only have been called once
      expect(fadeInSpy).toHaveBeenCalledTimes(1);

      fadeInSpy.mockRestore();
    });

    it("does not trigger cloud reveal when phase is not FLYOVER", () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn");

      void introStore.init();
      // Still in LOADING, not FLYOVER
      expect(introStore.getPhase()).toBe("LOADING");

      introStore.onCloudReveal();

      expect(fadeInSpy).not.toHaveBeenCalled();
      expect(introStore.getTelemetry().cloudRevealed).toBe(false);

      fadeInSpy.mockRestore();
    });

    it("resets cloud-reveal state on replay so audio can trigger again", () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn").mockResolvedValue(true);

      void introStore.init();
      introStore.onWorldReady();
      introStore.onCloudReveal();
      expect(introStore.getTelemetry().cloudRevealed).toBe(true);
      expect(fadeInSpy).toHaveBeenCalledTimes(1);

      // Replay resets everything
      introStore.replay();
      expect(introStore.getTelemetry().cloudRevealed).toBe(false);
      expect(introAudio.getHasPlayedThisSession()).toBe(false);

      // Should be able to trigger again after replay
      introStore.onWorldReady();
      introStore.onCloudReveal();
      expect(fadeInSpy).toHaveBeenCalledTimes(2);

      fadeInSpy.mockRestore();
    });

    it("does NOT start audio on user gesture interaction (startWithUserGesture)", async () => {
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn");
      const playSpy = vi.spyOn(introAudio, "play");

      void introStore.init();
      introStore.onWorldReady();

      await introStore.startWithUserGesture();

      // Audio should not have started on gesture
      expect(fadeInSpy).not.toHaveBeenCalled();
      expect(playSpy).not.toHaveBeenCalled();

      fadeInSpy.mockRestore();
      playSpy.mockRestore();
    });

    it("exposes getCloudRevealT() returning the canonical cloud-reveal time", () => {
      expect(introStore.getCloudRevealT()).toBe(CLOUD_REVEAL_T);
      expect(introStore.getCloudRevealT()).toBe(0.44);
    });

    it("handles skip during above-cloud phase without audio leaks", () => {
      const fadeOutSpy = vi.spyOn(introAudio, "fadeOut").mockResolvedValue();
      const fadeInSpy = vi.spyOn(introAudio, "fadeIn");

      void introStore.init();
      introStore.onWorldReady();

      // Skip before cloud reveal
      introStore.skip();

      expect(introStore.getPhase()).toBe("COMPLETED");
      // fadeIn should never have been called (skipped before cloud reveal)
      expect(fadeInSpy).not.toHaveBeenCalled();
      // fadeOut is called as part of complete(), which is fine
      expect(fadeOutSpy).toHaveBeenCalled();

      fadeOutSpy.mockRestore();
      fadeInSpy.mockRestore();
    });
  });
});
