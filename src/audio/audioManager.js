const NOTE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

const THEMES = {
  intro: [
    ['E4', 0.25],
    ['F4', 0.25],
    ['G4', 0.5],
    ['C5', 0.5],
  ],
  stage: [
    ['C4', 0.25],
    ['E4', 0.25],
    ['G4', 0.25],
    ['C5', 0.25],
    ['E5', 0.25],
    ['G5', 0.25],
    ['E5', 0.25],
    ['C5', 0.25],
  ],
  battle: [
    ['C4', 0.25],
    ['G4', 0.25],
    ['A4', 0.25],
    ['G4', 0.25],
    ['C5', 0.25],
    ['E5', 0.25],
    ['D5', 0.25],
    ['C5', 0.25],
  ],
  gameover: [
    ['C5', 0.3],
    ['G4', 0.3],
    ['E4', 0.3],
  ],
};

const SFX = {
  fire: [['G4', 0.1], ['C5', 0.05]],
  explosion: [['C4', 0.1], ['E4', 0.1], ['G3', 0.2]],
  pickup: [['E5', 0.1], ['G5', 0.1], ['C6', 0.1]],
  pause: [['C4', 0.15], ['C5', 0.15]],
};

export class AudioManager {
  constructor() {
    this.enabled = true;
    this.volume = 1;
    this.context = null;
    this.currentLoop = null;
    this.masterGain = null;
  }

  async init() {
    if (this.context) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.context = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(ctx.destination);
  }

  setEnabled(value) {
    this.enabled = value;
    if (!value) {
      this.stopLoop();
    }
  }

  setVolume(value) {
    this.volume = value;
    if (this.masterGain) {
      this.masterGain.gain.value = value;
    }
  }

  stopLoop() {
    if (this.currentLoop) {
      this.currentLoop.stop();
      this.currentLoop = null;
    }
  }

  playTheme(name, { loop = false } = {}) {
    if (!this.enabled) return;
    const notes = THEMES[name];
    if (!notes) return;
    this.stopLoop();
    this._playSequence(notes, { loop });
  }

  playSfx(name) {
    if (!this.enabled) return;
    const notes = SFX[name];
    if (!notes) return;
    this._playSequence(notes, { loop: false, volume: 0.7 });
  }

  _playSequence(notes, { loop = false, volume = 1 } = {}) {
    if (!this.context) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);
    let start = now;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    for (const [note, length] of notes) {
      const freq = NOTE_FREQUENCIES[note] || 0;
      osc.frequency.setValueAtTime(freq, start);
      start += length * 0.6;
    }
    osc.connect(gain);
    osc.start(now);
    const duration = start - now;
    osc.stop(now + duration);
    if (loop) {
      osc.onended = () => {
        this.currentLoop = null;
        if (this.enabled) {
          this._playSequence(notes, { loop: true, volume });
        }
      };
      this.currentLoop = osc;
    }
  }
}
