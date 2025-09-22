export const TILE_SIZE = 16;
export const GRID_SIZE = 26;
export const FIELD_SIZE = TILE_SIZE * GRID_SIZE;

export const GAME_SPEED = 1; // multiplier for adjusting update speed
export const PLAYER_BASE_LIVES = 3;

export const ENEMY_TYPES = {
  BASIC: 'basic',
  FAST: 'fast',
  POWER: 'power',
  ARMOR: 'armor',
};

export const TILE_TYPES = {
  EMPTY: 0,
  BRICK: 1,
  STEEL: 2,
  WATER: 3,
  GRASS: 4,
  ICE: 5,
  BASE: 6,
  EAGLE: 7,
};

export const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const GAME_STATES = {
  MENU: 'menu',
  STAGE_INTRO: 'stage-intro',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game-over',
  SCORE: 'score',
};

export const POWER_UP_TYPES = {
  HELMET: 'helmet',
  TIMER: 'timer',
  SHOVEL: 'shovel',
  STAR: 'star',
  GRENADE: 'grenade',
  TANK: 'tank',
  GUN: 'gun',
};

export const MAX_ENEMIES_ON_FIELD = 4;
export const TOTAL_ENEMIES_PER_STAGE = 20;
