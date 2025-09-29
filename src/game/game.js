import { Input } from '../core/input.js';
import { Renderer } from '../core/renderer.js';
import { TileResolver } from '../core/tileResolver.js';
import { AudioManager } from '../audio/audioManager.js';
import {
  TILE_SIZE,
  FIELD_SIZE,
  GAME_STATES,
  PLAYER_BASE_LIVES,
  MAX_ENEMIES_ON_FIELD,
  TOTAL_ENEMIES_PER_STAGE,
  POWER_UP_TYPES,
  ENEMY_TYPES,
  TILE_TYPES,
} from '../core/config.js';
import { LEVELS } from '../data/levels.js';
import { ENEMY_SPAWN_TABLE } from '../data/spawnTables.js';
import { PlayerTank, EnemyTank } from '../entities/tank.js';
import { Bullet } from '../entities/bullet.js';
import { PowerUp } from '../entities/powerUp.js';
import { Explosion } from '../entities/explosion.js';
import { formatScore, formatStage, deepClone, randomChoice } from '../core/utils.js';

const SPAWN_POSITIONS = [
  { x: TILE_SIZE, y: TILE_SIZE },
  { x: FIELD_SIZE / 2 - TILE_SIZE / 2, y: TILE_SIZE },
  { x: FIELD_SIZE - TILE_SIZE * 2, y: TILE_SIZE },
];

const POWER_UP_SEQUENCE = [
  POWER_UP_TYPES.STAR,
  POWER_UP_TYPES.HELMET,
  POWER_UP_TYPES.TIMER,
  POWER_UP_TYPES.GRENADE,
  POWER_UP_TYPES.TANK,
  POWER_UP_TYPES.SHOVEL,
  POWER_UP_TYPES.GUN,
];

const POWER_UP_DETAILS = [
  {
    type: POWER_UP_TYPES.HELMET,
    name: '头盔',
    description: '获得 10 秒护盾，短暂无敌。',
  },
  {
    type: POWER_UP_TYPES.TIMER,
    name: '计时器',
    description: '冻结所有敌军 5 秒。',
  },
  {
    type: POWER_UP_TYPES.SHOVEL,
    name: '铁锹',
    description: '将基地四周加固为钢墙，持续 15 秒。',
  },
  {
    type: POWER_UP_TYPES.STAR,
    name: '星星',
    description: '升级武器，提升坦克火力。',
  },
  {
    type: POWER_UP_TYPES.GRENADE,
    name: '手雷',
    description: '瞬间消灭场上的所有敌人。',
  },
  {
    type: POWER_UP_TYPES.TANK,
    name: '坦克',
    description: '增加一条命。',
  },
  {
    type: POWER_UP_TYPES.GUN,
    name: '双枪',
    description: '火力直升满级，可同时发射两发子弹。',
  },
];

function buildPowerUpHelpHTML(assets) {
  return POWER_UP_DETAILS.map(({ type, name, description }) => {
    const iconSrc = assets?.powerUps?.[type]?.src;
    const iconMarkup = iconSrc
      ? `<img src="${iconSrc}" alt="${name}" class="help-item-icon" loading="lazy" />`
      : '';
    return `
      <div class="help-item">
        ${iconMarkup}
        <div class="help-item-content">
          <div class="help-item-title">${name}</div>
          <div class="help-item-description">${description}</div>
        </div>
      </div>
    `;
  }).join('');
}

const STAGE_TRACKS = [
  'ode_to_joy',
  'fur_elise',
  'canon_in_d',
  'turkish_march',
  'greensleeves',
  'swan_lake',
  'blue_danube',
  'gymnopedie',
  'entertainer',
  'clair_de_lune',
  'air_on_g',
  'jesu_joy',
  'spring_vivaldi',
  'morning_mood',
  'hungarian_dance',
  'william_tell',
  'bolero',
  'sugar_plum',
  'waltz_flowers',
  'radetzky_march',
  'moonlight_sonata',
  'ave_maria',
  'nessun_dorma',
  'habanera',
  'toreador_march',
  'la_cucaracha',
  'scarborough_fair',
  'sakura',
  'auld_lang_syne',
  'silent_night',
  'amazing_grace',
  'frere_jacques',
  'twinkle_twinkle',
  'happy_birthday',
  'pomp_and_circumstance',
];

