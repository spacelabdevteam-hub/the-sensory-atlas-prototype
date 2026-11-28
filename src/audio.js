// Zero-Asset Procedural Web Audio API Soundscape (Muted by default)
// Synthesizes a soft harmonic drone + filtered breeze proportional to sanctuary dB.

export class SensoryAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.oscA = null;
    this.oscB = null;
    this.filter = null;
    this.isEnabled = false;
    this.currentDb = 42;
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  enable() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 420;
      this.filter.Q.value = 1.2;

      // Solarpunk open fifth (D3 + A3) for contemplative calm
      this.oscA = this.ctx.createOscillator();
      this.oscA.type = 'sine';
      this.oscA.frequency.value = 146.83;

      this.oscB = this.ctx.createOscillator();
      this.oscB.type = 'triangle';
      this.oscB.frequency.value = 220.0;

      const oscBGain = this.ctx.createGain();
      oscBGain.gain.value = 0.28;

      this.oscA.connect(this.filter);
      this.oscB.connect(oscBGain);
      oscBGain.connect(this.filter);
      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.oscA.start();
      this.oscB.start();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = true;
    this.updateAcousticProfile(this.currentDb);
    return true;
  }

  disable() {
    this.isEnabled = false;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.15);
    }
  }

  updateAcousticProfile(noiseDb) {
    this.currentDb = noiseDb;
    if (!this.isEnabled || !this.ctx || !this.masterGain || !this.filter) return;

    const now = this.ctx.currentTime;
    // Quieter sanctuaries (<40 dB) get softer, warmer low-pass harmonics; busier corridors open filter slightly
    const normalized = Math.max(0, Math.min(1, (noiseDb - 20) / 45));
    const cutoffHz = 280 + normalized * 520;
    const gainLevel = 0.045 + normalized * 0.035;

    this.filter.frequency.setTargetAtTime(cutoffHz, now, 0.35);
    this.masterGain.gain.setTargetAtTime(gainLevel, now, 0.35);
  }
}
