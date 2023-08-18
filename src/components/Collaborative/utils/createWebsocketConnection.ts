import * as Y from "yjs";

import { WebsocketProvider } from "y-websocket";

export function createWebsocketConnection(hash: string) {
    console.log("new doc");
    const ydoc = new Y.Doc();
    setCookie("roomName", hash, 1); // Change the expiration (1 day in this case)

    return new WebsocketProvider("ws://localhost:5001", "", ydoc);
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}