const POWER_TILE_BRICK = [
  TILE_TYPES.BRICK,
  TILE_TYPES.BRICK,
  TILE_TYPES.BASE,
  TILE_TYPES.BRICK,
  TILE_TYPES.BRICK,
];
const POWER_TILE_STEEL = [
  TILE_TYPES.STEEL,
  TILE_TYPES.STEEL,
  TILE_TYPES.BASE,
  TILE_TYPES.STEEL,
  TILE_TYPES.STEEL,
];

export class Game {
  constructor({ canvas, overlay, hud }) {
    this.canvas = canvas;
    this.overlay = overlay;
    this.hud = hud;

    this.input = new Input();
    this.input.install();

    this.renderer = new Renderer(canvas);
    this.tileResolver = new TileResolver();
    this.audio = new AudioManager();

    this.currentState = GAME_STATES.MENU;
    this.levelIndex = 0;
    this.hiScore = 0;
    this.score = 0;
    this.stageScore = 0;
    this.lastCompletedStage = -1;
    this.killStats = {
      [ENEMY_TYPES.BASIC]: 0,
      [ENEMY_TYPES.FAST]: 0,
      [ENEMY_TYPES.POWER]: 0,
      [ENEMY_TYPES.ARMOR]: 0,
    };

    this.menuMode = 'main';
    this.menuHelpPressed = false;
    this.assets = null;
    this.helpListHTML = buildPowerUpHelpHTML();

    this.resetStageRuntime();

    this.lastTime = 0;
    this.running = false;

    this.setupOverlayInteractions();
    this.setupHudBindings();
    this.attachAudioControls();

    this.stageMusicTimer = null;
    this.currentStageTrack = null;
  }

  async init() {
    await this.audio.init();
    this.audio.playTheme('intro', { loop: true });
  }

