import { TILE_SIZE, TILE_TYPES, FIELD_SIZE } from './config.js';
import { TANK_SPRITE_DATA } from '../assets/tankSprites.js';
import {
  TILE_TEXTURE_DATA,
  ANIMATED_TILE_TEXTURE_DATA,
} from '../assets/tileTextures.js';

const COLORS = {
  background: '#000',
  brick: '#b5522b',
  steel: '#b5b5b5',
  water: '#2244ff',
  grass: '#3aa35c',
  ice: '#a8d0f0',
  base: '#d1a368',
  eagle: '#f4f0c0',
  player: '#f0e47a',
  enemyBasic: '#d96230',
  enemyFast: '#f4f4f4',
  enemyPower: '#f7c948',
  enemyArmor: '#9ab0c2',
  bullet: '#f7f7f7',
  shield: '#ffef67',
};

const TANK_SOURCES = {
  player: TANK_SPRITE_DATA.player,
  enemy_basic: TANK_SPRITE_DATA.enemy_basic,
  enemy_fast: TANK_SPRITE_DATA.enemy_fast,
  enemy_power: TANK_SPRITE_DATA.enemy_power,
  enemy_armor: TANK_SPRITE_DATA.enemy_armor,
};

const TILE_SOURCES = {
  [TILE_TYPES.BRICK]: TILE_TEXTURE_DATA.brick,
  [TILE_TYPES.STEEL]: TILE_TEXTURE_DATA.steel,
  [TILE_TYPES.ICE]: TILE_TEXTURE_DATA.ice,
  [TILE_TYPES.BASE]: TILE_TEXTURE_DATA.base,
  [TILE_TYPES.EAGLE]: TILE_TEXTURE_DATA.eagle,
};

const ANIMATED_TILE_SOURCES = {
  [TILE_TYPES.WATER]: {
    frames: [...(ANIMATED_TILE_TEXTURE_DATA.water?.frames ?? [])],
    speed: ANIMATED_TILE_TEXTURE_DATA.water?.speed ?? 0.4,
  },
  [TILE_TYPES.GRASS]: {
    frames: [...(ANIMATED_TILE_TEXTURE_DATA.grass?.frames ?? [])],
    speed: ANIMATED_TILE_TEXTURE_DATA.grass?.speed ?? 0.55,
  },
};

