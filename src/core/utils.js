import { GRID_SIZE, TILE_SIZE } from './config.js';

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function formatScore(value) {
  return value.toString().padStart(6, '0');
}

export function formatStage(value) {
  return value.toString().padStart(2, '0');
}

export function tileToCoord(tile) {
  return tile * TILE_SIZE;
}

export function coordToTile(coord) {
  return Math.floor(coord / TILE_SIZE);
}

export function isInsideField(x, y) {
  return x >= 0 && y >= 0 && x < GRID_SIZE * TILE_SIZE && y < GRID_SIZE * TILE_SIZE;
}

export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function randomChoice(values) {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
}
