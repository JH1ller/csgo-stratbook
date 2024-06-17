import { Server, Socket } from 'socket.io';

import { Player, PlayerDocument } from '@/models/player';
import { Strat } from '@/models/strat';
import { Team } from '@/models/team';
import { Utility } from '@/models/utility';
import { Client, DrawBoardState } from '@/types';
import { GameMap } from '@/types/enums';

export interface ServerToClientEvents {
  pong: () => void;
  // draw board events
  'draw-room-joined': (payload: {
    map: GameMap;
    roomId: string;
    stratName: string;
    drawData: DrawBoardState;
    clients: (Client & { id: string })[];
    userName: string;
    color: string;
  }) => void;
  'client-joined': (payload: Client & { id: string }) => void;
  'client-left': (payload: { clientId: string }) => void;
  'pointer-data': (payload: { x: number; y: number; id: string; userName?: string }) => void;
  'data-updated': (payload: DrawBoardState & { id: string }) => void;
  'username-updated': (payload: { userName: string; id: string }) => void;
  'stratname-updated': (payload: { stratName: string; id: string }) => void;
  'map-updated': (payload: { map: GameMap; stratName?: string; drawData: DrawBoardState; id: string }) => void;
  // other data update events
  'created-strat': (payload: { strat: Strat }) => void;
  'updated-strat': (payload: { strat: Strat }) => void;
  'updated-strats': (payload: { strats: Strat[] }) => void;
  'deleted-strat': (payload: { stratId: string }) => void;
  'created-utility': (payload: { utility: Utility }) => void;
  'updated-utility': (payload: { utility: Utility }) => void;
  'deleted-utility': (payload: { utilityId: string }) => void;
  'updated-player': (payload: { player: Partial<Player> }) => void;
  'deleted-player': (payload: { playerId: string }) => void;
  'updated-team': (payload: { team: Team }) => void;
  'deleted-team': () => void;
}

export interface ClientToServerEvents {
  'join-draw-room': (payload: { targetRoomId?: string; userName?: string; stratId?: string; map: GameMap }) => void;
  'leave-draw-room': () => void;
  'pointer-position': (payload: { x: number; y: number }) => void;
  'update-data': (payload: DrawBoardState) => void;
  'update-username': (userName: string) => void;
  'update-stratname': (stratName: string) => void;
  'update-map': (map: GameMap) => void;
  ping: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  drawRoomId: string;
  player: PlayerDocument;
  activeQuery: Promise<unknown>;
}

export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
