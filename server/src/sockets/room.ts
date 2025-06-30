import { nanoid } from 'nanoid';

import { COLORS } from '@/constants';
import { GameMap } from '@/types/enums';
import { getRandomColor } from '@/utils/colors';
import { Logger } from '@/utils/logger';

import { Client, DrawBoardState, MapData } from '../types';

const logger = new Logger('DrawRoom');

export class Room {
  id: string;
  clients: Map<string, Client>;
  maps: Map<GameMap, MapData>;
  currentMap: GameMap;
  lastActive: number;

  constructor({ roomId, stratId, map }: { roomId?: string; stratId?: string; map: GameMap }) {
    this.id = roomId ?? nanoid(10);
    this.clients = new Map();
    this.maps = new Map();
    this.currentMap = map;
    this.lastActive = Date.now();

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

  touch(socketId?: string) {
    this.lastActive = Date.now();
    if (socketId && this.clients.has(socketId)) {
      this.clients.get(socketId)!.lastActive = Date.now();
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
    const client: Client = {
      id: socketId,
      position: { x: 0, y: 0 },
      color: color ?? this.getColor(),
      userName: userName || Room.getRandomUsername(),
      lastActive: Date.now(),
    };
    this.clients.set(socketId, client);
    this.touch(socketId);
    return client;
  }

  getClient(socketId: string = '') {
    return this.clients.get(socketId);
  }

  updateData(map: GameMap, data: DrawBoardState, socketId?: string): void {
    this.maps.get(map)!.data = data;
    this.touch(socketId);
  }

  removeInactiveClients(thresholdMs: number) {
    const now = Date.now();
    for (const [id, client] of this.clients.entries()) {
      if (now - client.lastActive > thresholdMs) {
        this.clients.delete(id);
        logger.info(`Client ${id} removed due to inactivity.`);
      }
    }
  }

  isInactive(thresholdMs: number) {
    return this.clients.size === 0 && Date.now() - this.lastActive > thresholdMs;
  }
}
