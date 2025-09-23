const NOTE_FREQUENCIES = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
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
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  F6: 1396.91,
  G6: 1567.98,
  A6: 1760.0,
  B6: 1975.53,
};

const DEFAULT_BEAT_DURATION = 0.45;
const LOOP_SCHEDULE_LEAD = 0.1;
const DEFAULT_ENVELOPE = {
  attack: 0.01,
  decay: 0.08,
  sustain: 0.6,
  release: 0.15,
};

const THEMES = {
  intro: {
    beatDuration: 0.45,
    loopStrategy: 'sequential',
    segments: [
      {
        tracks: [
          {
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.12, sustain: 0.7, release: 0.25 },
            volume: 0.8,
            notes: [
              { note: 'E4', length: 0.5 },
              { note: 'G4', length: 0.5 },
              { note: 'C5', length: 1 },
              { note: 'G4', length: 0.5 },
              { note: 'F4', length: 0.5 },
            ],
          },
          {
            waveform: 'sine',
            envelope: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.4 },
            volume: 0.5,
            notes: [
              { note: 'C4', length: 2 },
              { note: 'G3', length: 2 },
            ],
          },
          {
            waveform: 'sawtooth',
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.18 },
            volume: 0.35,
            notes: [
              { note: 'C5', length: 0.5 },
              { note: 'E5', length: 0.5 },
              { note: 'G5', length: 0.5 },
              { note: 'E5', length: 0.5 },
            ],
          },
        ],
      },
      {
        tracks: [
          {
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.12, sustain: 0.7, release: 0.25 },
            volume: 0.8,
            notes: [
              { note: 'E4', length: 0.5 },
              { note: 'A4', length: 0.5 },
              { note: 'G4', length: 0.5 },
              { note: 'D5', length: 1 },
              { note: 'C5', length: 0.5 },
              { note: 'G4', length: 0.5 },
            ],
          },
          {
            waveform: 'sine',
            envelope: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.4 },
            volume: 0.5,
            notes: [
              { note: 'F3', length: 2 },
              { note: 'C4', length: 2 },
            ],
          },
          {
            waveform: 'sawtooth',
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.18 },
            volume: 0.35,
            notes: [
              { note: 'G5', length: 0.5 },
              { note: 'E5', length: 0.5 },
              { note: 'C5', length: 0.5 },
              { note: 'E5', length: 0.5 },
            ],
          },
        ],
      },
    ],
  },
  stage: {
    beatDuration: 0.35,
    segments: [
      {
        tracks: [
          {
            waveform: 'square',
            envelope: { attack: 0.005, decay: 0.06, sustain: 0.55, release: 0.2 },
            volume: 0.95,
            notes: [
              { note: 'C4', length: 0.5 },
              { note: 'E4', length: 0.5 },
              { note: 'G4', length: 0.5 },
              { note: 'C5', length: 0.75 },
              { note: 'E5', length: 0.25 },
              { note: 'G5', length: 0.75 },
              { note: 'C5', length: 0.25 },
              { note: 'E5', length: 0.5 },
            ],
          },
          {
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.3 },
            volume: 0.65,
            notes: [
              { note: 'C3', length: 1 },
              { note: 'G3', length: 1 },
              { note: 'F3', length: 1 },
              { note: 'G3', length: 1 },
            ],
          },
          {
            waveform: 'sine',
            envelope: { attack: 0.03, decay: 0.1, sustain: 0.85, release: 0.22 },
            volume: 0.4,
            notes: [
              { note: 'C4', length: 2 },
              { note: 'G4', length: 2 },
            ],
          },
        ],
      },
    ],
  },
  battle: {
    beatDuration: 0.3,
    loopStrategy: 'sequential',
    segments: [
      {
        tracks: [
          {
            waveform: 'sawtooth',
            envelope: { attack: 0.005, decay: 0.08, sustain: 0.45, release: 0.14 },
            volume: 0.9,
            filter: { type: 'lowpass', frequency: 1600, Q: 0.9 },
            notes: [
              { note: 'C4', length: 0.5 },
              { note: 'E4', length: 0.5 },
              { note: 'G4', length: 0.5 },
              { note: 'A4', length: 0.5 },
              { note: 'G4', length: 0.25 },
              { note: 'E4', length: 0.25 },
              { note: 'D4', length: 0.5 },
              { note: 'C4', length: 0.5 },
            ],
          },
          {
            waveform: 'square',
            envelope: { attack: 0.003, decay: 0.05, sustain: 0.4, release: 0.1 },
            volume: 0.7,
            notes: [
              { note: 'C5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'C5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'G4', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'A4', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'E5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'D5', length: 0.25 },
              { note: 'REST', length: 0.25 },
            ],
          },
          {
            waveform: 'triangle',
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.75, release: 0.3 },
            volume: 0.6,
            notes: [
              { note: 'C3', length: 1 },
              { note: 'G3', length: 1 },
              { note: 'A3', length: 1 },
              { note: 'F3', length: 1 },
            ],
          },
        ],
      },
      {
        tracks: [
          {
            waveform: 'sawtooth',
            envelope: { attack: 0.005, decay: 0.08, sustain: 0.45, release: 0.14 },
            volume: 0.9,
            filter: { type: 'lowpass', frequency: 1700, Q: 1.1 },
            notes: [
              { note: 'E4', length: 0.5 },
              { note: 'G4', length: 0.5 },
              { note: 'A4', length: 0.5 },
              { note: 'C5', length: 0.5 },
              { note: 'B4', length: 0.25 },
              { note: 'G4', length: 0.25 },
              { note: 'F4', length: 0.5 },
              { note: 'E4', length: 0.5 },
            ],
          },
          {
            waveform: 'square',
            envelope: { attack: 0.003, decay: 0.05, sustain: 0.4, release: 0.1 },
            volume: 0.7,
            notes: [
              { note: 'E5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'F5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'G5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'A5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'C5', length: 0.25 },
              { note: 'REST', length: 0.25 },
              { note: 'B4', length: 0.25 },
              { note: 'REST', length: 0.25 },
            ],
          },
          {
            waveform: 'triangle',
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.75, release: 0.3 },
            volume: 0.6,
            notes: [
              { note: 'A3', length: 1 },
              { note: 'E3', length: 1 },
              { note: 'F3', length: 1 },
              { note: 'G3', length: 1 },
            ],
          },
        ],
      },
    ],
  },
  gameover: {
    beatDuration: 0.45,
    segments: [
      {
        tracks: [
          {
            waveform: 'triangle',
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.4 },
            volume: 0.8,
            notes: [
              { note: 'C5', length: 0.75 },
              { note: 'G4', length: 0.5 },
              { note: 'E4', length: 1 },
            ],
          },
          {
            waveform: 'sine',
            envelope: { attack: 0.04, decay: 0.1, sustain: 0.8, release: 0.6 },
            volume: 0.45,
            notes: [{ note: 'C4', length: 2.5 }],
          },
        ],
      },
    ],
  },
};

