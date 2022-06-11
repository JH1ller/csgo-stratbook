import { COLORS } from '@/constants';
import { GameMap } from '@/types/enums';
import { getRandomColor } from '@/utils/colors';
import { nanoid } from 'nanoid';
import { Client, DrawBoardState, MapData } from '../types';

export class Room {
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

  getColor() {
    return (
      COLORS.find((color) => !Object.values(this.clients).some((client) => client.color === color)) ?? getRandomColor()
    );
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
      color: this.getColor(),
      userName: userName || Room.getRandomUsername(),
    };
  }

  updateData(map: GameMap, data: DrawBoardState): void {
    this.maps[map].data = data;
  }
}
