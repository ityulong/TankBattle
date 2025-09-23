import assert from 'node:assert/strict';
import { AudioManager } from '../src/audio/audioManager.js';

const manager = new AudioManager();
const EPSILON = 0.01;
const approxEqual = (a, b, message) => {
  assert.ok(Math.abs(a - b) < EPSILON, message ?? `Expected ${a} ≈ ${b}`);
};

const cSharp4 = manager._resolveFrequency('C#4');
const dFlat4 = manager._resolveFrequency('Db4');
approxEqual(cSharp4, dFlat4, 'C#4 should equal Db4');

const gFlat5 = manager._resolveFrequency('G♭5');
const fSharp5 = manager._resolveFrequency('F#5');
approxEqual(gFlat5, fSharp5, 'G♭5 should equal F#5');

const spaced = manager._resolveFrequency('  g#4  ');
const canonical = manager._resolveFrequency('G#4');
approxEqual(spaced, canonical, 'Whitespace and casing should be ignored');

const flatLower = manager._resolveFrequency('bb3');
const sharpLower = manager._resolveFrequency('A#3');
approxEqual(flatLower, sharpLower, 'Bb3 should equal A#3');

const cb4 = manager._resolveFrequency('Cb4');
const b3 = manager._resolveFrequency('B3');
approxEqual(cb4, b3, 'Cb4 should resolve to B3');

const bSharp3 = manager._resolveFrequency('B#3');
const c4 = manager._resolveFrequency('C4');
approxEqual(bSharp3, c4, 'B#3 should resolve to C4');

assert.strictEqual(manager._resolveFrequency('REST'), null, 'REST should map to silence');
assert.strictEqual(manager._resolveFrequency('rest'), null, 'Lowercase rest should map to silence');
assert.strictEqual(manager._resolveFrequency(523.25), 523.25, 'Numeric frequencies should pass through');
assert.strictEqual(manager._resolveFrequency('not a note'), null, 'Invalid notes should return null');

console.log('Audio accidental resolution tests passed.');