const SFX = {
  fire: {
    beatDuration: 0.12,
    segments: [
      {
        tracks: [
          {
            waveform: 'square',
            envelope: { attack: 0.002, decay: 0.05, sustain: 0.3, release: 0.08 },
            volume: 0.8,
            notes: [
              { note: 'G4', length: 0.5, volume: 0.8 },
              { note: 'C5', length: 0.3, volume: 0.6 },
            ],
          },
          {
            waveform: 'triangle',
            envelope: { attack: 0.001, decay: 0.04, sustain: 0.2, release: 0.08 },
            volume: 0.6,
            notes: [
              { note: 'C5', length: 0.3, volume: 0.6 },
              { note: 'E5', length: 0.3, volume: 0.4 },
            ],
          },
        ],
      },
    ],
  },
  explosion: {
    beatDuration: 0.16,
    segments: [
      {
        tracks: [
          {
            waveform: 'sawtooth',
            envelope: { attack: 0.001, decay: 0.15, sustain: 0.1, release: 0.4 },
            volume: 0.9,
            notes: [
              { note: 'C4', length: 0.5, volume: 1 },
              { note: 'G3', length: 0.5, volume: 0.8 },
              { note: 'C3', length: 0.5, volume: 0.7 },
            ],
          },
          {
            waveform: 'square',
            envelope: { attack: 0.001, decay: 0.05, sustain: 0.3, release: 0.2 },
            volume: 0.6,
            notes: [
              { note: 'E4', length: 0.3, volume: 0.7 },
              { note: 'G4', length: 0.2, volume: 0.6 },
            ],
          },
        ],
      },
    ],
  },
  pickup: {
    beatDuration: 0.1,
    segments: [
      {
        tracks: [
          {
            waveform: 'triangle',
            envelope: { attack: 0.002, decay: 0.05, sustain: 0.6, release: 0.2 },
            volume: 0.7,
            notes: [
              { note: 'E5', length: 0.3, volume: 0.8 },
              { note: 'G5', length: 0.3, volume: 0.8 },
              { note: 'C6', length: 0.6, volume: 1 },
            ],
          },
          {
            waveform: 'square',
            envelope: { attack: 0.001, decay: 0.04, sustain: 0.3, release: 0.1 },
            volume: 0.4,
            notes: [
              { note: 'C5', length: 0.15, volume: 0.5 },
              { note: 'E5', length: 0.15, volume: 0.4 },
              { note: 'G5', length: 0.15, volume: 0.4 },
            ],
          },
        ],
      },
    ],
  },
  pause: {
    beatDuration: 0.2,
    segments: [
      {
        tracks: [
          {
            waveform: 'sine',
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.8, release: 0.2 },
            volume: 0.7,
            notes: [
              { note: 'C4', length: 0.6 },
              { note: 'C5', length: 0.6 },
            ],
          },
        ],
      },
    ],
  },
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

  playTheme(name, { loop = false, volume = 1 } = {}) {
    if (!this.enabled) return;
    const arrangement = THEMES[name];
    if (!arrangement) return;
    this.stopLoop();
    const totalVolume = volume * (arrangement.volume ?? 1);
    if (loop) {
      this.currentLoop = this._playArrangement(arrangement, { loop: true, volume: totalVolume });
    } else {
      this._playArrangement(arrangement, { loop: false, volume: totalVolume });
    }
  }

  playSfx(name) {
    if (!this.enabled) return;
    const arrangement = SFX[name];
    if (!arrangement) return;
    const totalVolume = 0.7 * (arrangement.volume ?? 1);
    this._playArrangement(arrangement, { loop: false, volume: totalVolume });
  }

  _playArrangement(arrangement, { loop = false, volume = 1 } = {}) {
    if (!this.context) return null;
    if (!arrangement?.segments?.length) return null;
    const startTime = this.context.currentTime + 0.02;
    const normalizedVolume = volume;
    if (loop) {
      return this._startLoop(arrangement, normalizedVolume, startTime);
    }
    const { segment } = this._selectSegment(arrangement, {});
    if (!segment) return null;
    this._renderSegment(arrangement, segment, startTime, normalizedVolume, null);
    return null;
  }

  _startLoop(arrangement, volume, startTime) {
    const controller = {
      stopped: false,
      timer: null,
      sources: new Set(),
      stop: () => {
        if (controller.stopped) return;
        controller.stopped = true;
        if (controller.timer) {
          clearTimeout(controller.timer);
          controller.timer = null;
        }
        controller.sources.forEach((source) => {
          if (source.stopped) return;
          const now = this.context.currentTime;
          let stopAt = Math.max(now + 0.01, source.startTime);
          if (stopAt > source.stopTime) {
            stopAt = source.stopTime;
          }
          try {
            source.node.stop(stopAt);
          } catch (error) {
            // Oscillator might already be stopped.
          }
          source.stopped = true;
        });
        controller.sources.clear();
      },
    };

    const scheduleSegment = (state, segmentStart) => {
      if (controller.stopped || !this.enabled) return;
      const { segment, nextState } = this._selectSegment(arrangement, state);
      if (!segment) return;
      const { endTime } = this._renderSegment(
        arrangement,
        segment,
        segmentStart ?? Math.max(this.context.currentTime, startTime),
        volume,
        controller.sources,
      );
      const now = this.context.currentTime;
      const lead = arrangement.loopLeadTime ?? LOOP_SCHEDULE_LEAD;
      const delay = Math.max((endTime - now - lead) * 1000, 0);
      controller.timer = setTimeout(() => scheduleSegment(nextState, endTime), delay);
    };

    scheduleSegment({}, startTime);
    return controller;
  }

  _selectSegment(arrangement, state = {}) {
    const segments = arrangement.segments ?? [];
    if (!segments.length) {
      return { segment: null, nextState: state };
    }
    const strategy = arrangement.loopStrategy || 'sequential';
    if (strategy === 'random') {
      let index = Math.floor(Math.random() * segments.length);
      if (segments.length > 1 && state.lastIndex !== undefined && index === state.lastIndex) {
        index = (index + 1) % segments.length;
      }
      return { segment: segments[index], nextState: { lastIndex: index } };
    }
    const index = state.index ?? 0;
    const segment = segments[index % segments.length];
    return { segment, nextState: { index: (index + 1) % segments.length } };
  }

  _renderSegment(arrangement, segment, startTime, volume, sourceCollection) {
    const ctx = this.context;
    const segmentGain = ctx.createGain();
    const segmentVolume = volume * (segment.volume ?? 1);
    segmentGain.gain.setValueAtTime(segmentVolume, startTime);
    segmentGain.connect(this.masterGain);

    const beatDuration = segment.beatDuration ?? arrangement.beatDuration ?? DEFAULT_BEAT_DURATION;
    let endTime = startTime;

    for (const track of segment.tracks ?? []) {
      const trackEnd = this._renderTrack(track, {
        startTime,
        beatDuration,
        destination: segmentGain,
        sourceCollection,
      });
      if (trackEnd > endTime) {
        endTime = trackEnd;
      }
    }

    segmentGain.gain.setValueAtTime(segmentVolume, endTime);
    segmentGain.gain.linearRampToValueAtTime(0.0001, endTime + 0.05);

    return { endTime: endTime + 0.05 };
  }

  _renderTrack(track, { startTime, beatDuration, destination, sourceCollection }) {
    const ctx = this.context;
    const trackGain = ctx.createGain();
    const trackVolume = track.volume ?? 1;
    trackGain.gain.setValueAtTime(trackVolume, startTime);
    trackGain.connect(destination);

    let trackInput = trackGain;
    if (track.filter) {
      const filterNode = ctx.createBiquadFilter();
      filterNode.type = track.filter.type ?? 'lowpass';
      if (track.filter.frequency) {
        filterNode.frequency.setValueAtTime(track.filter.frequency, startTime);
      }
      if (track.filter.Q) {
        filterNode.Q.setValueAtTime(track.filter.Q, startTime);
      }
      if (track.filter.gain) {
        filterNode.gain.setValueAtTime(track.filter.gain, startTime);
      }
      filterNode.connect(trackGain);
      trackInput = filterNode;
    }

    let cursor = startTime + (track.offset ?? 0);
    let endTime = cursor;

    for (const noteEvent of track.notes ?? []) {
      const lengthInBeats = noteEvent.length ?? 1;
      const holdDuration = Math.max(lengthInBeats * beatDuration, 0);
      if (holdDuration === 0) {
        continue;
      }

      if (noteEvent.note === 'REST' || noteEvent.rest) {
        cursor += holdDuration;
        if (cursor > endTime) {
          endTime = cursor;
        }
        continue;
      }

      const noteEnd = this._scheduleNote({
        track,
        noteEvent,
        startTime: cursor,
        holdDuration,
        destination: trackInput,
        sourceCollection,
      });
      cursor += holdDuration;
      if (noteEnd > endTime) {
        endTime = noteEnd;
      }
    }

    return endTime;
  }

  _scheduleNote({ track, noteEvent, startTime, holdDuration, destination, sourceCollection }) {
    const ctx = this.context;
    const frequency = this._resolveFrequency(noteEvent.note ?? noteEvent.frequency);
    if (!frequency) {
      return startTime + holdDuration;
    }

    const oscillator = ctx.createOscillator();
    oscillator.type = noteEvent.waveform ?? track.waveform ?? 'square';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    const totalDetune = (track.detune ?? 0) + (noteEvent.detune ?? 0);
    if (totalDetune) {
      oscillator.detune.setValueAtTime(totalDetune, startTime);
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.connect(destination);
    oscillator.connect(gainNode);

    const envelope = {
      ...DEFAULT_ENVELOPE,
      ...(track.envelope ?? {}),
      ...(noteEvent.envelope ?? {}),
    };

    const peak = (noteEvent.volume ?? 1) * (envelope.peak ?? 1);
    const noteEnd = this._applyEnvelope(gainNode.gain, startTime, holdDuration, envelope, peak);

    oscillator.start(startTime);
    const stopTime = noteEnd + 0.01;
    oscillator.stop(stopTime);

    if (sourceCollection) {
      const sourceInfo = {
        node: oscillator,
        startTime,
        stopTime,
        stopped: false,
      };
      sourceCollection.add(sourceInfo);
      oscillator.onended = () => {
        sourceInfo.stopped = true;
        sourceCollection.delete(sourceInfo);
      };
    }

    return noteEnd;
  }

  _applyEnvelope(gainParam, startTime, holdDuration, envelope, peak) {
    let attack = Math.max(envelope.attack ?? 0.01, 0);
    let decay = Math.max(envelope.decay ?? 0.05, 0);
    let release = Math.max(envelope.release ?? 0.15, 0.005);
    const sustainRatio = Math.min(Math.max(envelope.sustain ?? 0.6, 0), 1);

    const available = Math.max(holdDuration - release, 0.001);
    const attackDecaySum = attack + decay;
    if (attackDecaySum > available) {
      const scale = available / attackDecaySum;
      attack *= scale;
      decay *= scale;
    }

    const sustainDuration = Math.max(available - (attack + decay), 0);
    const attackEnd = startTime + attack;
    const decayEnd = attackEnd + decay;
    const releaseStart = startTime + attack + decay + sustainDuration;
    const endTime = releaseStart + release;

    const sustainLevel = peak * sustainRatio;

    gainParam.cancelScheduledValues(startTime);
    gainParam.setValueAtTime(0.0001, startTime);
    gainParam.linearRampToValueAtTime(peak, attackEnd);
    gainParam.linearRampToValueAtTime(sustainLevel, decayEnd);
    gainParam.setValueAtTime(sustainLevel, releaseStart);
    gainParam.linearRampToValueAtTime(0.0001, endTime);

    return endTime;
  }

  _resolveFrequency(note) {
    if (!note) return null;
    if (typeof note === 'number') {
      return note;
    }
    const freq = NOTE_FREQUENCIES[note];
    return freq ?? null;
  }
}
