import { TILE_SIZE, TILE_TYPES, FIELD_SIZE, DIRECTION, ENEMY_TYPES } from './config.js';

const COLORS = {
  background: '#000',
  fallback: {
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
  },
};

const DIRECTION_ANGLE = {
  [DIRECTION.UP]: 0,
  [DIRECTION.RIGHT]: Math.PI / 2,
  [DIRECTION.DOWN]: Math.PI,
  [DIRECTION.LEFT]: -Math.PI / 2,
};

export class Renderer {
  constructor(canvas, assets = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scratch = document.createElement('canvas');
    this.scratch.width = FIELD_SIZE;
    this.scratch.height = FIELD_SIZE;
    this.sctx = this.scratch.getContext('2d');
    this.grassTiles = [];
    this.setAssets(assets);
    this.ctx.imageSmoothingEnabled = false;
    this.sctx.imageSmoothingEnabled = false;
  }

  drawLevel(level) {
    const ctx = this.sctx;
    ctx.clearRect(0, 0, FIELD_SIZE, FIELD_SIZE);
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
        const sprite = this.getTileSprite(tile);
        if (sprite) {
          ctx.drawImage(sprite, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        } else {
          ctx.fillStyle = tileColor(tile);
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  drawTank(ctx, tank) {
    const sprite = this.getTankSprite(tank);
    if (sprite) {
      const centerX = tank.x + tank.width / 2;
      const centerY = tank.y + tank.height / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      const angle = DIRECTION_ANGLE[tank.direction] ?? 0;
      ctx.rotate(angle);
      ctx.drawImage(sprite, -tank.width / 2, -tank.height / 2, tank.width, tank.height);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(tank.x, tank.y);
      ctx.fillStyle = tank.isPlayer
        ? COLORS.fallback.player
        : {
            [ENEMY_TYPES.BASIC]: COLORS.fallback.enemyBasic,
            [ENEMY_TYPES.FAST]: COLORS.fallback.enemyFast,
            [ENEMY_TYPES.POWER]: COLORS.fallback.enemyPower,
            [ENEMY_TYPES.ARMOR]: COLORS.fallback.enemyArmor,
          }[tank.type || ENEMY_TYPES.BASIC];
      ctx.fillRect(0, 0, tank.width, tank.height);
      ctx.fillStyle = '#333';
      ctx.fillRect(3, 3, tank.width - 6, tank.height - 6);
      ctx.restore();
    }
    if (tank.invincibleTimer > 0) {
      const shield = this.effectSprites?.shield;
      if (shield) {
        const alpha = 0.6 + 0.3 * Math.sin(Date.now() / 120);
        ctx.save();
        ctx.globalAlpha = Math.max(0.4, alpha);
        ctx.drawImage(
          shield,
          tank.x + tank.width / 2 - TILE_SIZE,
          tank.y + tank.height / 2 - TILE_SIZE,
          TILE_SIZE * 2,
          TILE_SIZE * 2
        );
        ctx.restore();
      } else {
        ctx.strokeStyle = COLORS.fallback.shield;
        ctx.lineWidth = 2;
        ctx.strokeRect(tank.x + 2, tank.y + 2, tank.width - 4, tank.height - 4);
      }
    }
  }

  drawBullet(ctx, bullet) {
    const sprite = this.effectSprites?.bullet;
    if (sprite) {
      const centerX = bullet.x + bullet.width / 2;
      const centerY = bullet.y + bullet.height / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      const angle = DIRECTION_ANGLE[bullet.direction] ?? 0;
      ctx.rotate(angle);
      ctx.drawImage(sprite, -bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
      ctx.restore();
    } else {
      ctx.fillStyle = COLORS.fallback.bullet;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
  }

  composite(level, drawables = []) {
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
    ctx.save();
    const sprite = this.tileSprites?.[TILE_TYPES.GRASS];
    ctx.globalAlpha = 0.9;
    for (const tile of this.grassTiles) {
      if (sprite) {
        ctx.drawImage(sprite, tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = COLORS.fallback.grass;
        ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    ctx.restore();
  }

  setAssets(assets) {
    this.assets = assets;
    this.tileSprites = assets
      ? {
          [TILE_TYPES.BRICK]: assets.tiles?.brick?.image,
          [TILE_TYPES.STEEL]: assets.tiles?.steel?.image,
          [TILE_TYPES.WATER]: assets.tiles?.water?.image,
          [TILE_TYPES.GRASS]: assets.tiles?.grass?.image,
          [TILE_TYPES.ICE]: assets.tiles?.ice?.image,
          [TILE_TYPES.BASE]: assets.tiles?.base?.image,
          [TILE_TYPES.EAGLE]: assets.tiles?.eagle?.image,
        }
      : {};
    this.tankSprites = assets
      ? {
          player: assets.tanks?.player?.image,
          enemies: {
            [ENEMY_TYPES.BASIC]: assets.tanks?.enemies?.basic?.image,
            [ENEMY_TYPES.FAST]: assets.tanks?.enemies?.fast?.image,
            [ENEMY_TYPES.POWER]: assets.tanks?.enemies?.power?.image,
            [ENEMY_TYPES.ARMOR]: assets.tanks?.enemies?.armor?.image,
          },
        }
      : null;
    this.effectSprites = assets
      ? {
          bullet: assets.effects?.bullet?.image,
          shield: assets.effects?.shield?.image,
        }
      : null;
  }

  getTileSprite(tile) {
    return this.tileSprites?.[tile] ?? null;
  }

  getTankSprite(tank) {
    if (tank.isPlayer) {
      return this.tankSprites?.player ?? null;
    }
    return this.tankSprites?.enemies?.[tank.type || ENEMY_TYPES.BASIC] ?? null;
  }
}

function tileColor(tile) {
  switch (tile) {
    case TILE_TYPES.BRICK:
      return COLORS.fallback.brick;
    case TILE_TYPES.STEEL:
      return COLORS.fallback.steel;
    case TILE_TYPES.WATER:
      return COLORS.fallback.water;
    case TILE_TYPES.GRASS:
      return COLORS.fallback.grass;
    case TILE_TYPES.ICE:
      return COLORS.fallback.ice;
    case TILE_TYPES.BASE:
      return COLORS.fallback.base;
    case TILE_TYPES.EAGLE:
      return COLORS.fallback.eagle;
    default:
      return COLORS.background;
  }
}
