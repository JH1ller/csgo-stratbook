export const GameMap = {
  DUST_2: 'DUST_2',
  MIRAGE: 'MIRAGE',
  OVERPASS: 'OVERPASS',
  NUKE: 'NUKE',
  VERTIGO: 'VERTIGO',
  INFERNO: 'INFERNO',
  TRAIN: 'TRAIN',
  ANCIENT: 'ANCIENT',
  ANUBIS: 'ANUBIS',
} as const;

export type GameMap = (typeof GameMap)[keyof typeof GameMap];

export const UtilityType = {
  FLASH: 'FLASH',
  GRENADE: 'GRENADE',
  SMOKE: 'SMOKE',
  MOLOTOV: 'MOLOTOV',
} as const;

export type UtilityType = (typeof UtilityType)[keyof typeof UtilityType];

export const MouseButton = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  LEFTRIGHT: 'LEFTRIGHT',
} as const;

export type MouseButton = (typeof MouseButton)[keyof typeof MouseButton];

export const Movement = {
  STILL: 'STILL',
  WALK: 'WALK',
  RUN: 'RUN',
} as const;

export type Movement = (typeof Movement)[keyof typeof Movement];

export const StratType = {
  PISTOL: 'PISTOL',
  FORCE: 'FORCE',
  BUYROUND: 'BUYROUND',
} as const;

export type StratType = (typeof StratType)[keyof typeof StratType];

export const StratSide = {
  CT: 'CT',
  T: 'T',
} as const;

export type StratSide = (typeof StratSide)[keyof typeof StratSide];

export const AccessRole = {
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;

export type AccessRole = (typeof AccessRole)[keyof typeof AccessRole];
