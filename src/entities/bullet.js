import { TILE_SIZE, DIRECTION, TILE_TYPES } from '../core/config.js';
import { coordToTile, isInsideField } from '../core/utils.js';

export class Bullet {
  constructor({ owner, speed, power }) {
    this.owner = owner;
    this.speed = speed;
    this.power = power;
    this.width = TILE_SIZE / 2;
    this.height = TILE_SIZE / 2;
    this.direction = owner.direction;
    this.alive = true;
    const offset = (TILE_SIZE - this.width) / 2;
    this.x = owner.x + offset;
    this.y = owner.y + offset;
  }

  update(dt, context) {
    if (!this.alive) return;
    const velocity = this.speed * dt;
    if (this.direction === DIRECTION.UP) this.y -= velocity;
    if (this.direction === DIRECTION.DOWN) this.y += velocity;
    if (this.direction === DIRECTION.LEFT) this.x -= velocity;
    if (this.direction === DIRECTION.RIGHT) this.x += velocity;

    if (!isInsideField(this.x, this.y) || !isInsideField(this.x + this.width, this.y + this.height)) {
      this.destroy(context);
      return;
    }
    handleTileCollision(this, context);
    if (!this.alive) return;
    handleEntityCollision(this, context);
  }

  destroy(context) {
    if (!this.alive) return;
    this.alive = false;
    if (this.owner) {
      this.owner.bullets.delete(this);
    }
    if (context) {
      context.onBulletDestroyed?.(this);
    }
  }

  render(ctx, tileRenderer) {
    if (!this.alive) return;
    tileRenderer.drawBullet(ctx, this);
  }
}

function handleTileCollision(bullet, context) {
  const { tileResolver, level } = context;
  const left = coordToTile(bullet.x);
  const top = coordToTile(bullet.y);
  const right = coordToTile(bullet.x + bullet.width - 1);
  const bottom = coordToTile(bullet.y + bullet.height - 1);
  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      const tile = level[row][col];
      if (tileResolver.isBulletBlocking(tile)) {
        const destroyed = tileResolver.hitTile(level, row, col, bullet.power);
        if (destroyed) {
          context.addExplosion(tileToCenter(col), tileToCenter(row));
        }
        bullet.destroy(context);
        return;
      }
      if (tile === TILE_TYPES.EAGLE) {
        level[row][col] = TILE_TYPES.EMPTY;
        context.onBaseHit();
        bullet.destroy(context);
        return;
      }
    }
  }
}

function handleEntityCollision(bullet, context) {
  const targets = bullet.owner.isPlayer ? context.enemies : [context.player, ...context.friendlies];
  for (const target of targets) {
    if (!target || !target.alive || target === bullet.owner) continue;
    if (rectOverlap(bullet, target)) {
      const lethal = target.damage(bullet.power);
      bullet.destroy(context);
      if (lethal) {
        context.onTankDestroyed?.(target, bullet.owner);
      }
      return;
    }
  }
  if (!bullet.owner.isPlayer) {
    const playerBullets = context.player?.bullets;
    if (playerBullets) {
      for (const other of playerBullets) {
        if (other !== bullet && other.alive && rectOverlap(bullet, other)) {
          bullet.destroy(context);
          other.destroy(context);
          context.addExplosion(bullet.x, bullet.y);
          return;
        }
      }
    }
  }
}

function tileToCenter(tileIndex) {
  return tileIndex * TILE_SIZE + TILE_SIZE / 2;
}

function rectOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
