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

@WebSocketGateway() // Remove the path parameter here
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer()
    server: Server;
    // Maintain a mapping of rooms to their respective Yjs documents
    private roomToDocumentMap: Map<string, Doc> = new Map();
    handleConnection(connection: WebSocket, request: Request): void {
        const roomName = this.getCookie(request?.headers?.cookie, "roomName");

        // Check if the room already has a Yjs document, if not, create a new one
        let ydoc = this.roomToDocumentMap.get(roomName);
        if (!ydoc) {
            ydoc = new Doc();
            this.roomToDocumentMap.set(roomName, ydoc);
        }
        // Associate the Yjs document with the connection
        setupWSConnection(connection, request, { doc: ydoc });
    }

    private getCookie = (cookie: string, n: string): string => {
        if (!cookie) return "";
        const a = `; ${cookie}`.match(`;\\s*${n}=([^;]+)`);
        return a ? a[1] : "";
    };

    handleDisconnect(): void {
        // Clean up resources if needed
    }
}
