import io from 'socket.io-client';
import { BASE_URL } from '@/config';
import store from '@/store';
import { Team, Player } from './models';

class WebSocketService {
  private static instance: WebSocketService;

  private socket!: SocketIOClient.Socket | null;
  private room!: string;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(BASE_URL);
      this.setupListeners();
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.room = '';
  }

  private setupListeners() {
    this.socket?.on('connect', () => {
      console.log('WS: Websocket connection established.');
      this.socket?.emit('join-room', {
        teamID: (store.state.auth.profile as Player).team,
        playerID: (store.state.auth.profile as Player)._id,
      });
    });

    this.socket?.on('room-joined', (data: { roomID: string }) => {
      console.log(`WS: Connected to room ${data.roomID}`);
    });

    this.socket?.on('changed-step', (data: { stratID: string }) => {
      if (!data?.stratID) {
        store.dispatch('strat/fetchStrats');
      } else if (store.state.strat.strats.find(strat => strat._id === data.stratID)) {
        store.dispatch('strat/fetchStepsOfStrat', data.stratID);
      }
    });

    this.socket?.on('changed-strat', (data: { mapID: string }) => {
      if (!data?.mapID) {
        store.dispatch('strat/fetchStrats');
      } else if (store.state.map.currentMap === data.mapID) {
        store.dispatch('strat/fetchStrats');
      }
    });

    this.socket?.on('changed-player', (data: { playerID: string }) => {
      if (data.playerID !== (store.state.auth.profile as Player)._id) {
        store.dispatch('team/fetchTeamMembers');
      }
    });
  }
}

export default WebSocketService;
