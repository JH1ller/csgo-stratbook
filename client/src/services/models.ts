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
  steps: Step[];
}

export interface Step {
  _id: string;
  createdBy: string;
  createdAt: Date;
  strat: string;
  equipment: Equipment;
  description?: string;
  note?: string;
  actor?: string;
}

export interface Player {
  _id: string;
  name: string;
  email: string;
  role?: Roles;
  avatar?: string;
  team?: string;
  isOnline?: boolean;
  lastOnline?: Date;
}

export interface Team {
  _id: string;
  name: string;
  code: string;
  avatar?: string;
  createdBy?: string;
  manager?: string;
  website?: string;
  server?: {
    ip?: string;
    password?: string;
  };
}

export enum Status {
  NO_AUTH = 'NO_AUTH',
  LOGGED_IN_NO_TEAM = 'LOGGED_IN_NO_TEAM',
  LOGGED_IN_WITH_TEAM = 'LOGGED_IN_WITH_TEAM',
}

export interface Response {
  success?: string;
  error?: string;
}
