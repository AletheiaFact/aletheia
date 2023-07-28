import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export function createWebsocketConnection(hash: string) {
    const ydoc = new Y.Doc();
    return new WebsocketProvider("ws://localhost:1234", hash, ydoc);
}
