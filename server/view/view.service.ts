import { Injectable, OnModuleInit } from "@nestjs/common";
import createServer from "next";
import { NextServer } from "next/dist/server/next";

@Injectable()
export class ViewService implements OnModuleInit {
    private server: NextServer;

    constructor() {}

    async onModuleInit(): Promise<void> {
        try {
            this.server = await createServer({
                dev: process.env.ENVIRONMENT === "watch-dev",
                dir: "./",
            });
            await this.server.prepare();
        } catch (error) {
            console.error(error);
        }
    }

    getNextServer(): NextServer {
        return this.server;
    }
}
