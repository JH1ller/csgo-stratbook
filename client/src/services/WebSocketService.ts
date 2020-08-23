import io from 'socket.io-client';
import { BASE_URL } from '@/config';
import store from '@/store';
import { Team } from './models';

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
    if (!this.socket) {
      this.socket = io(BASE_URL);
      this.setupListeners();
    }
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Websocket connection established.');
      this.socket.emit('join-room', { teamID: (store.state.team.teamInfo as Team)._id });
    });

    this.socket.on('room-joined', (data: any) => {
      console.log(data);
    });
  }
}

export default WebSocketService;
