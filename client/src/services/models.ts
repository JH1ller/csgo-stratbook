export enum StratTypes {
  PISTOL = 'PISTOL',
  FORCE = 'FORCE',
  BUYROUND = 'BUYROUND',
}

export enum Sides {
  CT = 'CT',
  T = 'T',
}

export enum Roles {
  IGL = 'IGL',
  RIFLE = 'RIFLE',
  ENTRY = 'ENTRY',
  AWP = 'AWP',
}

export interface Map {
  _id: string;
  name: string;
  active: boolean;
  image?: string;
}

export interface Equipment {
  grenade: boolean;
  smoke: boolean;
  flashbang: boolean;
  flashbangTwo: boolean;
  molotov: boolean;
  defuseKit: boolean;
}

export interface Strat {
  _id: string;
  name: string;
  type: StratTypes;
  map: string;
  side: Sides;
  active: boolean;
  videoLink?: string;
  note?: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  steps?: Step[];
}

export interface Step {
  _id: string;
  player: string;
  strat: string;
  equipment: Equipment;
  description?: string;
  note?: string;
}

export interface Player {
  _id: string;
  name: string;
  email: string;
  role?: Roles;
  avatar?: string;
  team?: string;
}
