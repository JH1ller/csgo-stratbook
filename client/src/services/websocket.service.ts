import { io, Socket } from 'socket.io-client';
import { WS_URL } from '@/config';
import store from '@/store';
import { Log } from '@/utils/logger';
import { Player } from '../api/models/Player';
import { Strat } from '../api/models/Strat';
import { Team } from '../api/models/Team';
import { Utility } from '../api/models/Utility';
import { StageState } from '@/components/SketchTool/types';

class WebSocketService {
  private static instance: WebSocketService;

  socket!: Socket;
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
    this.socket = io(WS_URL, {
      auth: {
        token: store.state.auth.token,
      },
    });
    this.setupListeners();
  }

  async connect(): Promise<void> {
    //* Caching connection promise to avoid creating two connections simultaneously.
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise(resolve => {
        if (this.socket?.connected && (this.socket.auth as Record<string, string>).token) {
          resolve();
        }
        if (!this.socket) {
          Log.info('WebSocketService::connect()', 'new socket connection');
          this.socket = io(WS_URL, {
            auth: {
              token: store.state.auth.token,
            },
          });
          this.setupListeners();
        }

        if (this.socket?.connected && !(this.socket.auth as Record<string, string>).token && store.state.auth.token) {
          this.reconnect();
        }

        this.socket.once('connect', () => {
          Log.info('ws::connected', 'Websocket connection established.', !!(this.socket.auth as any).token);
          resolve();
        });
      });
    }

    await this.connectionPromise;
    this.connectionPromise = undefined;
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
  }: {
    roomId?: string;
    userName?: string;
    stratId?: string;
  }): Promise<{ roomId: string; stratName: string; drawData: StageState }> {
    Log.debug('WebSocketService::joinDrawRoom()', roomId, userName, stratId);
    await this.connect();

    return new Promise(resolve => {
      this.socket.emit('join-draw-room', { targetRoomId: roomId, userName, stratId });
      this.socket.once('draw-room-joined', (data: { roomId: string; stratName: string; drawData: StageState }) => {
        Log.info('ws::drawroom-joined', `Joined room ${data.roomId} as client ${this.socket.id}`);
        resolve(data);
      });
    });
  }

  private setupListeners() {
    Log.info('WebSocketService::setupListeners()');

    this.socket.on('pong', (ms: number) => store.dispatch('app/updateLatency', ms));

    this.socket.on('disconnect', () => {
      Log.info('ws::disconnect', 'Websocket connection lost or disconnected');
    });

    this.socket.on('created-strat', (data: { strat: Strat }) => {
      Log.info('ws::created', data);
      store.dispatch('strat/addStratLocally', data);
    });

    this.socket.on('updated-strat', (data: { strat: Strat }) => {
      Log.info('ws::updated', data);
      store.dispatch('strat/updateStratLocally', data);
    });

    this.socket.on('deleted-strat', (data: { stratID: string }) => {
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

    this.socket.on('deleted-utility', (data: { utilityID: string }) => {
      Log.info('ws::deleted', data);
      store.dispatch('utility/deleteUtilityLocally', data);
    });

    this.socket.on('deleted-player', (data: { playerID: string }) => {
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

  emit(event: string, ...args: any[]) {
    if (this.socket?.connected) {
      this.socket.emit(event, ...args);
    } else {
      Log.warn('ws::drawtool:emit', `Tried emitting ${event} without connection.`);
    }
  }
}

export default WebSocketService;
