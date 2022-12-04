import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway(4200, { namespace: 'test' })
export class Gateway {
  @WebSocketServer()
  server;
}
