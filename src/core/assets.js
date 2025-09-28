const resolvePath = (relativePath) => new URL(`../${relativePath}`, import.meta.url).href;

const DEFAULT_MANIFEST = {
  tiles: {
    brick: resolvePath('assets/svg/tiles/brick.svg'),
    steel: resolvePath('assets/svg/tiles/steel.svg'),
    water: resolvePath('assets/svg/tiles/water.svg'),
    grass: resolvePath('assets/svg/tiles/grass.svg'),
    ice: resolvePath('assets/svg/tiles/ice.svg'),
    base: resolvePath('assets/svg/tiles/base.svg'),
    eagle: resolvePath('assets/svg/tiles/eagle.svg'),
  },
  tanks: {
    player: resolvePath('assets/svg/tanks/player.svg'),
    enemies: {
      basic: resolvePath('assets/svg/tanks/enemy-basic.svg'),
      fast: resolvePath('assets/svg/tanks/enemy-fast.svg'),
      power: resolvePath('assets/svg/tanks/enemy-power.svg'),
      armor: resolvePath('assets/svg/tanks/enemy-armor.svg'),
    },
  },
  effects: {
    bullet: resolvePath('assets/svg/effects/bullet.svg'),
    shield: resolvePath('assets/svg/effects/shield.svg'),
  },
  powerUps: {
    helmet: resolvePath('assets/svg/powerups/helmet.svg'),
    timer: resolvePath('assets/svg/powerups/timer.svg'),
    shovel: resolvePath('assets/svg/powerups/shovel.svg'),
    star: resolvePath('assets/svg/powerups/star.svg'),
    grenade: resolvePath('assets/svg/powerups/grenade.svg'),
    tank: resolvePath('assets/svg/powerups/tank.svg'),
    gun: resolvePath('assets/svg/powerups/gun.svg'),
  },
};

export async function loadSvgSprites(manifest = DEFAULT_MANIFEST) {
  return await traverseManifest(manifest);
}

export { DEFAULT_MANIFEST as ASSET_MANIFEST };

async function traverseManifest(node) {
  if (typeof node === 'string') {
    const src = node;
    const image = await loadSvg(src);
    return { image, src };
  }

  if (Array.isArray(node)) {
    return Promise.all(node.map((value) => traverseManifest(value)));
  }

  const entries = await Promise.all(
    Object.entries(node).map(async ([key, value]) => {
      const resolved = await traverseManifest(value);
      return [key, resolved];
    })
  );
  return Object.fromEntries(entries);
}

async function loadSvg(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`无法加载资源 ${url}: ${response.status}`);
  }
  const blob = await response.blob();
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(blob);
    } catch (error) {
      console.warn(`createImageBitmap 解析 ${url} 失败，改用 <img> 回退。`, error);
    }
  }
  return await blobToImage(blob);
}

function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    image.src = url;
  });
}
