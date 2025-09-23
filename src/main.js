import { Game } from './game/game.js';

const canvas = document.getElementById('game-canvas');
const overlay = document.getElementById('ui-overlay');
const hud = {
  score: document.getElementById('hud-player-score'),
  hiScore: document.getElementById('hud-hi-score'),
  stage: document.getElementById('hud-stage'),
};

const game = new Game({ canvas, overlay, hud });

game.init().then(() => {
  game.start();
});
