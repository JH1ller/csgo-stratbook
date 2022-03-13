import { Socket, io } from 'socket.io-client';
import { WS_URL } from '@/config';
import { Log } from '@/utils/logger';

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
  }): Promise<{ roomId: string; clientId: string; stratName: string }> {
    return new Promise(resolve => {
      if (!this.socket || !this.socket.connected) {
        this.socket = io(WS_URL);
        this.socket.on('connect', () => {
          Log.info('ws::drawtool:connected', 'Websocket connection established.');
          this.socket.emit('join-draw-room', { targetRoomId: roomId, userName, stratId });
        });
      } else {
        this.socket.emit('join-draw-room', { targetRoomId: roomId, userName, stratId });
      }
      this.socket.on(
        'draw-room-joined',
        ({ roomId, clientId, stratName }: { roomId: string; clientId: string; stratName: string }) => {
          Log.info('ws::drawtool:joined', `Joined room ${roomId} as client ${clientId}`);
          this.roomId = roomId;
          this.clientId = clientId;
          resolve({ roomId, clientId, stratName });
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
