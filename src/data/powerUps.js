import { POWER_UP_TYPES } from '../core/config.js';

export const POWER_UP_DETAILS = [
  {
    type: POWER_UP_TYPES.HELMET,
    name: '头盔',
    description: '获得 10 秒护盾，免疫伤害。',
    icon: '🪖',
  },
  {
    type: POWER_UP_TYPES.TIMER,
    name: '闹钟',
    description: '冻结所有敌军 5 秒。',
    icon: '⏱️',
  },
  {
    type: POWER_UP_TYPES.SHOVEL,
    name: '铲子',
    description: '加固基地周围墙体 15 秒。',
    icon: '⛏️',
  },
  {
    type: POWER_UP_TYPES.STAR,
    name: '星星',
    description: '坦克升级 1 级（最多 3 级）。',
    icon: '⭐',
  },
  {
    type: POWER_UP_TYPES.GRENADE,
    name: '手雷',
    description: '立即摧毁场上全部敌军坦克。',
    icon: '💣',
  },
  {
    type: POWER_UP_TYPES.TANK,
    name: '坦克',
    description: '增加一条生命值。',
    icon: '❤️',
  },
  {
    type: POWER_UP_TYPES.GUN,
    name: '加农炮',
    description: '直接提升至满级火力。',
    icon: '🔫',
  },
];

export const POWER_UP_ICON_MAP = POWER_UP_DETAILS.reduce((map, { type, icon }) => {
  map[type] = icon;
  return map;
}, {});
