import * as Y from "yjs";

import { WebsocketProvider } from "y-websocket";

export function createWebsocketConnection(hash: string) {
    const ydoc = new Y.Doc();

    // @TODO get this from the config yaml through SSR
    return new WebsocketProvider("ws://localhost:5001", "", ydoc, {
        params: { claimTask: hash },
        disableBc: true,
    });
}
