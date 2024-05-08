import { nanoid } from 'nanoid';

import { COLORS } from '@/constants';
import { GameMap } from '@/types/enums';
import { getRandomColor } from '@/utils/colors';

import { Client, DrawBoardState, MapData } from '../types';

export class Room {
  id: string;
  clients: Map<string, Client>;
  maps: Map<GameMap, MapData>;
  currentMap: GameMap;

  constructor({ roomId, stratId, map }: { roomId?: string; stratId?: string; map: GameMap }) {
    this.id = roomId ?? nanoid(10);
    this.clients = new Map();
    this.maps = new Map();
    this.currentMap = map;

    for (const map of Object.values(GameMap)) {
      this.maps.set(map, {
        stratId,
        stratName: '',
        data: {
          images: [],
          lines: [],
          texts: [],
          players: [],
        },
      });
    }
  }

  getColor() {
    return COLORS.find((color) => !this.clientsList.some((client) => client.color === color)) ?? getRandomColor();
  }

  static getRandomUsername() {
    return `User-${nanoid(5)}`;
  }

  get mapData() {
    return this.maps.get(this.currentMap)!;
  }

  get clientsList() {
    return [...this.clients.values()];
  }

  addClient(socketId: string, userName?: string, color?: string): Client {
    this.clients.set(socketId, {
      id: socketId,
      position: { x: 0, y: 0 },
      color: color ?? this.getColor(),
      userName: userName || Room.getRandomUsername(),
    });
    return this.clients.get(socketId)!;
  }

  getClient(socketId: string = '') {
    return this.clients.get(socketId);
  }

  updateData(map: GameMap, data: DrawBoardState): void {
    this.maps.get(map)!.data = data;
  }
}