class SpriteSheet {
  constructor(image, frameWidth, frameHeight) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.columns = Math.max(1, Math.floor(image.width / frameWidth));
    this.rows = Math.max(1, Math.floor(image.height / frameHeight));
  }

  drawFrame(ctx, frameIndex, dx, dy, dw = this.frameWidth, dh = this.frameHeight) {
    const column = frameIndex % this.columns;
    const row = Math.floor(frameIndex / this.columns);
    const sx = column * this.frameWidth;
    const sy = row * this.frameHeight;
    ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, dx, dy, dw, dh);
  }
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scratch = document.createElement('canvas');
    this.scratch.width = FIELD_SIZE;
    this.scratch.height = FIELD_SIZE;
    this.sctx = this.scratch.getContext('2d');
    this.grassTiles = [];
    this.tileTextures = new Map();
    this.animatedTiles = new Map();
    this.tankSheets = new Map();
    this.animationTime = 0;
    this.assetsReady = false;
    this.ready = this.loadAssets();
  }

  drawLevel(level) {
    const ctx = this.sctx;
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, FIELD_SIZE, FIELD_SIZE);
    this.grassTiles = [];
    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[y].length; x++) {
        const tile = level[y][x];
        if (tile === TILE_TYPES.EMPTY) continue;
        if (tile === TILE_TYPES.GRASS) {
          this.grassTiles.push({ x, y });
          continue;
        }
        if (this.assetsReady) {
          const animated = this.animatedTiles.get(tile);
          if (animated?.frames?.length) {
            const frame = this.getAnimatedFrame(tile, x + y);
            if (frame) {
              ctx.drawImage(frame, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
              continue;
            }
          }
          const texture = this.tileTextures.get(tile);
          if (texture) {
            ctx.drawImage(texture, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            continue;
          }
        }
        this.drawTileFallback(ctx, tile, x, y);
      }
    }
  }

  drawTank(ctx, tank) {
    if (this.assetsReady) {
      const key = tank.isPlayer ? 'player' : `enemy_${tank.type || 'basic'}`;
      const sheet = this.tankSheets.get(key);
      if (sheet) {
        const direction = typeof tank.direction === 'number' ? tank.direction : 0;
        const maxFrames = sheet.columns * sheet.rows;
        const frameIndex = ((direction % maxFrames) + maxFrames) % maxFrames;
        sheet.drawFrame(ctx, frameIndex, tank.x, tank.y, tank.width, tank.height);
      } else {
        this.drawTankFallback(ctx, tank);
      }
    } else {
      this.drawTankFallback(ctx, tank);
    }
    if (tank.invincibleTimer > 0) {
      ctx.strokeStyle = COLORS.shield;
      ctx.lineWidth = 2;
      ctx.strokeRect(tank.x + 2, tank.y + 2, tank.width - 4, tank.height - 4);
    }
  }

  drawBullet(ctx, bullet) {
    ctx.fillStyle = COLORS.bullet;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  composite(level, drawables = [], time = 0) {
    this.animationTime = time;
    this.drawLevel(level);
    const ctx = this.ctx;
    ctx.clearRect(0, 0, FIELD_SIZE, FIELD_SIZE);
    ctx.drawImage(this.scratch, 0, 0);
    for (const draw of drawables) {
      draw(ctx);
    }
    this.drawGrassOverlay(ctx);
  }

  drawGrassOverlay(ctx) {
    if (!this.grassTiles.length) return;
    if (this.assetsReady) {
      const animated = this.animatedTiles.get(TILE_TYPES.GRASS);
      if (animated?.frames?.length) {
        for (const tile of this.grassTiles) {
          const variant = (tile.x + tile.y) % animated.frames.length;
          const frame = this.getAnimatedFrame(TILE_TYPES.GRASS, variant);
          if (frame) {
            ctx.drawImage(frame, tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
        return;
      }
    }
    ctx.save();
    ctx.fillStyle = COLORS.grass;
    ctx.globalAlpha = 0.85;
    for (const tile of this.grassTiles) {
      ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = '#2a803f';
      ctx.lineWidth = 1;
      ctx.strokeRect(tile.x * TILE_SIZE + 2, tile.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }
    ctx.restore();
  }

  drawTankFallback(ctx, tank) {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.fillStyle = tank.isPlayer
      ? COLORS.player
      : {
          basic: COLORS.enemyBasic,
          fast: COLORS.enemyFast,
          power: COLORS.enemyPower,
          armor: COLORS.enemyArmor,
        }[tank.type || 'basic'];
    ctx.fillRect(0, 0, tank.width, tank.height);
    ctx.fillStyle = '#333';
    ctx.fillRect(3, 3, tank.width - 6, tank.height - 6);
    ctx.restore();
  }

  drawTileFallback(ctx, tile, x, y) {
    ctx.fillStyle = tileColor(tile);
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    if (tile === TILE_TYPES.WATER) {
      ctx.strokeStyle = '#3366ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x * TILE_SIZE + 3, y * TILE_SIZE + 3, TILE_SIZE - 6, TILE_SIZE - 6);
    }
    if (tile === TILE_TYPES.STEEL) {
      ctx.strokeStyle = '#ffffff44';
      ctx.lineWidth = 1;
      ctx.strokeRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    }
  }

  async loadAssets() {
    const tasks = [];

    for (const [key, src] of Object.entries(TANK_SOURCES)) {
      if (!src) continue;
      tasks.push(
        loadImage(src)
          .then((image) => {
            this.tankSheets.set(key, new SpriteSheet(image, TILE_SIZE, TILE_SIZE));
          })
          .catch((error) => console.warn(`Failed to load tank sprite ${key}`, error))
      );
    }

    for (const [tileType, src] of Object.entries(TILE_SOURCES)) {
      if (!src) continue;
      tasks.push(
        loadImage(src)
          .then((image) => {
            this.tileTextures.set(Number(tileType), image);
          })
          .catch((error) => console.warn(`Failed to load tile texture ${tileType}`, error))
      );
    }

    for (const [tileType, config] of Object.entries(ANIMATED_TILE_SOURCES)) {
      if (!config) continue;
      const frameSources = (config.frames ?? []).filter(Boolean);
      if (!frameSources.length) continue;
      tasks.push(
        Promise.all(
          frameSources.map((frameSrc) =>
            loadImage(frameSrc).catch((error) => {
              console.warn(`Failed to load animated tile frame ${frameSrc}`, error);
              return null;
            }),
          ),
        ).then((frames) => {
          const validFrames = frames.filter(Boolean);
          if (validFrames.length) {
            this.animatedTiles.set(Number(tileType), { frames: validFrames, speed: config.speed });
          }
        })
      );
    }

    await Promise.all(tasks);
    this.assetsReady = true;
  }

  getAnimatedFrame(tileType, variant = 0) {
    const animated = this.animatedTiles.get(tileType);
    if (!animated || !animated.frames.length) return null;
    const offset = variant / Math.max(animated.frames.length, 1);
    const progress = this.animationTime / Math.max(animated.speed, 0.0001) + offset;
    const frameIndex = Math.floor(progress) % animated.frames.length;
    return animated.frames[frameIndex];
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = src;
  });
}

function tileColor(tile) {
  switch (tile) {
    case TILE_TYPES.BRICK:
      return COLORS.brick;
    case TILE_TYPES.STEEL:
      return COLORS.steel;
    case TILE_TYPES.WATER:
      return COLORS.water;
    case TILE_TYPES.GRASS:
      return COLORS.grass;
    case TILE_TYPES.ICE:
      return COLORS.ice;
    case TILE_TYPES.BASE:
      return COLORS.base;
    case TILE_TYPES.EAGLE:
      return COLORS.eagle;
    default:
      return COLORS.background;
  }
}
