import io from 'socket.io-client';
import { BASE_URL } from '@/config';
import store from '@/store';
import { log } from '@/utils/logger';
import { Player } from './models/Player';
import { Strat } from './models/Strat';
import { Team } from './models/Team';
import { Utility } from './models/Utility';

class WebSocketService {
  private static instance: WebSocketService;

  private socket!: SocketIOClient.Socket;

  private constructor() {}

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
      log.info('ws::connected', 'Websocket connection established.');
      this.socket.emit('join-room', {
        teamID: (store.state.auth.profile as Player).team,
        playerID: (store.state.auth.profile as Player)._id,
      });
    });

    this.socket.on('pong', (ms: number) => store.dispatch('app/updateLatency', ms));

    this.socket.on('room-joined', (data: { roomID: string }) => {
      log.info('ws::joined', `Connected to room ${data.roomID}`);
    });

    this.socket.on('disconnect', () => {
      log.info('ws::disconnect', 'Websocket connection lost or disconnected');
    });

    this.socket.on('created-strat', (data: { strat: Strat }) => {
      log.info('ws::created', data);
      store.dispatch('strat/addStratLocally', data);
    });

    this.socket.on('updated-strat', (data: { strat: Strat }) => {
      log.info('ws::updated', data);
      store.dispatch('strat/updateStratLocally', data);
    });

    this.socket.on('deleted-strat', (data: { stratID: string }) => {
      log.info('ws::deleted', data);
      store.dispatch('strat/deleteStratLocally', data);
    });

    this.socket.on('created-utility', (data: { utility: Utility }) => {
      log.info('ws::created', data);
      store.dispatch('utility/addUtilityLocally', data);
    });

    this.socket.on('updated-utility', (data: { utility: Utility }) => {
      log.info('ws::updated', data);
      store.dispatch('utility/updateUtilityLocally', data);
    });

    this.socket.on('deleted-utility', (data: { utilityID: string }) => {
      log.info('ws::deleted', data);
      store.dispatch('utility/deleteUtilityLocally', data);
    });

    this.socket.on('deleted-player', (data: { playerID: string }) => {
      log.info('ws::deleted', data);
      store.dispatch('team/deleteMemberLocally', data);
    });

    this.socket.on('updated-player', (data: { player: Partial<Player> }) => {
      log.info('ws::updated', data);
      store.dispatch('team/updateMemberLocally', data);
    });

    this.socket.on('deleted-team', () => {
      log.info('ws::deleted', 'Team deleted');
      store.dispatch('team/deleteTeamLocally');
    });

    this.socket.on('updated-team', (data: { team: Team }) => {
      log.info('ws::updated', data);
      store.dispatch('team/updateTeamLocally', data);
    });
  }
}

export default WebSocketService;
