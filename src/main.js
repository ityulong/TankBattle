import { Game } from './game/game.js';

const canvas = document.getElementById('game-canvas');
const overlay = document.getElementById('ui-overlay');
const hud = {
  score: document.getElementById('hud-player-score'),
  hiScore: document.getElementById('hud-hi-score'),
  stage: document.getElementById('hud-stage'),
};

const game = new Game({ canvas, overlay, hud });

// Expose the game instance for automated smoke tests and debugging.
// This allows Playwright-based checks to trigger gameplay actions
// (e.g. spawning power-ups) without relying on manual input.
window.__tankBattleGame = game;

game.init().then(() => {
  game.start();
});
