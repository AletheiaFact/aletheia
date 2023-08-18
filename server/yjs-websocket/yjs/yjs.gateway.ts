import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
} from "@nestjs/websockets";
import WebSocket from "ws";
import { WebSocketServer as server } from "ws"; // Import WebSocketServer from 'ws'

@WebSocketGateway(8082, { path: "/yjs" }) // Remove port argument
export class YjsGateway {
    @WebSocketServer()
    server: WebSocket; // Change WebSocketServer type to 'WebSocketServer'

    @SubscribeMessage("yjs")
    findAll(@MessageBody() data: any): any {
        console.log("Get yjs message " + data);
        return data;
    }
}
