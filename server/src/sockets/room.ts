import { GameMap } from '@/types/enums';
import { Client, DrawBoardState, MapData } from '../types';

export class Room {
  static readonly colors = ['#1EBC9C', '#3298DB', '#F2C512', '#A463BF', '#E84B3C', '#DDE6E8'];

  clients: Record<string, Client>;
  maps: Record<GameMap, MapData>;
  currentMap: GameMap;

  constructor(map: GameMap, stratId?: string) {
    this.clients = {};
    this.currentMap = map;
    this.maps = Object.values(GameMap).reduce<Record<GameMap, MapData> & any>((acc, map) => {
      acc[map] = {
        stratId,
        data: {},
      };
      return acc;
    }, {});
  }

  static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  get mapData() {
    return this.maps[this.currentMap];
  }

  get clientsList() {
    return Object.entries(this.clients).reduce<(Client & { id: string })[]>((acc, [id, data]) => {
      acc.push({
        id,
        ...data,
      });
      return acc;
    }, []);
  }

  addClient(socketId: string): void {
    console.log(Room.colors[Object.keys(this.clients).length]);
    this.clients[socketId] = {
      position: { x: 0, y: 0 },
      color: Room.colors[Object.keys(this.clients).length] ?? Room.getRandomColor(),
    };
  }

  updateData(map: GameMap, data: DrawBoardState): void {
    this.maps[map].data = data;
  }
}
