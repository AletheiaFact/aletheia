declare module "y-websocket/bin/utils" {
    import type { Request } from "express";

    interface SetupOptions {
        docName?: string;
        gc?: boolean;
    }

    export function setupWSConnection(
        conn: WebSocket,
        req: Request,
        options?: SetupOptions
    ): void;
}
