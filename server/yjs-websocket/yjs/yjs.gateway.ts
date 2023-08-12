import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
} from "@nestjs/websockets";
import { WebSocketServer as server } from "ws"; // Import WebSocketServer from 'ws'

@WebSocketGateway({ path: "/yjs" }) // Remove port argument
export class YjsGateway {
    @WebSocketServer()
    server: server; // Change WebSocketServer type to 'WebSocketServer'

    @SubscribeMessage("yjs")
    findAll(@MessageBody() data: any): any {
        console.log("Get yjs message " + data);
        return data;
    }
}
