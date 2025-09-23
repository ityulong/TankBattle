import { TILE_SIZE, POWER_UP_TYPES } from '../core/config.js';

const COLORS = {
  [POWER_UP_TYPES.HELMET]: '#ffe066',
  [POWER_UP_TYPES.TIMER]: '#66d9ff',
  [POWER_UP_TYPES.SHOVEL]: '#d4b483',
  [POWER_UP_TYPES.STAR]: '#f8f005',
  [POWER_UP_TYPES.GRENADE]: '#ff6b6b',
  [POWER_UP_TYPES.TANK]: '#6bc56b',
  [POWER_UP_TYPES.GUN]: '#ffb347',
};

export class PowerUp {
  constructor({ type, x, y }) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.alive = true;
    this.timer = 10; // seconds before disappearing
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.alive = false;
    }
  }

  render(ctx) {
    if (!this.alive) return;
    ctx.fillStyle = COLORS[this.type] || '#fff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#222';
    ctx.font = '12px monospace';
    ctx.textBaseline = 'bottom';
    ctx.fillText(this.type[0].toUpperCase(), this.x + 4, this.y + TILE_SIZE - 4);
  }
}
