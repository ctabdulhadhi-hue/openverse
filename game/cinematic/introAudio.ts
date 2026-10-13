/**
 * Audio Controller for the OPENVERSE Cinematic Startup Intro.
 *
 * Manages playback of the Malayalam movie soundtrack (/assets/intro/thudakkam-audio.mp3).
 * Ensures a single audio instance, handles browser autoplay rejection,
 * provides smooth fade-out curves, and exposes mute/unmute controls.
 */

export class IntroAudioController {
  private static instance: IntroAudioController | null = null;
  private audio: HTMLAudioElement | null = null;
  private isMuted = false;
  private isPlaying = false;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private readonly audioSrc = "/assets/intro/thudakkam-audio.mp3";

  private constructor() {
    this.initAudio();
  }

  public static getInstance(): IntroAudioController {
    if (!IntroAudioController.instance) {
      IntroAudioController.instance = new IntroAudioController();
    }
    return IntroAudioController.instance;
  }

  private initAudio(): void {
    if (typeof window === "undefined") return;

    if (!this.audio) {
      this.audio = new Audio(this.audioSrc);
      this.audio.preload = "auto";
      this.audio.volume = 0.85;

      this.audio.addEventListener("play", () => {
        this.isPlaying = true;
      });

      this.audio.addEventListener("pause", () => {
        this.isPlaying = false;
      });

      this.audio.addEventListener("ended", () => {
        this.isPlaying = false;
      });

      this.audio.addEventListener("error", (e) => {
        console.warn("[IntroAudio] Audio load warning:", e);
        this.isPlaying = false;
      });
    }
  }

  /**
   * Attempts audio playback.
   * Resolves true if playback starts, false if blocked by browser policy.
   */
  public async play(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    this.clearFade();

    if (!this.audio) {
      this.initAudio();
    }

    if (!this.audio) return false;

    this.audio.volume = this.isMuted ? 0 : 0.85;
    this.audio.currentTime = 0;

    try {
      await this.audio.play();
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn("[IntroAudio] Autoplay blocked by browser policy:", err);
      this.isPlaying = false;
      return false;
    }
  }

  /**
   * Pauses audio playback immediately.
   */
  public pause(): void {
    this.clearFade();
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.isPlaying = false;
  }

  /**
   * Smoothly fades out audio over durationMs and pauses it.
   */
  public fadeOut(durationMs = 2000): Promise<void> {
    return new Promise((resolve) => {
      this.clearFade();
      if (!this.audio || this.audio.paused || this.isMuted) {
        this.pause();
        resolve();
        return;
      }

      const initialVolume = this.audio.volume;
      const steps = 25;
      const stepDuration = durationMs / steps;
      let currentStep = 0;

      this.fadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        if (this.audio) {
          this.audio.volume = Math.max(0, initialVolume * (1 - progress));
        }

        if (currentStep >= steps) {
          this.clearFade();
          this.pause();
          if (this.audio) {
            this.audio.volume = 0.85;
          }
          resolve();
        }
      }, stepDuration);
    });
  }

  private clearFade(): void {
    if (this.fadeInterval !== null) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  /**
   * Toggles audio mute state.
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.muted = this.isMuted;
      if (!this.isMuted && this.audio.volume === 0) {
        this.audio.volume = 0.85;
      }
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.muted = muted;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public dispose(): void {
    this.clearFade();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.isPlaying = false;
  }
}

export const introAudio = IntroAudioController.getInstance();
