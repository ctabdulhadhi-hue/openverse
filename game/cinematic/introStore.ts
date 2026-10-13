/**
 * State store for the OPENVERSE Cinematic Startup Intro & Drone Flyover.
 *
 * Implements observer pattern with reactive telemetry subscriptions.
 * Exposes a window bridge for Playwright E2E verification.
 */

import { introAudio } from "./introAudio";
import type { IntroPhase, IntroTelemetry } from "./introTypes";
import { TITLE_DURATION_SECONDS } from "./introWaypoints";

export const INTRO_STORAGE_KEY = "openverse_cinematic_intro_seen_v1";

export class IntroStore {
  private phase: IntroPhase = "UNINITIALIZED";
  private hasStarted = false;
  private titleElapsedTime = 0;
  private flyoverProgress = 0;
  private activeLocationTitle = "KINGDOM OF VARANAYA";
  private activeSubtitle = "Ancient Sandstone Kingdom on the Azure Coast";
  private isMuted = false;
  private audioAllowed = false;
  private listeners: Set<(telemetry: IntroTelemetry) => void> = new Set();

  constructor() {
    this.attachWindowBridge();
  }

  private notify(): void {
    const telemetry = this.getTelemetry();
    for (const listener of this.listeners) {
      try {
        listener(telemetry);
      } catch (err) {
        console.error("[IntroStore] Listener error:", err);
      }
    }
  }

  public subscribe(listener: (telemetry: IntroTelemetry) => void): () => void {
    this.listeners.add(listener);
    listener(this.getTelemetry());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getTelemetry(): IntroTelemetry {
    return {
      phase: this.phase,
      hasStarted: this.hasStarted,
      titleElapsedTime: this.titleElapsedTime,
      flyoverProgress: this.flyoverProgress,
      activeLocationTitle: this.activeLocationTitle,
      activeSubtitle: this.activeSubtitle,
      isMuted: this.isMuted,
      audioAllowed: this.audioAllowed,
      isAudioPlaying: introAudio.getIsPlaying(),
    };
  }

  public isActive(): boolean {
    return this.phase !== "COMPLETED" && this.phase !== "UNINITIALIZED";
  }

  public isFlyoverActive(): boolean {
    return this.phase === "FLYOVER" || this.phase === "HANDOFF";
  }

  public getPhase(): IntroPhase {
    return this.phase;
  }

  /**
   * Initializes the intro check on game page load.
   * If URL contains ?skipIntro=1 or was already seen and not explicitly replaying,
   * completes immediately.
   */
  public async init(forceReplay = false): Promise<void> {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const forceSkip = urlParams.get("skipIntro") === "1";
    const forceIntro = urlParams.get("intro") === "1";

    if (forceSkip) {
      this.complete(false);
      return;
    }

    const hasSeen = localStorage.getItem(INTRO_STORAGE_KEY) === "true";
    if (hasSeen && !forceReplay && !forceIntro) {
      this.complete(false);
      return;
    }

    // Reset state for intro playback
    this.phase = "UNINITIALIZED";
    this.hasStarted = false;
    this.titleElapsedTime = 0;
    this.flyoverProgress = 0;
    this.notify();

    // Attempt autoplay
    const canPlayAudio = await introAudio.play();
    if (canPlayAudio) {
      this.audioAllowed = true;
      this.hasStarted = true;
      this.phase = "TITLE";
    } else {
      // Browser blocked autoplay without user gesture
      this.audioAllowed = false;
      this.phase = "WAITING_FOR_INTERACTION";
    }
    this.notify();
  }

  /**
   * User clicked "ENTER OPENVERSE" or tapped to start.
   */
  public async startWithUserGesture(): Promise<void> {
    if (typeof window === "undefined") return;

    this.hasStarted = true;
    this.titleElapsedTime = 0;
    this.phase = "TITLE";
    this.notify();

    const played = await introAudio.play();
    this.audioAllowed = played;
    this.notify();
  }

  /**
   * Updates title screen timer during TITLE phase.
   */
  public updateTitleTimer(dt: number): void {
    if (this.phase !== "TITLE") return;

    this.titleElapsedTime += dt;
    if (this.titleElapsedTime >= TITLE_DURATION_SECONDS) {
      this.phase = "FLYOVER";
      this.flyoverProgress = 0;
    }
    this.notify();
  }

  /**
   * Updates progress along the drone flight path.
   */
  public updateFlyover(progress: number, title: string, subtitle: string): void {
    this.flyoverProgress = Math.min(1.0, Math.max(0.0, progress));
    this.activeLocationTitle = title;
    this.activeSubtitle = subtitle;
    this.notify();
  }

  /**
   * Starts blending camera to player third-person view and begins audio fade-out.
   */
  public startHandoff(): void {
    if (this.phase === "HANDOFF" || this.phase === "COMPLETED") return;
    this.phase = "HANDOFF";
    this.notify();
    void introAudio.fadeOut(2500);
  }

  /**
   * Completes the intro and hands full control to player.
   */
  public complete(persist = true): void {
    this.phase = "COMPLETED";
    this.notify();
    void introAudio.fadeOut(800);
    if (persist && typeof window !== "undefined") {
      try {
        localStorage.setItem(INTRO_STORAGE_KEY, "true");
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  /**
   * Skips the intro sequence immediately.
   */
  public skip(): void {
    this.complete(true);
  }

  /**
   * Replays the intro from beginning.
   */
  public replay(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(INTRO_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    void this.init(true);
  }

  /**
   * Mute / Unmute audio toggle.
   */
  public toggleMute(): boolean {
    const muted = introAudio.toggleMute();
    this.isMuted = muted;
    this.notify();
    return muted;
  }

  private attachWindowBridge(): void {
    if (typeof window !== "undefined") {
      (
        window as unknown as {
          __OPENVERSE_INTRO__?: {
            getTelemetry: () => IntroTelemetry;
            start: () => Promise<void>;
            skip: () => void;
            replay: () => void;
            toggleMute: () => boolean;
            isAudioPlaying: () => boolean;
          };
        }
      ).__OPENVERSE_INTRO__ = {
        getTelemetry: () => this.getTelemetry(),
        start: () => this.startWithUserGesture(),
        skip: () => this.skip(),
        replay: () => this.replay(),
        toggleMute: () => this.toggleMute(),
        isAudioPlaying: () => introAudio.getIsPlaying(),
      };
    }
  }
}

export const introStore = new IntroStore();
