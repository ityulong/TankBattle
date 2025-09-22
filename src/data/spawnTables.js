import { ENEMY_TYPES, TOTAL_ENEMIES_PER_STAGE } from '../core/config.js';

const distributionPlan = [
  [18, 2, 0, 0],
  [14, 4, 2, 0],
  [14, 2, 2, 2],
  [10, 4, 4, 2],
  [10, 4, 4, 2],
  [8, 6, 4, 2],
  [6, 6, 4, 4],
  [6, 4, 6, 4],
  [4, 6, 6, 4],
  [4, 4, 6, 6],
  [4, 4, 6, 6],
  [2, 6, 6, 6],
  [2, 6, 6, 6],
  [2, 4, 8, 6],
  [2, 2, 8, 8],
  [2, 2, 8, 8],
  [0, 4, 8, 8],
  [0, 4, 8, 8],
  [0, 2, 8, 10],
  [0, 2, 8, 10],
  [0, 0, 10, 10],
  [0, 0, 10, 10],
  [0, 0, 8, 12],
  [0, 0, 8, 12],
  [0, 0, 6, 14],
  [0, 0, 6, 14],
  [0, 0, 4, 16],
  [0, 0, 4, 16],
  [0, 0, 2, 18],
  [0, 0, 2, 18],
  [0, 0, 0, 20],
  [0, 0, 0, 20],
  [0, 0, 0, 20],
  [0, 0, 0, 20],
  [0, 0, 0, 20],
];

function buildSequence([basicCount, fastCount, powerCount, armorCount]) {
  const sequence = [];
  for (let i = 0; i < basicCount; i++) sequence.push(ENEMY_TYPES.BASIC);
  for (let i = 0; i < fastCount; i++) sequence.push(ENEMY_TYPES.FAST);
  for (let i = 0; i < powerCount; i++) sequence.push(ENEMY_TYPES.POWER);
  for (let i = 0; i < armorCount; i++) sequence.push(ENEMY_TYPES.ARMOR);
  while (sequence.length < TOTAL_ENEMIES_PER_STAGE) {
    sequence.push(ENEMY_TYPES.BASIC);
  }
  return sequence;
}

export const ENEMY_SPAWN_TABLE = distributionPlan.map(buildSequence);
