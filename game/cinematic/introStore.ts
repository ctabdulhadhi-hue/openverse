/**
 * State store for the OPENVERSE Cinematic Startup Intro & Drone Flyover.
 *
 * Implements observer pattern with reactive telemetry subscriptions.
 * Coordinates pure black animated loading screen -> 1.5-2s fade into drone flyover -> gameplay handoff.
 * Exposes a window bridge for Playwright E2E verification.
 */

import * as THREE from "three";

import { introAudio } from "./introAudio";
import type { IntroPhase, IntroTelemetry } from "./introTypes";
import { VIDEO_INTRO_DURATION_SECONDS } from "./introWaypoints";

export const INTRO_STORAGE_KEY = "openverse_cinematic_intro_seen_v1";

export class IntroStore {
  private phase: IntroPhase = "UNINITIALIZED";
  private hasStarted = false;
  private loadingProgress = 0;
  private loadingStatus = "Loading Openverse…";
  private loadingError: string | null = null;
  private isWorldReady = false;
  private isCanvasReady = false;
  private isSceneReady = false;
  private assetsLoaded = false;
  private titleElapsedTime = 0;
  private introDuration = VIDEO_INTRO_DURATION_SECONDS;
  private flyoverProgress = 0;
  private activeLocationTitle = "KINGDOM OF VARANAYA";
  private activeSubtitle = "Ancient Sandstone Kingdom on the Azure Coast";
  private isMuted = false;
  private audioAllowed = false;
  private listeners: Set<(telemetry: IntroTelemetry) => void> = new Set();
  private loadingManagerAttached = false;

