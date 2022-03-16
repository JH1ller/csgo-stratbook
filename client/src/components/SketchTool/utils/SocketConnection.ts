import { Socket, io } from 'socket.io-client';
import { WS_URL } from '@/config';
import { Log } from '@/utils/logger';
import { StageState } from '../types';
import store from '@/store';

class SocketConnection {
  private static instance: SocketConnection;

  roomId!: string;
  clientId!: string;

  socket!: Socket;

  private constructor() {
    //
  }

  static getInstance(): SocketConnection {
    if (!SocketConnection.instance) {
      SocketConnection.instance = new SocketConnection();
    }
    return SocketConnection.instance;
  }

  connect({
    roomId,
    userName,
    stratId,
  }: {
    roomId?: string;
    userName?: string;
    stratId?: string;
  }): Promise<{ roomId: string; clientId: string; stratName: string; drawData: StageState }> {
    Log.debug('ws::socketconnection:connect');
    return new Promise(resolve => {
      if (!this.socket || !this.socket.connected) {
        this.socket = io(WS_URL, {
          auth: {
            token: store.state.auth.token,
          },
        });
        this.socket.once('connect', () => {
          Log.info('ws::drawtool:connected', 'Websocket connection established.');
          this.socket.emit('join-draw-room', { targetRoomId: roomId, userName, stratId });
        });
      } else {
        this.socket.emit('join-draw-room', { targetRoomId: roomId, userName, stratId });
      }
      this.socket.once(
        'draw-room-joined',
        ({
          roomId,
          clientId,
          stratName,
          drawData,
        }: {
          roomId: string;
          clientId: string;
          stratName: string;
          drawData: StageState;
        }) => {
          Log.info('ws::drawtool:joined', `Joined room ${roomId} as client ${clientId}`);
          this.roomId = roomId;
          this.clientId = clientId;
          resolve({ roomId, clientId, stratName, drawData });
        },
      );
    });
  }

  get connected(): boolean {
    return this.socket?.connected && !!this.roomId;
  }

  disconnect() {
    this.socket?.close();
  }

  emit(event: string, ...args: any[]) {
    if (this.socket?.connected && this.roomId) {
      this.socket.emit(event, ...args);
    } else {
      Log.warn('ws::drawtool:emit', `Tried emitting ${event} without connection.`);
    }
  }
}

export default SocketConnection;
