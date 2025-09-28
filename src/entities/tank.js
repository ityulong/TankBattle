import { TILE_SIZE, DIRECTION, ENEMY_TYPES } from '../core/config.js';
import { clamp, coordToTile, isInsideField, randomChoice } from '../core/utils.js';

export class Tank {
  constructor({ x, y, speed = 1, direction = DIRECTION.UP, isPlayer = false }) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.speed = speed;
    this.direction = direction;
    this.isPlayer = isPlayer;
    this.cooldown = 0;
    this.maxBullets = isPlayer ? 1 : 1;
    this.bullets = new Set();
    this.invincibleTimer = 0;
    this.frozen = 0;
    this.alive = true;
  }

  update(dt, context) {
    if (!this.alive) return;
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
    }
    if (this.frozen > 0) {
      this.frozen -= dt;
      return;
    }
    if (!this.isPlayer) {
      this.aiUpdate(dt, context);
    }
    this.move(dt, context);
    if (this.cooldown > 0) {
      this.cooldown -= dt;
    }
  }

  move(dt, context) {
    const velocity = this.speed * dt;
    let nextX = this.x;
    let nextY = this.y;
    if (this.direction === DIRECTION.UP) nextY -= velocity;
    if (this.direction === DIRECTION.DOWN) nextY += velocity;
    if (this.direction === DIRECTION.LEFT) nextX -= velocity;
    if (this.direction === DIRECTION.RIGHT) nextX += velocity;

    if (canMoveTo(nextX, nextY, this.width, this.height, context)) {
      this.x = clamp(nextX, 0, context.bounds - this.width);
      this.y = clamp(nextY, 0, context.bounds - this.height);
    } else if (!this.isPlayer) {
      this.direction = randomChoice([DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT]);
    }
  }

  aiUpdate(_dt, context) {
    if (context.time % 2 < 0.02) {
      this.direction = randomChoice([DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT]);
    }
    if (context.player && context.player.alive) {
      if (this.cooldown <= 0 && this.bullets.size < this.maxBullets) {
        if (Math.random() < 0.01) {
          this.fire(context.createBullet);
        }
      }
    }
  }

  fire(createBullet) {
    if (this.cooldown > 0 || this.bullets.size >= this.maxBullets) return;
    const bullet = createBullet(this);
    if (bullet) {
      this.bullets.add(bullet);
      this.cooldown = this.isPlayer ? 0.35 : 0.5;
    }
  }

  render(ctx, tileRenderer) {
    if (!this.alive) return;
    tileRenderer.drawTank(ctx, this);
  }

  damage(power = 1) {
    if (this.invincibleTimer > 0) return false;
    if (this.hitPoints != null) {
      this.hitPoints -= power;
      if (this.hitPoints > 0) {
        return false;
      }
    }
    this.alive = false;
    return true;
  }

  grantShield(duration) {
    this.invincibleTimer = Math.max(this.invincibleTimer, duration);
  }
}

function canMoveTo(x, y, width, height, context) {
  if (!isInsideField(x, y) || !isInsideField(x + width - 1, y + height - 1)) {
    return false;
  }
  const tileSize = TILE_SIZE;
  const left = coordToTile(x);
  const top = coordToTile(y);
  const right = coordToTile(x + width - 1);
  const bottom = coordToTile(y + height - 1);
  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      const tile = context.level[row][col];
      if (!context.tileResolver.isPassable(tile)) {
        return false;
      }
    }
  }
  for (const tank of context.tanks) {
    if (tank === context.self || !tank.alive) continue;
    if (rectOverlap(x, y, width, height, tank.x, tank.y, tank.width, tank.height)) {
      return false;
    }
  }
  return true;
}

function rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

export class PlayerTank extends Tank {
  constructor({ x, y }) {
    super({ x, y, speed: 60, direction: DIRECTION.UP, isPlayer: true });
    this.level = 0;
    this.lives = 3;
    this.maxBullets = 1;
  }

