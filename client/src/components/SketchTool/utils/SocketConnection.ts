import io from 'socket.io-client';
import { WS_URL } from '@/config';
import { Log } from '@/utils/logger';

class SocketConnection {
  private static instance: SocketConnection;

  roomId!: string;
  clientId!: string;

  socket!: SocketIOClient.Socket;

  private constructor() {
    //
  }

  static getInstance(): SocketConnection {
    if (!SocketConnection.instance) {
      SocketConnection.instance = new SocketConnection();
    }
    return SocketConnection.instance;
  }

  connect(targetRoomId?: string): Promise<{ roomId: string; clientId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        console.log(WS_URL);
        this.socket = io(WS_URL);
        this.socket.on('connect', () => {
          Log.info('ws::drawtool:connected', 'Websocket connection established.');
          this.socket.emit('join-draw-room', { targetRoomId });
        });
        this.socket.on('draw-room-joined', ({ roomId, clientId }: { roomId: string; clientId: string }) => {
          Log.info('ws::drawtool:joined', `Joined room ${roomId} as client ${clientId}`);
          this.roomId = roomId;
          this.clientId = clientId;
          resolve({ roomId, clientId });
        });
      } else {
        reject('Socket already connected');
      }
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
      Log.warn('ws::drawtool:emit', `Tried emitting ${args} without connection.`);
    }
  }
}

export default SocketConnection;
