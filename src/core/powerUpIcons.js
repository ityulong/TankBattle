import { POWER_UP_TYPES, TILE_SIZE } from './config.js';

const POWER_UP_ASSET_URLS = {
  [POWER_UP_TYPES.HELMET]: new URL('../assets/powerups/helmet.svg', import.meta.url).href,
  [POWER_UP_TYPES.TIMER]: new URL('../assets/powerups/timer.svg', import.meta.url).href,
  [POWER_UP_TYPES.SHOVEL]: new URL('../assets/powerups/shovel.svg', import.meta.url).href,
  [POWER_UP_TYPES.STAR]: new URL('../assets/powerups/star.svg', import.meta.url).href,
  [POWER_UP_TYPES.GRENADE]: new URL('../assets/powerups/grenade.svg', import.meta.url).href,
  [POWER_UP_TYPES.TANK]: new URL('../assets/powerups/tank.svg', import.meta.url).href,
  [POWER_UP_TYPES.GUN]: new URL('../assets/powerups/gun.svg', import.meta.url).href,
};

const ICON_IMAGE_CACHE = new Map();

function getPowerUpIconImage(type) {
  if (typeof Image === 'undefined' || !POWER_UP_ASSET_URLS[type]) {
    return null;
  }
  if (!ICON_IMAGE_CACHE.has(type)) {
    const image = new Image();
    image.src = POWER_UP_ASSET_URLS[type];
    ICON_IMAGE_CACHE.set(type, image);
  }
  return ICON_IMAGE_CACHE.get(type);
}

export function drawPowerUpIcon(ctx, type, x, y, size = TILE_SIZE) {
  const image = getPowerUpIconImage(type);
  if (!image) return;

  if (!image.complete) {
    if (!image.decodePromise && typeof image.decode === 'function') {
      image.decodePromise = image
        .decode()
        .catch(() => {
          /* ignore decode errors and allow natural loading */
        });
    }
    return;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, x, y, size, size);
  ctx.restore();
}

export function getPowerUpIconDataURL(type) {
  return POWER_UP_ASSET_URLS[type] ?? '';
}

export function preloadPowerUpIcons() {
  if (typeof Image === 'undefined') return;
  Object.keys(POWER_UP_ASSET_URLS).forEach((key) => {
    getPowerUpIconImage(key);
  });
}
