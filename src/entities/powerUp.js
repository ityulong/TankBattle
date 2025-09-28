import { TILE_SIZE } from '../core/config.js';
import { drawPowerUpIcon } from '../core/powerUpIcons.js';

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
    drawPowerUpIcon(ctx, this.type, this.x, this.y, this.width);
  }
}
