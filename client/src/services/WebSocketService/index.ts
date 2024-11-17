import { io, Socket } from 'socket.io-client';
import { WS_HOST } from '@/config';
import store from '@/store';
import { Log } from '@/utils/logger';
import { Player } from '../../api/models/Player';
import { Strat } from '../../api/models/Strat';
import { Team } from '../../api/models/Team';
import { Utility } from '../../api/models/Utility';
import { ClientToServerEvents, JoinedRoomResponse, ServerToClientEvents } from './types';
import { GameMap } from '@/api/models/GameMap';

class WebSocketService {
  private static instance: WebSocketService;
  readonly socketTimeout = 10000;

  socket!: Socket<ServerToClientEvents, ClientToServerEvents>;
  connectionPromise: Promise<void> | undefined;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  reconnect() {
    Log.info('WebSocketService::reconnect()', 'reconnecting with auth');
    if (!store.state.auth.token) Log.warn('WebSocketService::reconnect()', 'Missing auth token');
    this.socket?.close();
    this.socket?.removeAllListeners();
    this.socket = io(WS_HOST, {
      auth: {
        token: store.state.auth.token,
      },
    });
    this.setupListeners();
  }

  async connect(): Promise<void> {
    Log.debug('WebSocketService::connect()');
    //* Caching connection promise to avoid creating two connections simultaneously.
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          Log.error('WebSocketService::connect()', 'Could not connect');
          reject('Could not connect');
        }, this.socketTimeout);

        if (this.socket?.connected && (this.socket.auth as Record<string, string>).token) {
          clearTimeout(timeout);
          resolve();
        }
        if (this.socket?.connected && !store.state.auth.token) {
          clearTimeout(timeout);
          resolve();
        }
        if (!this.socket) {
          Log.info('WebSocketService::connect()', 'new socket connection');
          this.socket = io(WS_HOST, {
            auth: {
              token: store.state.auth.token,
            },
          });
          this.setupListeners();
        }

        if (this.socket?.connected && !(this.socket.auth as Record<string, string>).token && store.state.auth.token) {
          this.reconnect();
        }

        if (this.socket && !this.socket.connected) {
          this.socket.connect();
        }

        this.socket.once('connect', () => {
          Log.info('ws::connected', 'Websocket connection established.', !!(this.socket.auth as any).token);
          clearTimeout(timeout);
          resolve();
        });
      });
    }
    try {
      store.dispatch('app/addRequest');
      await this.connectionPromise;
    } finally {
      store.dispatch('app/removeRequest');
      this.connectionPromise = undefined;
    }
  }

  get connected(): boolean {
    return this.socket?.connected;
  }

  disconnect() {
    this.socket?.close();
  }

  async joinDrawRoom({
    roomId,
    userName,
    stratId,
    map,
  }: {
    roomId?: string;
    userName?: string;
    stratId?: string;
    map: GameMap;
  }): Promise<JoinedRoomResponse> {
    Log.debug('WebSocketService::joinDrawRoom()', roomId, userName, stratId);
    await this.connect();

    return new Promise((resolve, reject) => {
      store.dispatch('app/addRequest');
      this.socket.emit('join-draw-room', { targetRoomId: roomId, userName, stratId, map });

      const timeout = setTimeout(() => {
        Log.error('WebSocketService::joinDrawRoom()', 'Could not join room');
        store.dispatch('app/removeRequest');
        reject('Could not join room');
      }, this.socketTimeout);

      this.socket.once('draw-room-joined', (data) => {
        Log.info('ws::drawroom-joined', `Joined room ${data.roomId} as client ${this.socket.id}`);
        store.dispatch('app/removeRequest');
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }

  private setupListeners() {
    Log.info('WebSocketService::setupListeners()');

    setInterval(() => {
      const start = Date.now();

      this.socket.emit('ping');
      this.socket.once('pong', () => {
        const duration = Date.now() - start;
        store.dispatch('app/updateLatency', duration);
      });
    }, 5000);

    this.socket.on('disconnect', () => {
      Log.info('ws::disconnect', 'Websocket connection lost or disconnected');
    });

    this.socket.on('created-strat', (data: { strat: Strat }) => {
      Log.info('ws::created', data);
      store.dispatch('strat/addStratLocally', data);
    });

    this.socket.on('updated-strat', (data) => {
      Log.info('ws::updated', data);
      store.dispatch('strat/updateStratLocally', data);
    });

    this.socket.on('updated-strats', (data) => {
      Log.info('ws::updated', data);
      store.dispatch('strat/updateMultipleStratLocally', data);
    });

    this.socket.on('deleted-strat', (data: { stratId: string }) => {
      Log.info('ws::deleted', data);
      store.dispatch('strat/deleteStratLocally', data);
    });

    this.socket.on('created-utility', (data: { utility: Utility }) => {
      Log.info('ws::created', data);
      store.dispatch('utility/addUtilityLocally', data);
    });

    this.socket.on('updated-utility', (data: { utility: Utility }) => {
      Log.info('ws::updated', data);
      store.dispatch('utility/updateUtilityLocally', data);
    });

    this.socket.on('deleted-utility', (data: { utilityId: string }) => {
      Log.info('ws::deleted', data);
      store.dispatch('utility/deleteUtilityLocally', data);
    });

    this.socket.on('deleted-player', (data: { playerId: string }) => {
      Log.info('ws::deleted', data);
      store.dispatch('team/deleteMemberLocally', data);
    });

    this.socket.on('updated-player', (data: { player: Partial<Player> }) => {
      Log.info('ws::updated', data);
      store.dispatch('team/updateMemberLocally', data);
    });

    this.socket.on('deleted-team', () => {
      Log.info('ws::deleted', 'Team deleted');
      store.dispatch('team/deleteTeamLocally');
    });

    this.socket.on('updated-team', (data: { team: Team }) => {
      Log.info('ws::updated', data);
      store.dispatch('team/updateTeamLocally', data);
    });
  }

  emit(event: keyof ClientToServerEvents, ...args: unknown[]) {
    if (this.socket?.connected) {
      this.socket.emit(event, ...(args as any));
    } else {
      Log.warn('ws::drawtool:emit', `Tried emitting ${event} without connection.`);
    }
  }
}

export default WebSocketService;
