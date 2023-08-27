/* eslint-disable @typescript-eslint/no-empty-function */
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Doc } from "yjs";
import { Request } from "express";
import { Server } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";
import * as url from "url";
import * as querystring from "querystring";

@WebSocketGateway() // Remove the path parameter here
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer()
    server: Server;
    // Maintain a mapping of rooms to their respective Yjs documents
    // @TODO - This should be replaced with a database
    handleConnection(connection: WebSocket, request: Request): void {
        const parsedUrl = url.parse(request.url);
        const parsedQs = querystring.parse(parsedUrl.query);
        // const roomName = this.getCookie(request?.headers?.cookie, "roomName");
        const docName = (parsedQs.claimTask as string) || "";
        // Check if the room already has a Yjs document, if not, create a new one
        setupWSConnection(connection, request, { ...(docName && { docName }) });
    }

    handleDisconnect(): void {
        // Clean up resources if needed
    }
}
