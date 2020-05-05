export enum StratTypes {
    PISTOL = 'PISTOL',
    FORCE = 'FORCE',
    BUYROUND = 'BUYROUND',
}

export enum Sides {
    CT = 'CT',
    T = 'T',
}

export enum NadeTypes {
    GRENADE = 'GRENADE',
    MOLOTOV = 'MOLOTOV',
    FLASHBANG = 'FLASHBANG',
    SMOKE = 'SMOKE',
}

export enum Roles {
    GRENADE = 'GRENADE',
    MOLOTOV = 'MOLOTOV',
    FLASHBANG = 'FLASHBANG',
    SMOKE = 'SMOKE',
}

export interface Map {
    name: string,
    active: boolean,
    image?: string
}

export interface Strat {
    name: string,
    type: StratTypes,
    map: string,
    side: Sides,
    active: boolean,
    videoLink?: string,
    note?: string,
    createdBy: string,
    createdAt: Date,
    modifiedBy: string,
    modifiedAt: Date
}

export interface Step {
    player: string,
    strat: string,
    grenades?: NadeTypes[],
    description?: string,
    note?: string,
}

export interface Player {
    name: string,
    role: Roles,
    avatar?: string
}

