import io from 'socket.io-client';
import { BASE_URL } from '@/config';
import store from '@/store';
import { Log } from '@/utils/logger';
import { Player } from '../api/models/Player';
import { Strat } from '../api/models/Strat';
import { Team } from '../api/models/Team';
import { Utility } from '../api/models/Utility';

class WebSocketService {
  private static instance: WebSocketService;

  private socket!: SocketIOClient.Socket;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(BASE_URL);
      this.setupListeners();
    }
  }

  disconnect() {
    this.socket?.close();
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      Log.info('ws::connected', 'Websocket connection established.');
      this.socket.emit('join-room', {
        teamID: (store.state.auth.profile as Player).team,
        playerID: (store.state.auth.profile as Player).id,
      });
    });

    this.socket.on('pong', (ms: number) => store.dispatch('app/updateLatency', ms));

    this.socket.on('room-joined', (data: { roomID: string }) => {
      Log.info('ws::joined', `Connected to room ${data.roomID}`);
    });

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
    }
  }
}

export default WebSocketService;
