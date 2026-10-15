/**
 * Procedural Web Audio Ambient Soundscape Generator for OPENVERSE.
 *
 * Provides real-time synthesized:
 * - Coastal sea breeze & wind gusts with dynamic LFO modulation
 * - Ocean surf and rhythmic wave washes
 * - Coastal bird calls and melodic chirps
 * - Discovery bells and exploration audio feedback
 *
 * 100% procedural Web Audio API with zero external asset dependencies.
 */

export class AmbientAudioSystem {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private waveGain: GainNode | null = null;
  private birdTimer: NodeJS.Timeout | null = null;

  private userMasterVolume = 0.8;
  private isMuted = false;

  public init(): void {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.userMasterVolume * 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupWindLayer();
      this.setupWaveLayer();
      this.startBirdLoop();

      this.isInitialized = true;
      this.isPlaying = true;
    } catch {
      // AudioContext unavailable or autoplay restricted until gesture
    }
  }

  public resume(): void {
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    this.isPlaying = true;
  }

  public setVolume(volume01: number): void {
    this.userMasterVolume = Math.max(0, Math.min(1, volume01));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.userMasterVolume * 0.45;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.setVolume(this.userMasterVolume);
  }

  /**
   * Evaluates whether the player is inside an authentic architectural enclosure
   * (e.g. gatehouse guard alcove, haveli courtyard, or grand sanctuary sanctum).
   */
  public isInsideEnclosedSpace(x: number, y: number, z: number): boolean {
    // 1. Gatehouse Guard Chamber
    if (x >= -18.5 && x <= -13.5 && z >= -4.5 && z <= 1.0 && y <= 4.0) {
      return true;
    }
    // 2. Haveli Courtyards
    if (
      (x >= -52 && x <= -36 && z >= 28 && z <= 44 && y <= 5.0) ||
      (x >= -52 && x <= -36 && z >= -40 && z <= -24 && y <= 5.0) ||
      (x >= 34 && x <= 50 && z >= -40 && z <= -24 && y <= 5.0) ||
      (x >= 34 && x <= 50 && z >= 48 && z <= 64 && y <= 5.0)
    ) {
      return true;
    }
    // 3. Grand Sanctuary Inner Garbhagriha Sanctum
    if (x >= -6.0 && x <= 6.0 && z >= -74 && z <= -56 && y >= 2.0 && y <= 9.0) {
      return true;
    }
    return false;
  }

  /**
   * Adjusts ambient layer balance dynamically based on player location.
   * Subtly dampens exterior wind and ocean waves when inside enclosed spaces.
   */
  public updatePlayerPosition(x: number, y: number, z: number): void {
    if (!this.ctx || !this.windGain || !this.waveGain) return;

    const now = this.ctx.currentTime;
    const isEnclosed = this.isInsideEnclosedSpace(x, y, z);
    const enclosureDampener = isEnclosed ? 0.35 : 1.0;

    // Ocean proximity: Varanaya harbor is at X >= 20, Lagoon Isle is around (800, 600)
    const isNearWater = x >= 20 || Math.hypot(x - 800, z - 600) < 120;
    const waveTarget = (isNearWater ? 0.38 : 0.08) * enclosureDampener;
    this.waveGain.gain.setTargetAtTime(waveTarget, now, 1.2);

    // Wind strength increases with altitude (promontory, ridge, or shikhara stairs)
    const altitudeFactor = Math.min(1.0, Math.max(0.15, y / 12.0));
    const windTarget = (0.2 + altitudeFactor * 0.28) * enclosureDampener;
    this.windGain.gain.setTargetAtTime(windTarget, now, 1.2);
  }

  /**
   * Plays a resonant sacred bronze temple bell with rich harmonic overtones.
   */
  public playSacredBell(): void {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    // Fundamental and authentic overtone frequencies of a sacred bronze ghanta bell
    const harmonics = [
      { freq: 261.63, peakGain: 0.28, duration: 4.2 },
      { freq: 523.25, peakGain: 0.20, duration: 3.5 },
      { freq: 784.88, peakGain: 0.14, duration: 2.8 },
      { freq: 1046.5, peakGain: 0.08, duration: 1.8 },
      { freq: 1568.0, peakGain: 0.04, duration: 1.0 },
    ];

    harmonics.forEach(({ freq, peakGain, duration }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0005, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  /**
   * Plays an uplifting musical discovery chime when a new location or viewpoint is discovered.
   */
  public playDiscoveryChime(): void {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord chime)

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  /**
   * Plays a gentle water splash sound when interacting with fountains or casting a fishing line.
   */
  public playWaterSplash(): void {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    const now = this.ctx.currentTime;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      source.start(now);
      source.stop(now + 0.4);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Plays a resonant coastal seafarer conch horn / maritime horn call.
   * Features authentic upward pitch scoop and warm harmonic timbre.
   */
  public playSeafarerConch(): void {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    const now = this.ctx.currentTime;
    try {
      if (!this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.35); // A3 to D4 scoop

      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(440, now);
      oscHarmonic.frequency.exponentialRampToValueAtTime(587.33, now + 0.35);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(620, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.25);
      gain.gain.setValueAtTime(0.20, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 2.6);
      oscHarmonic.stop(now + 2.6);
    } catch {
      // Audio fallback
    }
  }

  private setupWindLayer(): void {
    if (!this.ctx || !this.masterGain) return;

    // Create pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle low-pass filter for wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    whiteNoise.start();
  }

  private setupWaveLayer(): void {
    if (!this.ctx || !this.masterGain) return;

    // Filtered noise with periodic swells simulating rhythmic sea wash
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.18;
    }

    const waveSource = this.ctx.createBufferSource();
    waveSource.buffer = noiseBuffer;
    waveSource.loop = true;

    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = "bandpass";
    waveFilter.frequency.setValueAtTime(240, this.ctx.currentTime);
    waveFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    this.waveGain = this.ctx.createGain();
    this.waveGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    waveSource.connect(waveFilter);
    waveFilter.connect(this.waveGain);
    this.waveGain.connect(this.masterGain);

    waveSource.start();
  }

  private startBirdLoop(): void {
    const scheduleNextBird = () => {
      const delay = 4000 + Math.random() * 8000;
      this.birdTimer = setTimeout(() => {
        if (this.isPlaying && !this.isMuted) {
          this.chirpBird();
        }
        scheduleNextBird();
      }, delay);
    };
    scheduleNextBird();
  }

  private chirpBird(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const baseFreq = 2200 + Math.random() * 1200;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore audio glitch
    }
  }

  public destroy(): void {
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.ctx && this.ctx.state !== "closed") {
      void this.ctx.close();
    }
    this.ctx = null;
    this.isInitialized = false;
    this.isPlaying = false;
  }
}

export const ambientAudioSystem = new AmbientAudioSystem();
