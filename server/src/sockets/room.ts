import { GameMap } from '@/types/enums';
import { nanoid } from 'nanoid';
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
        stratName: '',
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

  static getRandomUsername() {
    return `User-${nanoid(5)}`;
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

  addClient(socketId: string, userName?: string): void {
    this.clients[socketId] = {
      position: { x: 0, y: 0 },
      color: Room.colors[Object.keys(this.clients).length] ?? Room.getRandomColor(),
      userName: userName || Room.getRandomUsername(),
    };
  }

  updateData(map: GameMap, data: DrawBoardState): void {
    this.maps[map].data = data;
  }
}
