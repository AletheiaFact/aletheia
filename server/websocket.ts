import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { WebsocketModule } from "./yjs-websocket/websocket.module";
import { WsAdapter } from "@nestjs/platform-ws";
import { Logger } from "@nestjs/common";
const fs = require("fs");
const yaml = require("js-yaml");

async function initApp() {
    const defaultConfigFilePath = "config.yaml";
    const doc = yaml.load(fs.readFileSync(defaultConfigFilePath, "utf8"));

    const { conf: options } = doc.services[0];

    const logger = new Logger();
    const app = await NestFactory.create<NestExpressApplication>(
        WebsocketModule.register(options)
    );
    app.enableCors();

    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(options.port);

    logger.log(
        "info",
        `${options.name} with PID ${process.pid} listening on ${
            options.interface || "*"
        }:${options.port}`
    );
    return app;
}

initApp();
