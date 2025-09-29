const NOTE_FREQUENCIES = {
  C2: 65.41,
  'C#2': 69.3,
  D2: 73.42,
  'D#2': 77.78,
  E2: 82.41,
  F2: 87.31,
  'F#2': 92.5,
  G2: 98.0,
  'G#2': 103.83,
  A2: 110.0,
  'A#2': 116.54,
  B2: 123.47,
  C3: 130.81,
  'C#3': 138.59,
  D3: 146.83,
  'D#3': 155.56,
  E3: 164.81,
  F3: 174.61,
  'F#3': 185.0,
  G3: 196.0,
  'G#3': 207.65,
  A3: 220.0,
  'A#3': 233.08,
  B3: 246.94,
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.0,
  'G#4': 415.3,
  A4: 440.0,
  'A#4': 466.16,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  'D#5': 622.25,
  E5: 659.26,
  F5: 698.46,
  'F#5': 739.99,
  G5: 783.99,
  'G#5': 830.61,
  A5: 880.0,
  'A#5': 932.33,
  B5: 987.77,
  C6: 1046.5,
  'C#6': 1108.73,
  D6: 1174.66,
  'D#6': 1244.51,
  E6: 1318.51,
  F6: 1396.91,
  'F#6': 1479.98,
  G6: 1567.98,
  'G#6': 1661.22,
  A6: 1760.0,
  'A#6': 1864.66,
  B6: 1975.53,
};

