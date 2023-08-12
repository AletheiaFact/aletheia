import * as Y from "yjs";

import { WebsocketProvider } from "y-websocket";

export function createWebsocketConnection(hash: string) {
    const YjsSocket = new WebSocket("ws://localhost:5001");
    YjsSocket.onopen = function () {
        console.log("Nest Connected");
        YjsSocket.send(
            JSON.stringify({
                event: "yjs",
                data: ydoc,
            })
        );

        YjsSocket.onmessage = function (data) {
            console.log(data);
        };
    };

    const ydoc = new Y.Doc();

    return new WebsocketProvider("ws://localhost:5001", hash, ydoc, {
        WebSocketPolyfill: WebSocket,
    });
}
