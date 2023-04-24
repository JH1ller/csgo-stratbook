import { GameMap } from '@/api/models/GameMap';
import { Player } from '@/api/models/Player';
import { Strat } from '@/api/models/Strat';
import { Team } from '@/api/models/Team';
import { Utility } from '@/api/models/Utility';
import { RemoteClient, ItemState } from '@/components/SketchTool/types';
import { Socket } from 'socket.io-client';

export interface JoinedRoomResponse {
  map: GameMap;
  roomId: string;
  stratName: string;
  drawData: ItemState;
  clients: Omit<RemoteClient, 'image' | 'timeout'>[];
  userName: string;
  color: string;
}

export interface ServerToClientEvents {
  pong: () => void;
  // draw board events
  'draw-room-joined': (payload: JoinedRoomResponse) => void;
  'client-joined': (payload: Omit<RemoteClient, 'image' | 'timeout'>) => void;
  'client-left': (payload: { clientId: string }) => void;
  'pointer-data': (payload: { x: number; y: number; id: string; userName?: string }) => void;
  'data-updated': (payload: ItemState & { id: string }) => void;
  'username-updated': (payload: { userName: string; id: string }) => void;
  'stratname-updated': (payload: { stratName: string; id: string }) => void;
  'map-updated': (payload: { map: GameMap; stratName?: string; drawData: ItemState; id: string }) => void;
  // other data update events
  'created-strat': (payload: { strat: Strat }) => void;
  'updated-strat': (payload: { strat: Strat }) => void;
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
  ping: () => void;
  'pointer-position': (payload: { x: number; y: number }) => void;
  'update-data': (payload: ItemState) => void;
  'update-username': (userName: string) => void;
  'update-stratname': (stratName: string) => void;
  'update-map': (map: GameMap) => void;
}

export type TypedSocketClient = Socket<ClientToServerEvents, ServerToClientEvents>;
