import * as WebSocket from "ws";
import * as YwsServer from "../module/yws.server";

import { EMPTY, Observable, fromEvent } from "rxjs";
import { INestApplicationContext, WebSocketAdapter } from "@nestjs/common";
import { filter, mergeMap } from "rxjs/operators";

import { MessageMappingProperties } from "@nestjs/websockets";

export class YwsAdapter implements WebSocketAdapter {
    constructor(private app: INestApplicationContext) {}

    create(port: number, options: any = {}): any {
        console.log("porque nao vem aqui");
        console.log(
            "adapter creating at " + port + " " + JSON.stringify(options)
        );
        return new WebSocket.Server({ port, ...options });
    }

    bindClientConnect(server, callback: Function) {
        console.log("bind connection");
        server.on("connection", YwsServer.setupWSConnection);
    }

    bindMessageHandlers(
        client: WebSocket,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>
    ) {
        fromEvent(client, "message")
            .pipe(
                mergeMap((data) =>
                    this.bindMessageHandler(data, handlers, process)
                ),
                filter((result) => result)
            )
            .subscribe((response) => client.send(JSON.stringify(response)));
    }

    bindMessageHandler(
        buffer,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>
    ): Observable<any> {
        const message = JSON.parse(buffer.data);
        const messageHandler = handlers.find(
            (handler) => handler.message === message.event
        );
        if (!messageHandler) {
            return EMPTY;
        }
        return process(messageHandler.callback(message.data));
    }

    close(server) {
        server.close();
    }
}
