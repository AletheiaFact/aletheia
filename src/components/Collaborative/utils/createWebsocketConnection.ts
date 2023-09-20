import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function createWebsocketConnection(hash: string, websocketUrl: string) {
    const ydoc = new Y.Doc();

    return new WebsocketProvider(websocketUrl, "", ydoc, {
        params: { claimTask: hash },
        disableBc: true,
    });
}
