/* eslint-disable @typescript-eslint/no-empty-function */
import {
    OnGatewayConnection,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Request } from "express";
import { Server } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";
import * as url from "url";
import * as querystring from "querystring";

@WebSocketGateway()
export class YjsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    // @TODO - This should be replaced with a database
    handleConnection(connection: WebSocket, request: Request): void {
        const parsedUrl = url.parse(request.url);
        const parsedQs = querystring.parse(parsedUrl.query);
        const docName = (parsedQs.claimTask as string) || "";
        // Check if the room already has a Yjs document, if not, create a new one
        setupWSConnection(connection, request, { ...(docName && { docName }) });
    }
}
