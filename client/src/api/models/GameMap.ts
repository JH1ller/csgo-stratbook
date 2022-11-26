export enum GameMap {
  Dust2 = 'DUST_2',
  Mirage = 'MIRAGE',
  Overpass = 'OVERPASS',
  Nuke = 'NUKE',
  Vertigo = 'VERTIGO',
  Inferno = 'INFERNO',
  Train = 'TRAIN',
  Ancient = 'ANCIENT',
  Anubis = 'ANUBIS',
}

export const gameMapTable: Record<GameMap, string> = {
  [GameMap.Dust2]: 'Dust 2',
  [GameMap.Mirage]: 'Mirage',
  [GameMap.Overpass]: 'Overpass',
  [GameMap.Nuke]: 'Nuke',
  [GameMap.Vertigo]: 'Vertigo',
  [GameMap.Inferno]: 'Inferno',
  [GameMap.Train]: 'Train',
  [GameMap.Ancient]: 'Ancient',
  [GameMap.Anubis]: 'Anubis',
};
