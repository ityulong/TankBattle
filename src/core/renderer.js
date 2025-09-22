import { TILE_SIZE, TILE_TYPES, FIELD_SIZE } from './config.js';

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

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scratch = document.createElement('canvas');
    this.scratch.width = FIELD_SIZE;
    this.scratch.height = FIELD_SIZE;
    this.sctx = this.scratch.getContext('2d');
    this.grassTiles = [];
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
    }
  }

  drawTank(ctx, tank) {
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
