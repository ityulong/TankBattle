import { TILE_TYPES, GRID_SIZE } from '../core/config.js';

function createEmptyLevel() {
  const level = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = new Array(GRID_SIZE).fill(TILE_TYPES.EMPTY);
    level.push(row);
  }
  return level;
}

function fillRect(level, x0, y0, x1, y1, tile) {
  const minX = Math.max(0, Math.min(x0, x1));
  const maxX = Math.min(GRID_SIZE - 1, Math.max(x0, x1));
  const minY = Math.max(0, Math.min(y0, y1));
  const maxY = Math.min(GRID_SIZE - 1, Math.max(y0, y1));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      level[y][x] = tile;
    }
  }
}

function clearRect(level, x0, y0, x1, y1) {
  fillRect(level, x0, y0, x1, y1, TILE_TYPES.EMPTY);
}

function mirrorVertically(level) {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE / 2; x++) {
      level[y][GRID_SIZE - 1 - x] = level[y][x];
    }
  }
}

function mirrorHorizontally(level) {
  for (let y = 0; y < GRID_SIZE / 2; y++) {
    const target = GRID_SIZE - 1 - y;
    level[target] = [...level[y]];
  }
}

function applyBase(level) {
  const center = Math.floor(GRID_SIZE / 2);
  const baseY = GRID_SIZE - 3;
  for (let x = center - 2; x <= center + 2; x++) {
    level[baseY][x] = TILE_TYPES.BRICK;
    level[baseY + 1][x] = TILE_TYPES.BRICK;
  }
  level[baseY + 1][center] = TILE_TYPES.BASE;
  level[baseY + 2][center] = TILE_TYPES.EAGLE;
}

function addRandomGrass(level, seed) {
  const rng = mulberry32(seed);
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(rng() * GRID_SIZE);
    const y = Math.floor(rng() * (GRID_SIZE - 6));
    fillRect(level, x, y, Math.min(x + 1, GRID_SIZE - 1), Math.min(y + 1, GRID_SIZE - 6), TILE_TYPES.GRASS);
  }
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStageBuilder(configurator) {
  return (seed = 1) => {
    const level = createEmptyLevel();
    configurator(level, seed);
    applyBase(level);
    return level;
  };
}

