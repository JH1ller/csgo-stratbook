import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'draw-tool',
})
export class DrawToolGateway {
  @WebSocketServer()
  public readonly server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: Record<string, unknown>): Observable<WsResponse<number>> {
    console.log(data);

    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