  start() {
    this.running = true;
    requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000 || 0, 0.05);
    this.lastTime = time;
    this.update(dt);
    this.render();
    requestAnimationFrame((next) => this.loop(next));
  }

  update(dt) {
    switch (this.currentState) {
      case GAME_STATES.MENU:
        this.updateMenu();
        break;
      case GAME_STATES.STAGE_INTRO:
        this.updateStageIntro(dt);
        break;
      case GAME_STATES.PLAYING:
        this.updatePlaying(dt);
        break;
      case GAME_STATES.PAUSED:
        this.updatePaused();
        break;
      case GAME_STATES.GAME_OVER:
        this.updateGameOver(dt);
        break;
      case GAME_STATES.SCORE:
        this.updateScore();
        break;
    }
  }

  render() {
    const drawables = [];
    if (this.currentState === GAME_STATES.PLAYING || this.currentState === GAME_STATES.PAUSED) {
      drawables.push((ctx) => this.player?.render(ctx, this.renderer));
      for (const enemy of this.enemies) {
        drawables.push((ctx) => enemy.render(ctx, this.renderer));
      }
      for (const bullet of this.getAllBullets()) {
        drawables.push((ctx) => bullet.render(ctx, this.renderer));
      }
      for (const powerUp of this.powerUps) {
        drawables.push((ctx) => powerUp.render(ctx, this.assets));
      }
      for (const explosion of this.explosions) {
        drawables.push((ctx) => explosion.render(ctx));
      }
    }
    this.renderer.composite(this.level, drawables);
  }

  updateMenu() {
    const helpPressed = this.input.isPressed('help');
    if (helpPressed && !this.menuHelpPressed) {
      this.menuMode = this.menuMode === 'help' ? 'main' : 'help';
      this.menuHelpPressed = true;
    } else if (!helpPressed && this.menuHelpPressed) {
      this.menuHelpPressed = false;
    }

    this.overlay.classList.add('active');

    if (this.menuMode === 'help') {
      this.overlay.innerHTML = `
        <div class="title">道具介绍</div>
        <div class="help-list">${this.helpListHTML}</div>
        <div class="menu-option" data-action="back">返回菜单</div>
        <div class="menu-hint">按 H 返回主菜单</div>
      `;
      this.overlay.onclick = (event) => {
        if (event.target.dataset?.action === 'back') {
          this.menuMode = 'main';
        }
      };
      return;
    }

    this.overlay.innerHTML = `
      <div class="title">BATTLE CITY</div>
      <div class="menu-option" data-action="start">1 PLAYER</div>
      <div class="menu-option" data-action="toggle-audio">音效：${this.audio.enabled ? '开' : '关'}</div>
      <div class="menu-hint">按 H 查看道具介绍</div>
    `;
    this.overlay.onclick = (event) => {
      const action = event.target.dataset?.action;
      if (action === 'start') {
        this.startNewGame();
      } else if (action === 'toggle-audio') {
        this.audio.setEnabled(!this.audio.enabled);
        this.overlay.querySelector('[data-action="toggle-audio"]').textContent = `音效：${
          this.audio.enabled ? '开' : '关'
        }`;
      }
    };
    this.input.once('fire', () => this.startNewGame());
  }

  setAssets(assets) {
    this.assets = assets;
    this.renderer.setAssets(assets);
    this.helpListHTML = buildPowerUpHelpHTML(assets);
  }

  updateStageIntro(dt) {
    this.overlay.innerHTML = `<div class="title">STAGE ${formatStage(this.levelIndex + 1)}</div>`;
    this.overlay.classList.add('active');
    this.stageIntroTimer -= dt;
    if (this.stageIntroTimer <= 0) {
      this.overlay.classList.remove('active');
      this.setState(GAME_STATES.PLAYING);
    }
  }

  updatePlaying(dt) {
    this.overlay.classList.remove('active');
    this.time = (this.time || 0) + dt;
    if (this.input.isPressed('pause')) {
      this.togglePause();
      return;
    }

    this.player.update(dt, this.createPlayerContext());

    for (const enemy of this.enemies) {
      enemy.update(dt, this.createEnemyContext(enemy));
    }

    if (this.freezeTimer > 0) {
      this.freezeTimer -= dt;
      if (this.freezeTimer <= 0) {
        for (const enemy of this.enemies) {
          enemy.frozen = 0;
        }
      }
    }

    for (const bullet of this.getAllBullets()) {
      bullet.update(dt, this.createBulletContext());
    }

    this.powerUps = this.powerUps.filter((powerUp) => {
      if (this.player && powerUp.alive && intersects(this.player, powerUp)) {
        powerUp.alive = false;
        this.collectPowerUp(powerUp);
      }
      powerUp.update(dt);
      return powerUp.alive;
    });

    this.explosions = this.explosions.filter((explosion) => {
      explosion.update(dt);
      return explosion.alive;
    });

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnNextEnemy();
      this.spawnTimer = 3;
    }

    this.updateShovelTimer(dt);

    if (!this.player.alive) {
      this.handlePlayerDeath();
    }

    if (this.baseDestroyed) {
      this.handleGameOver();
    }

    if (this.enemies.length === 0 && this.spawnQueue.length === 0) {
      this.completeStage();
    }
  }

  updatePaused() {
    this.overlay.innerHTML = `<div class="title">PAUSE</div>`;
    this.overlay.classList.add('active');
    if (this.input.isPressed('pause')) {
      this.togglePause();
    }
  }

  updateGameOver(dt) {
    this.overlay.innerHTML = `
      <div class="title">GAME OVER</div>
      <div>得分：${formatScore(this.score)}</div>
      <div class="menu-option" data-action="restart">重新开始</div>
    `;
    this.overlay.classList.add('active');
    this.overlay.onclick = (event) => {
      if (event.target.dataset?.action === 'restart') {
        this.startNewGame();
      }
    };
    this.input.once('fire', () => this.startNewGame());
    this.gameOverTimer -= dt;
    if (this.gameOverTimer <= 0) {
      this.setState(GAME_STATES.MENU);
    }
  }

  updateScore() {
    this.overlay.innerHTML = `
      <div class="title">STAGE ${formatStage((this.lastCompletedStage % LEVELS.length) + 1)}</div>
      <div>基本型：${this.killStats[ENEMY_TYPES.BASIC]}</div>
      <div>快速型：${this.killStats[ENEMY_TYPES.FAST]}</div>
      <div>强化型：${this.killStats[ENEMY_TYPES.POWER]}</div>
      <div>装甲型：${this.killStats[ENEMY_TYPES.ARMOR]}</div>
      <div class="menu-option" data-action="next">下一关</div>
    `;
    this.overlay.classList.add('active');
    this.overlay.onclick = (event) => {
      if (event.target.dataset?.action === 'next') {
        this.startStage();
      }
    };
    this.input.once('fire', () => this.startStage());
  }

  startNewGame() {
    this.cancelStageMusic();
    this.audio.stopLoop();
    this.audio.playTheme('stage', { loop: false });
    this.levelIndex = 0;
    this.score = 0;
    this.stageScore = 0;
    this.lastCompletedStage = -1;
    this.hud.stage.textContent = formatStage(this.levelIndex + 1);
    this.player = new PlayerTank(PlayerTank.getDefaultSpawnPosition());
    this.player.lives = PLAYER_BASE_LIVES;
    this.hud.score.textContent = formatScore(this.score);
    this.baseDestroyed = false;
    this.setState(GAME_STATES.STAGE_INTRO);
    this.prepareStage();
  }

  startStage() {
    this.cancelStageMusic();
    this.overlay.classList.remove('active');
    this.setState(GAME_STATES.STAGE_INTRO);
    this.prepareStage();
  }

  prepareStage() {
    this.resetStageRuntime();
    this.overlay.onclick = null;
    this.level = deepClone(LEVELS[this.levelIndex % LEVELS.length]);
    this.spawnQueue = [...ENEMY_SPAWN_TABLE[this.levelIndex % ENEMY_SPAWN_TABLE.length]];
    this.enemies = [];
    this.powerUps = [];
    this.explosions = [];
    this.spawnTimer = 1.5;
    this.kills = 0;
    this.killStats = {
      [ENEMY_TYPES.BASIC]: 0,
      [ENEMY_TYPES.FAST]: 0,
      [ENEMY_TYPES.POWER]: 0,
      [ENEMY_TYPES.ARMOR]: 0,
    };
    this.stageIntroTimer = 2.5;
    this.hud.stage.textContent = formatStage(this.levelIndex + 1);
    this.player.reset(PlayerTank.getDefaultSpawnPosition());
    this.cancelStageMusic();
    const trackId = STAGE_TRACKS[this.levelIndex % STAGE_TRACKS.length];
    this.currentStageTrack = trackId;
    this.stageMusicTimer = setTimeout(() => {
      if (this.currentStageTrack === trackId) {
        this.audio.playTheme(trackId, { loop: true });
      }
    }, 2000);
  }

  resetStageRuntime() {
    this.level = deepClone(LEVELS[0]);
    this.spawnQueue = [];
    this.enemies = [];
    this.powerUps = [];
    this.explosions = [];
    this.spawnTimer = 2;
    this.freezeTimer = 0;
    this.shovelTimer = 0;
    this.baseDestroyed = false;
    this.time = 0;
  }

  cancelStageMusic() {
    if (this.stageMusicTimer !== null) {
      clearTimeout(this.stageMusicTimer);
      this.stageMusicTimer = null;
    }
    this.currentStageTrack = null;
  }

  spawnNextEnemy() {
    if (this.spawnQueue.length === 0) return;
    if (this.enemies.length >= MAX_ENEMIES_ON_FIELD) return;
    const type = this.spawnQueue.shift();
    const index = (TOTAL_ENEMIES_PER_STAGE - this.spawnQueue.length) % SPAWN_POSITIONS.length;
    const position = SPAWN_POSITIONS[index % SPAWN_POSITIONS.length];
    const enemy = new EnemyTank({ x: position.x, y: position.y, type });
    enemy.invincibleTimer = 1.5;
    if (this.freezeTimer > 0) {
      enemy.frozen = this.freezeTimer;
    }
    this.enemies.push(enemy);
  }

  createPlayerContext() {
    return {
      input: this.input,
      bounds: FIELD_SIZE,
      level: this.level,
      tileResolver: this.tileResolver,
      createBullet: this.createBullet.bind(this),
      tanks: [this.player, ...this.enemies],
      self: this.player,
    };
  }

  createEnemyContext(enemy) {
    return {
      time: this.time || 0,
      level: this.level,
      tileResolver: this.tileResolver,
      bounds: FIELD_SIZE,
      player: this.player,
      createBullet: this.createBullet.bind(this),
      tanks: [this.player, ...this.enemies],
      self: enemy,
    };
  }

  createBullet(owner) {
    const speed = owner.isPlayer ? 220 : 180;
    const power = owner.isPlayer ? (owner.level >= 3 ? 2 : 1) : owner.bulletPower || 1;
    const bullet = new Bullet({ owner, speed, power });
    this.audio.playSfx('fire');
    return bullet;
  }

  createBulletContext() {
    return {
      level: this.level,
      tileResolver: this.tileResolver,
      player: this.player,
      enemies: this.enemies,
      friendlies: [],
      onTankDestroyed: this.handleTankDestroyed.bind(this),
      onBulletDestroyed: () => {},
      onBaseHit: this.handleBaseHit.bind(this),
      addExplosion: (x, y) => this.explosions.push(new Explosion({ x, y })),
    };
  }

  getAllBullets() {
    const bullets = [];
    if (this.player) bullets.push(...this.player.bullets);
    for (const enemy of this.enemies) {
      bullets.push(...enemy.bullets);
    }
    return bullets.filter((bullet) => bullet.alive);
  }

  handleTankDestroyed(target, killer) {
    if (target instanceof EnemyTank) {
      this.kills++;
      this.killStats[target.type]++;
      this.score += target.scoreValue;
      this.stageScore += target.scoreValue;
      this.hud.score.textContent = formatScore(this.score);
      if (this.score > this.hiScore) {
        this.hiScore = this.score;
        this.hud.hiScore.textContent = formatScore(this.hiScore);
      }
      this.explosions.push(new Explosion({ x: target.x + target.width / 2, y: target.y + target.height / 2 }));
      const shouldDrop = this.kills % 4 === 0;
      if (shouldDrop) {
        this.spawnPowerUp();
      }
      this.enemies = this.enemies.filter((enemy) => enemy.alive);
      this.audio.playSfx('explosion');
    } else if (target === this.player) {
      this.explosions.push(new Explosion({ x: target.x + target.width / 2, y: target.y + target.height / 2 }));
      this.audio.playSfx('explosion');
      target.alive = false;
    }
  }

  spawnPowerUp() {
    const type = randomChoice(POWER_UP_SEQUENCE);
    let attempts = 0;
    let x = 0;
    let y = 0;
    do {
      x = Math.floor(Math.random() * (FIELD_SIZE - TILE_SIZE));
      y = Math.floor(Math.random() * (FIELD_SIZE - TILE_SIZE * 4));
      attempts++;
    } while (attempts < 10 && !this.tileResolver.isPassable(this.level[Math.floor(y / TILE_SIZE)][Math.floor(x / TILE_SIZE)]));
    const powerUp = new PowerUp({ type, x, y });
    this.powerUps.push(powerUp);
  }

  collectPowerUp(powerUp) {
    switch (powerUp.type) {
      case POWER_UP_TYPES.HELMET:
        this.player.grantShield(10);
        break;
      case POWER_UP_TYPES.TIMER:
        this.freezeTimer = 5;
        for (const enemy of this.enemies) {
          enemy.frozen = 5;
        }
        break;
      case POWER_UP_TYPES.SHOVEL:
        this.shovelTimer = 15;
        this.reinforceBase(true);
        break;
      case POWER_UP_TYPES.STAR:
        this.player.level = Math.min(3, this.player.level + 1);
        break;
      case POWER_UP_TYPES.GRENADE:
        for (const enemy of [...this.enemies]) {
          this.handleTankDestroyed(enemy, this.player);
          enemy.alive = false;
        }
        this.enemies = [];
        break;
      case POWER_UP_TYPES.TANK:
        this.player.lives += 1;
        break;
      case POWER_UP_TYPES.GUN:
        this.player.level = 3;
        break;
    }
    this.audio.playSfx('pickup');
  }

  handlePlayerDeath() {
    if (this.player.lives > 0) {
      this.player.lives -= 1;
      this.player.reset(PlayerTank.getDefaultSpawnPosition());
    } else {
      this.handleGameOver();
    }
  }

  handleBaseHit() {
    this.baseDestroyed = true;
  }

  handleGameOver() {
    this.setState(GAME_STATES.GAME_OVER);
    this.gameOverTimer = 5;
    this.cancelStageMusic();
    this.audio.stopLoop();
    this.audio.playTheme('gameover', { loop: false });
  }

  completeStage() {
    this.lastCompletedStage = this.levelIndex;
    this.levelIndex = (this.levelIndex + 1) % LEVELS.length;
    this.setState(GAME_STATES.SCORE);
    this.cancelStageMusic();
    this.audio.stopLoop();
    this.audio.playTheme('stage', { loop: false });
  }

  setState(newState) {
    this.currentState = newState;
    this.menuMode = 'main';
    this.menuHelpPressed = false;
  }

  togglePause() {
    if (this.currentState === GAME_STATES.PLAYING) {
      this.setState(GAME_STATES.PAUSED);
      this.audio.playSfx('pause');
    } else if (this.currentState === GAME_STATES.PAUSED) {
      this.setState(GAME_STATES.PLAYING);
      this.audio.playSfx('pause');
    }
  }

  setupOverlayInteractions() {
    this.overlay.classList.add('active');
  }

  setupHudBindings() {
    this.hud.score.textContent = formatScore(0);
    this.hud.hiScore.textContent = formatScore(0);
    this.hud.stage.textContent = formatStage(1);
  }

  attachAudioControls() {
    const toggleButton = document.getElementById('btn-toggle-audio');
    const volumeRange = document.getElementById('range-volume');
    toggleButton.addEventListener('click', () => {
      this.audio.setEnabled(!this.audio.enabled);
      toggleButton.textContent = this.audio.enabled ? '🔊' : '🔇';
    });
    volumeRange.addEventListener('input', (event) => {
      const value = Number(event.target.value);
      this.audio.setVolume(value);
    });
  }

  updateShovelTimer(dt) {
    if (this.shovelTimer > 0) {
      this.shovelTimer -= dt;
      if (this.shovelTimer <= 0) {
        this.reinforceBase(false);
      }
    }
  }

  reinforceBase(strong) {
    const center = Math.floor(this.level[0].length / 2);
    const baseY = this.level.length - 3;
    const tiles = strong ? POWER_TILE_STEEL : POWER_TILE_BRICK;
    for (let offset = 0; offset < tiles.length; offset++) {
      const x = center - 2 + offset;
      this.level[baseY][x] = tiles[offset];
      this.level[baseY + 1][x] = tiles[offset];
    }
  }
}

function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