const stageBuilders = [
  createStageBuilder((level) => {
    fillRect(level, 0, 0, 3, GRID_SIZE - 6, TILE_TYPES.BRICK);
    fillRect(level, GRID_SIZE - 4, 0, GRID_SIZE - 1, GRID_SIZE - 6, TILE_TYPES.BRICK);
    clearRect(level, 1, 6, GRID_SIZE - 2, GRID_SIZE - 8);
    fillRect(level, 4, 2, 8, 5, TILE_TYPES.BRICK);
    fillRect(level, GRID_SIZE - 9, 2, GRID_SIZE - 5, 5, TILE_TYPES.BRICK);
    fillRect(level, 9, 8, 16, 12, TILE_TYPES.WATER);
    fillRect(level, 9, 13, 16, 15, TILE_TYPES.WATER);
    fillRect(level, 6, 9, 7, 14, TILE_TYPES.BRICK);
    fillRect(level, GRID_SIZE - 8, 9, GRID_SIZE - 7, 14, TILE_TYPES.BRICK);
    mirrorVertically(level);
    fillRect(level, 11, 5, 14, 7, TILE_TYPES.BRICK);
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, 2, TILE_TYPES.STEEL);
    fillRect(level, 0, 3, 5, GRID_SIZE - 8, TILE_TYPES.BRICK);
    fillRect(level, GRID_SIZE - 6, 3, GRID_SIZE - 1, GRID_SIZE - 8, TILE_TYPES.BRICK);
    fillRect(level, 8, 5, 17, 10, TILE_TYPES.WATER);
    fillRect(level, 4, 12, GRID_SIZE - 5, 16, TILE_TYPES.GRASS);
    mirrorVertically(level);
    fillRect(level, 11, 8, 14, 9, TILE_TYPES.STEEL);
    fillRect(level, 11, 10, 14, 11, TILE_TYPES.STEEL);
  }),
  createStageBuilder((level) => {
    fillRect(level, 2, 0, 4, GRID_SIZE - 7, TILE_TYPES.BRICK);
    fillRect(level, GRID_SIZE - 5, 0, GRID_SIZE - 3, GRID_SIZE - 7, TILE_TYPES.BRICK);
    fillRect(level, 6, 5, GRID_SIZE - 7, 7, TILE_TYPES.STEEL);
    fillRect(level, 6, 9, GRID_SIZE - 7, 11, TILE_TYPES.STEEL);
    fillRect(level, 5, 13, GRID_SIZE - 6, 15, TILE_TYPES.GRASS);
    fillRect(level, 8, 2, GRID_SIZE - 9, 4, TILE_TYPES.WATER);
    mirrorVertically(level);
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, GRID_SIZE - 8, TILE_TYPES.GRASS);
    fillRect(level, 3, 3, GRID_SIZE - 4, GRID_SIZE - 12, TILE_TYPES.BRICK);
    clearRect(level, 5, 5, GRID_SIZE - 6, GRID_SIZE - 14);
    fillRect(level, 9, 7, GRID_SIZE - 10, GRID_SIZE - 16, TILE_TYPES.WATER);
    mirrorVertically(level);
    mirrorHorizontally(level);
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, 1, TILE_TYPES.BRICK);
    fillRect(level, 0, 2, GRID_SIZE - 1, 3, TILE_TYPES.WATER);
    fillRect(level, 0, 4, GRID_SIZE - 1, 5, TILE_TYPES.GRASS);
    fillRect(level, 0, 6, GRID_SIZE - 1, 7, TILE_TYPES.STEEL);
    fillRect(level, 0, 8, GRID_SIZE - 1, 9, TILE_TYPES.WATER);
    fillRect(level, 0, 10, GRID_SIZE - 1, 11, TILE_TYPES.GRASS);
    mirrorHorizontally(level);
  }),
  createStageBuilder((level) => {
    fillRect(level, 2, 0, GRID_SIZE - 3, GRID_SIZE - 8, TILE_TYPES.BRICK);
    clearRect(level, 4, 2, GRID_SIZE - 5, GRID_SIZE - 10);
    fillRect(level, 4, 2, 6, GRID_SIZE - 10, TILE_TYPES.WATER);
    fillRect(level, GRID_SIZE - 7, 2, GRID_SIZE - 5, GRID_SIZE - 10, TILE_TYPES.WATER);
    fillRect(level, 10, 2, GRID_SIZE - 11, GRID_SIZE - 10, TILE_TYPES.STEEL);
    mirrorVertically(level);
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, GRID_SIZE - 9, TILE_TYPES.EMPTY);
    for (let y = 0; y < GRID_SIZE - 8; y += 3) {
      fillRect(level, 0, y, GRID_SIZE - 1, y, TILE_TYPES.BRICK);
    }
    for (let x = 0; x < GRID_SIZE; x += 4) {
      fillRect(level, x, 0, x, GRID_SIZE - 9, TILE_TYPES.BRICK);
    }
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, GRID_SIZE - 6, TILE_TYPES.EMPTY);
    for (let i = 0; i < GRID_SIZE - 6; i += 4) {
      fillRect(level, i, i, Math.min(i + 2, GRID_SIZE - 1), Math.min(i + 2, GRID_SIZE - 6), TILE_TYPES.BRICK);
      fillRect(level, GRID_SIZE - 1 - i, i, GRID_SIZE - 1 - Math.max(i - 2, 0), Math.min(i + 2, GRID_SIZE - 6), TILE_TYPES.BRICK);
    }
    fillRect(level, 11, 8, 14, GRID_SIZE - 9, TILE_TYPES.WATER);
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, GRID_SIZE - 6, TILE_TYPES.EMPTY);
    for (let x = 0; x < GRID_SIZE; x += 6) {
      fillRect(level, x, 0, x + 1, GRID_SIZE - 6, TILE_TYPES.STEEL);
    }
    for (let y = 0; y < GRID_SIZE - 6; y += 6) {
      fillRect(level, 0, y, GRID_SIZE - 1, y + 1, TILE_TYPES.STEEL);
    }
    addRandomGrass(level, 13);
  }),
  createStageBuilder((level) => {
    fillRect(level, 0, 0, GRID_SIZE - 1, GRID_SIZE - 6, TILE_TYPES.GRASS);
    fillRect(level, 4, 0, GRID_SIZE - 5, GRID_SIZE - 6, TILE_TYPES.EMPTY);
    for (let y = 0; y < GRID_SIZE - 6; y += 5) {
      fillRect(level, 4, y, GRID_SIZE - 5, y + 1, TILE_TYPES.WATER);
    }
    fillRect(level, 8, 2, GRID_SIZE - 9, GRID_SIZE - 8, TILE_TYPES.BRICK);
  }),
];

function generateAdditionalStages(count) {
  const generated = [];
  for (let i = 0; i < count; i++) {
    const base = stageBuilders[i % stageBuilders.length];
    const level = base(i * 37 + 17);
    if (i % 2 === 0) {
      mirrorVertically(level);
    }
    if (i % 3 === 0) {
      mirrorHorizontally(level);
    }
    if (i % 4 === 0) {
      addRandomGrass(level, 97 + i);
    }
    generated.push(level);
  }
  return generated;
}

export const LEVELS = [
  ...stageBuilders.map((builder, index) => builder(index + 1)),
  ...generateAdditionalStages(35 - stageBuilders.length),
];