const MUSIC_LIBRARY = {
  ode_to_joy: { src: 'assets/music/ode_to_joy.wav', title: 'Ode to Joy', composer: 'Ludwig van Beethoven', loop: true },
  fur_elise: { src: 'assets/music/fur_elise.wav', title: 'Für Elise', composer: 'Ludwig van Beethoven', loop: true },
  canon_in_d: { src: 'assets/music/canon_in_d.wav', title: 'Canon in D', composer: 'Johann Pachelbel', loop: true },
  turkish_march: { src: 'assets/music/turkish_march.wav', title: 'Turkish March', composer: 'Wolfgang Amadeus Mozart', loop: true },
  greensleeves: { src: 'assets/music/greensleeves.wav', title: 'Greensleeves', composer: 'Traditional English', loop: true },
  swan_lake: { src: 'assets/music/swan_lake.wav', title: 'Swan Lake Theme', composer: 'Pyotr Ilyich Tchaikovsky', loop: true },
  blue_danube: { src: 'assets/music/blue_danube.wav', title: 'The Blue Danube', composer: 'Johann Strauss II', loop: true },
  gymnopedie: { src: 'assets/music/gymnopedie.wav', title: 'Gymnopédie No. 1', composer: 'Erik Satie', loop: true },
  entertainer: { src: 'assets/music/entertainer.wav', title: 'The Entertainer', composer: 'Scott Joplin', loop: true },
  clair_de_lune: { src: 'assets/music/clair_de_lune.wav', title: 'Clair de Lune', composer: 'Claude Debussy', loop: true },
  air_on_g: { src: 'assets/music/air_on_g.wav', title: 'Air on the G String', composer: 'Johann Sebastian Bach', loop: true },
  jesu_joy: { src: 'assets/music/jesu_joy.wav', title: "Jesu, Joy of Man's Desiring", composer: 'Johann Sebastian Bach', loop: true },
  spring_vivaldi: { src: 'assets/music/spring_vivaldi.wav', title: 'Spring (The Four Seasons)', composer: 'Antonio Vivaldi', loop: true },
  morning_mood: { src: 'assets/music/morning_mood.wav', title: 'Morning Mood', composer: 'Edvard Grieg', loop: true },
  hungarian_dance: { src: 'assets/music/hungarian_dance.wav', title: 'Hungarian Dance No. 5', composer: 'Johannes Brahms', loop: true },
  william_tell: { src: 'assets/music/william_tell.wav', title: 'William Tell Overture', composer: 'Gioachino Rossini', loop: true },
  bolero: { src: 'assets/music/bolero.wav', title: 'Boléro', composer: 'Maurice Ravel', loop: true },
  sugar_plum: { src: 'assets/music/sugar_plum.wav', title: 'Dance of the Sugar Plum Fairy', composer: 'Pyotr Ilyich Tchaikovsky', loop: true },
  waltz_flowers: { src: 'assets/music/waltz_flowers.wav', title: 'Waltz of the Flowers', composer: 'Pyotr Ilyich Tchaikovsky', loop: true },
  radetzky_march: { src: 'assets/music/radetzky_march.wav', title: 'Radetzky March', composer: 'Johann Strauss Sr.', loop: true },
  moonlight_sonata: { src: 'assets/music/moonlight_sonata.wav', title: 'Moonlight Sonata', composer: 'Ludwig van Beethoven', loop: true },
  ave_maria: { src: 'assets/music/ave_maria.wav', title: 'Ave Maria', composer: 'Franz Schubert', loop: true },
  nessun_dorma: { src: 'assets/music/nessun_dorma.wav', title: 'Nessun Dorma', composer: 'Giacomo Puccini', loop: true },
  habanera: { src: 'assets/music/habanera.wav', title: 'Habanera', composer: 'Georges Bizet', loop: true },
  toreador_march: { src: 'assets/music/toreador_march.wav', title: 'Toreador March', composer: 'Georges Bizet', loop: true },
  la_cucaracha: { src: 'assets/music/la_cucaracha.wav', title: 'La Cucaracha', composer: 'Traditional Mexican', loop: true },
  scarborough_fair: { src: 'assets/music/scarborough_fair.wav', title: 'Scarborough Fair', composer: 'Traditional English', loop: true },
  sakura: { src: 'assets/music/sakura.wav', title: 'Sakura', composer: 'Traditional Japanese', loop: true },
  auld_lang_syne: { src: 'assets/music/auld_lang_syne.wav', title: 'Auld Lang Syne', composer: 'Traditional Scottish', loop: true },
  silent_night: { src: 'assets/music/silent_night.wav', title: 'Silent Night', composer: 'Franz Xaver Gruber', loop: true },
  amazing_grace: { src: 'assets/music/amazing_grace.wav', title: 'Amazing Grace', composer: 'Traditional', loop: true },
  frere_jacques: { src: 'assets/music/frere_jacques.wav', title: 'Frère Jacques', composer: 'Traditional French', loop: true },
  twinkle_twinkle: { src: 'assets/music/twinkle_twinkle.wav', title: 'Twinkle Twinkle Little Star', composer: 'Traditional', loop: true },
  happy_birthday: { src: 'assets/music/happy_birthday.wav', title: 'Happy Birthday to You', composer: 'Hill sisters', loop: true },
  pomp_and_circumstance: { src: 'assets/music/pomp_and_circumstance.wav', title: 'Pomp and Circumstance', composer: 'Edward Elgar', loop: true },
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
    this.masterGain = null;
    this.currentSource = null;
    this.loopState = null;
    this.musicBuffers = new Map();
    this.trackPromises = new Map();
    this.libraryPrefetchPromise = null;
  }

  async init() {
    if (!this.context) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.context = ctx;
      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(ctx.destination);
    }

    if (!this.libraryPrefetchPromise) {
      this.libraryPrefetchPromise = this._prefetchLibrary();
    }
  }

  async _loadTrack(id) {
    if (!this.context) return null;
    if (this.musicBuffers.has(id)) {
      return this.musicBuffers.get(id);
    }
    if (this.trackPromises.has(id)) {
      return this.trackPromises.get(id);
    }

    const config = MUSIC_LIBRARY[id];
    if (!config) {
      console.warn(`[AudioManager] Unknown music id "${id}".`);
      return null;
    }

    const loadPromise = (async () => {
      try {
        const response = await fetch(config.src);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await this.context.decodeAudioData(arrayBuffer);
        this.musicBuffers.set(id, buffer);
        return buffer;
      } catch (error) {
        console.error(`[AudioManager] Failed to load music "${id}":`, error);
        throw error;
      } finally {
        this.trackPromises.delete(id);
      }
    })();

    this.trackPromises.set(id, loadPromise);
    return loadPromise;
  }

  async _prefetchLibrary() {
    if (!this.context) return;
    const ids = Object.keys(MUSIC_LIBRARY);
    await Promise.all(ids.map((id) => this._loadTrack(id).catch(() => null)));
  }

  preloadTheme(name) {
    if (!this.context) return;
    if (!MUSIC_LIBRARY[name]) return;
    if (this.musicBuffers.has(name) || this.trackPromises.has(name)) return;
    this._loadTrack(name).catch(() => null);
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
    if (this.currentSource) {
      try {
        this.currentSource.onended = null;
        this.currentSource.stop();
      } catch (error) {
        // Older browsers may throw if stop is called twice; ignore.
      }
      try {
        this.currentSource.disconnect();
      } catch (error) {
        // Some nodes do not expose disconnect; ignore.
      }
    }
    this.currentSource = null;
    this.loopState = null;
  }

  playTheme(name, { loop } = {}) {
    if (!this.enabled || !this.context) return;

    const musicConfig = MUSIC_LIBRARY[name];
    if (musicConfig) {
      const shouldLoop = loop ?? musicConfig.loop ?? false;
      const volume = musicConfig.volume ?? 1;
      const playBuffer = (buffer) => {
        if (!buffer || !this.enabled) return;
        this.stopLoop();
        this._playBuffer(name, buffer, {
          loop: shouldLoop,
          volume,
          loopStart: musicConfig.loopStart,
          loopEnd: musicConfig.loopEnd,
        });
      };

      const buffer = this.musicBuffers.get(name);
      if (buffer) {
        playBuffer(buffer);
      } else {
        this._loadTrack(name)
          .then((readyBuffer) => {
            if (readyBuffer) {
              playBuffer(readyBuffer);
            }
          })
          .catch(() => {
            // 错误已经在 _loadTrack 内部记录。
          });
      }
      return;
    }

    const notes = THEMES[name];
    if (!notes) {
      console.warn(`[AudioManager] Unknown theme "${name}".`);
      return;
    }
    const shouldLoop = loop ?? false;
    this.stopLoop();
    this._playSequence(notes, { loop: shouldLoop });
  }

  playSfx(name) {
    if (!this.enabled || !this.context) return;
    const notes = SFX[name];
    if (!notes) {
      console.warn(`[AudioManager] Unknown SFX "${name}".`);
      return;
    }
    this._playSequence(notes, { loop: false, volume: 0.7 });
  }

  _playBuffer(name, buffer, { loop = false, volume = 1, loopStart, loopEnd } = {}) {
    const ctx = this.context;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    if (typeof loopStart === 'number') {
      source.loopStart = loopStart;
    }
    if (typeof loopEnd === 'number') {
      source.loopEnd = loopEnd;
    }
    source.connect(gain);

    const loopInfo = { type: 'buffer', id: name };
    source.onended = () => {
      gain.disconnect();
      if (this.currentSource === source) {
        this.currentSource = null;
      }
      if (this.loopState === loopInfo) {
        this.loopState = null;
      }
    };

    this.currentSource = source;
    this.loopState = loop ? loopInfo : null;
    source.start();
  }

  _playSequence(notes, { loop = false, volume = 1 } = {}) {
    const ctx = this.context;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);

    const osc = ctx.createOscillator();
    osc.type = 'square';

    const beatDuration = 0.6;
    let start = now;
    const loopInfo = { type: 'sequence', notes, volume };

    for (const [note, length] of notes) {
      const duration = length * beatDuration;
      if (note === 'REST') {
        gain.gain.setValueAtTime(0, start);
        gain.gain.setValueAtTime(volume, start + duration);
      } else {
        const freq = NOTE_FREQUENCIES[note];
        if (!freq) {
          console.error(`[AudioManager] Unknown note "${note}" in sequence.`);
          start += duration;
          continue;
        }
        osc.frequency.setValueAtTime(freq, start);
      }
      start += duration;
    }

    osc.connect(gain);
    osc.start(now);
    const stopTime = start;
    osc.stop(stopTime);

    osc.onended = () => {
      gain.disconnect();
      if (this.currentSource === osc) {
        this.currentSource = null;
      }
      if (loop && this.loopState === loopInfo && this.enabled) {
        this.loopState = null;
        this._playSequence(notes, { loop: true, volume });
      } else if (this.loopState === loopInfo) {
        this.loopState = null;
      }
    };

    this.currentSource = osc;
    this.loopState = loop ? loopInfo : null;
  }
}