  constructor() {
    this.attachWindowBridge();
    this.attachLoadingManager();
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
      loadingProgress: this.loadingProgress,
      loadingStatus: this.loadingStatus,
      loadingError: this.loadingError,
      isWorldReady: this.isWorldReady,
      flyoverProgress: this.flyoverProgress,
      activeLocationTitle: this.activeLocationTitle,
      activeSubtitle: this.activeSubtitle,
      isMuted: this.isMuted,
      audioAllowed: this.audioAllowed,
      isAudioPlaying: introAudio.getIsPlaying(),
      titleElapsedTime: this.titleElapsedTime,
      videoDuration: this.introDuration,
    };
  }

  private attachLoadingManager(): void {
    if (typeof window === "undefined" || this.loadingManagerAttached) return;
    this.loadingManagerAttached = true;

    THREE.DefaultLoadingManager.onStart = (_url, itemsLoaded, itemsTotal) => {
      this.updateLoadingProgress(itemsLoaded, itemsTotal, "Loading Openverse…");
    };

    THREE.DefaultLoadingManager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      this.updateLoadingProgress(itemsLoaded, itemsTotal, "Loading Openverse…");
    };

    THREE.DefaultLoadingManager.onLoad = () => {
      this.assetsLoaded = true;
      this.setLoadingProgress(100, "Ready");
      this.checkReadiness();
    };

    THREE.DefaultLoadingManager.onError = (url) => {
      console.warn("[IntroStore] Asset loading error:", url);
      this.loadingError = `Failed to load asset: ${url}`;
      this.notify();
    };
  }

  public updateLoadingProgress(itemsLoaded: number, itemsTotal: number, status?: string): void {
    const pct = itemsTotal > 0 ? Math.min(99, Math.round((itemsLoaded / itemsTotal) * 100)) : 50;
    this.loadingProgress = Math.max(this.loadingProgress, pct);
    if (status) this.loadingStatus = status;
    this.notify();
  }

  public setLoadingProgress(percent: number, status?: string): void {
    this.loadingProgress = Math.min(100, Math.max(0, percent));
    if (status) this.loadingStatus = status;
    this.notify();
  }

  public setLoadingError(error: string | null): void {
    this.loadingError = error;
    this.notify();
  }

  public retryLoading(): void {
    this.loadingError = null;
    this.notify();
    this.checkReadiness();
  }

  public setCanvasReady(): void {
    this.isCanvasReady = true;
    this.loadingProgress = Math.max(this.loadingProgress, 40);
    this.notify();
    this.checkReadiness();
  }

  public setSceneReady(): void {
    this.isSceneReady = true;
    this.loadingProgress = Math.max(this.loadingProgress, 80);
    this.notify();
    this.checkReadiness();
  }

  public setAssetsLoaded(): void {
    this.assetsLoaded = true;
    this.loadingProgress = 100;
    this.notify();
    this.checkReadiness();
  }

  private checkReadiness(): void {
    if (this.isCanvasReady && this.isSceneReady && !this.isWorldReady) {
      this.onWorldReady();
    }
  }

  /**
   * Called when 3D world, environment, and required assets are fully initialized.
   * Starts the cinematic drone flyover and plays soundtrack thudakkam-audio.mp3.
   */
  public onWorldReady(): void {
    this.isWorldReady = true;
    this.loadingProgress = 100;
    this.loadingStatus = "Ready";

    if (this.phase === "LOADING" || this.phase === "UNINITIALIZED" || this.phase === "TITLE") {
      this.phase = "FLYOVER";
      this.flyoverProgress = 0;
      this.hasStarted = true;

      // Start soundtrack playback. If autoplay blocked, keep flyover running and allow manual unmute.
      void introAudio.play().then((allowed) => {
        this.audioAllowed = allowed;
        this.notify();
      });
    }

    this.notify();
  }

  public async enableSound(): Promise<boolean> {
    const played = await introAudio.play();
    this.audioAllowed = played;
    this.notify();
    return played;
  }

  public setIntroDuration(seconds: number): void {
    if (seconds > 0) {
      this.introDuration = seconds;
      this.notify();
    }
  }

  public getIntroDuration(): number {
    return this.introDuration;
  }

  public onVideoEnded(): void {
    this.onWorldReady();
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
    if (hasSeen && !forceReplay && !forceIntro && process.env.NODE_ENV === "test") {
      this.complete(false);
      return;
    }

    // Reset state for new startup sequence
    this.hasStarted = true;
    this.isWorldReady = false;
    this.isCanvasReady = false;
    this.isSceneReady = false;
    this.assetsLoaded = false;
    this.loadingProgress = 10;
    this.loadingStatus = "Loading Openverse…";
    this.loadingError = null;
    this.titleElapsedTime = 0;
    this.flyoverProgress = 0;
    this.phase = "LOADING";
    this.notify();
  }

  /**
   * User clicked button to start with gesture.
   */
  public async startWithUserGesture(): Promise<void> {
    if (typeof window === "undefined") return;

    this.hasStarted = true;
    this.titleElapsedTime = 0;
    if (this.isWorldReady) {
      this.phase = "FLYOVER";
    } else {
      this.phase = "LOADING";
    }
    this.notify();

    const played = await introAudio.play();
    this.audioAllowed = played;
    this.notify();
  }

  /**
   * Updates title screen timer during legacy TITLE phase.
   */
  public updateTitleTimer(dt: number): void {
    if (this.phase !== "TITLE") return;

    this.titleElapsedTime += dt;
    if (this.titleElapsedTime >= this.introDuration) {
      this.onVideoEnded();
    } else {
      this.notify();
    }
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
            onVideoEnded: () => void;
            onWorldReady: () => void;
            enableSound: () => Promise<boolean>;
            setLoadingProgress: (pct: number, status?: string) => void;
          };
        }
      ).__OPENVERSE_INTRO__ = {
        getTelemetry: () => this.getTelemetry(),
        start: () => this.startWithUserGesture(),
        skip: () => this.skip(),
        replay: () => this.replay(),
        toggleMute: () => this.toggleMute(),
        isAudioPlaying: () => introAudio.getIsPlaying(),
        onVideoEnded: () => this.onVideoEnded(),
        onWorldReady: () => this.onWorldReady(),
        enableSound: () => this.enableSound(),
        setLoadingProgress: (pct: number, status?: string) => this.setLoadingProgress(pct, status),
      };
    }
  }
}

export const introStore = new IntroStore();