  move(dt, context) {
    const input = context.input;
    let movingDirection = null;
    if (input.isPressed('up')) movingDirection = DIRECTION.UP;
    else if (input.isPressed('down')) movingDirection = DIRECTION.DOWN;
    else if (input.isPressed('left')) movingDirection = DIRECTION.LEFT;
    else if (input.isPressed('right')) movingDirection = DIRECTION.RIGHT;

    if (movingDirection) {
      this.direction = movingDirection;
    }

    const speedMultiplier = 1 + this.level * 0.15;
    const velocity = this.speed * speedMultiplier * dt;
    let nextX = this.x;
    let nextY = this.y;
    switch (movingDirection) {
      case DIRECTION.UP:
        nextY -= velocity;
        break;
      case DIRECTION.DOWN:
        nextY += velocity;
        break;
      case DIRECTION.LEFT:
        nextX -= velocity;
        break;
      case DIRECTION.RIGHT:
        nextX += velocity;
        break;
    }

    const canMove = canMoveTo(nextX, nextY, this.width, this.height, {
      ...context,
      self: this,
    });
    if (canMove) {
      this.x = clamp(nextX, 0, context.bounds - this.width);
      this.y = clamp(nextY, 0, context.bounds - this.height);
    }

    if (input.isPressed('fire')) {
      this.fire(context.createBullet);
    }
  }

  fire(createBullet) {
    this.maxBullets = this.level >= 2 ? 2 : 1;
    this.cooldown = this.level >= 3 ? 0.15 : 0.2;
    super.fire(createBullet);
  }

  upgrade() {
    this.level = Math.min(3, this.level + 1);
  }

  reset(position) {
    this.x = position.x;
    this.y = position.y;
    this.direction = DIRECTION.UP;
    this.cooldown = 0;
    this.alive = true;
    this.invincibleTimer = 2;
    this.bullets.clear();
  }
}

export class EnemyTank extends Tank {
  constructor({ x, y, type, spawnShield = 2 }) {
    const baseSpeed = {
      [ENEMY_TYPES.BASIC]: 50,
      [ENEMY_TYPES.FAST]: 70,
      [ENEMY_TYPES.POWER]: 55,
      [ENEMY_TYPES.ARMOR]: 40,
    }[type];
    super({ x, y, speed: baseSpeed, direction: DIRECTION.DOWN, isPlayer: false });
    this.type = type;
    this.hitPoints = {
      [ENEMY_TYPES.BASIC]: 1,
      [ENEMY_TYPES.FAST]: 1,
      [ENEMY_TYPES.POWER]: 1,
      [ENEMY_TYPES.ARMOR]: 4,
    }[type];
    this.bulletPower = {
      [ENEMY_TYPES.BASIC]: 1,
      [ENEMY_TYPES.FAST]: 1,
      [ENEMY_TYPES.POWER]: 2,
      [ENEMY_TYPES.ARMOR]: 1,
    }[type];
    this.maxBullets = this.type === ENEMY_TYPES.POWER ? 2 : 1;
    this.invincibleTimer = spawnShield;
    this.scoreValue = {
      [ENEMY_TYPES.BASIC]: 100,
      [ENEMY_TYPES.FAST]: 200,
      [ENEMY_TYPES.POWER]: 300,
      [ENEMY_TYPES.ARMOR]: 400,
    }[type];
  }

  aiUpdate(dt, context) {
    if (this.frozen > 0) {
      this.frozen -= dt;
      return;
    }
    const { player } = context;
    const changeDirChance = this.type === ENEMY_TYPES.FAST ? 0.02 : 0.01;
    if (Math.random() < changeDirChance) {
      this.direction = randomChoice([DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT]);
    }
    if (player && player.alive) {
      const alignHorizontally = Math.abs(player.x - this.x) < TILE_SIZE;
      const alignVertically = Math.abs(player.y - this.y) < TILE_SIZE;
      if (alignHorizontally) {
        this.direction = player.y < this.y ? DIRECTION.UP : DIRECTION.DOWN;
      } else if (alignVertically) {
        this.direction = player.x < this.x ? DIRECTION.LEFT : DIRECTION.RIGHT;
      }
      if (this.cooldown <= 0 && this.bullets.size < this.maxBullets) {
        if (alignHorizontally || alignVertically || Math.random() < 0.02) {
          this.fire(context.createBullet);
        }
      }
    }
  }
}
