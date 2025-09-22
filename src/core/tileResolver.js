import { TILE_TYPES } from './config.js';

export class TileResolver {
  isPassable(tile) {
    return tile === TILE_TYPES.EMPTY || tile === TILE_TYPES.GRASS || tile === TILE_TYPES.ICE;
  }

  isBulletBlocking(tile) {
    return (
      tile === TILE_TYPES.BRICK ||
      tile === TILE_TYPES.STEEL ||
      tile === TILE_TYPES.WATER ||
      tile === TILE_TYPES.BASE
    );
  }

  hitTile(level, row, col, power = 1) {
    const tile = level[row][col];
    if (tile === TILE_TYPES.BRICK) {
      level[row][col] = TILE_TYPES.EMPTY;
      return true;
    }
    if (tile === TILE_TYPES.STEEL && power > 1) {
      level[row][col] = TILE_TYPES.EMPTY;
      return true;
    }
    if (tile === TILE_TYPES.BASE) {
      level[row][col] = TILE_TYPES.EMPTY;
      return true;
    }
    return false;
  }
}
