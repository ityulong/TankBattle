import { Game } from './game/game.js';
import { loadSvgSprites } from './core/assets.js';

const canvas = document.getElementById('game-canvas');
const overlay = document.getElementById('ui-overlay');
const hud = {
  score: document.getElementById('hud-player-score'),
  hiScore: document.getElementById('hud-hi-score'),
  stage: document.getElementById('hud-stage'),
};

const game = new Game({ canvas, overlay, hud });

async function bootstrap() {
  overlay.classList.add('active');
  overlay.innerHTML = '<div class="title">资源加载中...</div>';
  try {
    const assets = await loadSvgSprites();
    game.setAssets(assets);
  } catch (error) {
    console.error('加载 SVG 资源失败', error);
    overlay.innerHTML = '<div class="title">资源加载失败</div><div>请刷新页面重试</div>';
    return;
  }

  try {
    await game.init();
  } catch (error) {
    console.warn('游戏初始化失败，继续以静音模式运行。', error);
    game.audio?.setEnabled(false);
  }
  game.start();
}

bootstrap();
