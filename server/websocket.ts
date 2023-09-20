import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { WebsocketModule } from "./yjs-websocket/websocket.module";
import { WsAdapter } from "@nestjs/platform-ws";
import Logger from "./logger";

const initApp = async (options) => {
    const { config } = options;

    const app = await NestFactory.create<NestExpressApplication>(
        WebsocketModule.register(options),
        {
            logger: new Logger(options.logger) || undefined,
        }
    );
    app.enableCors();

    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(config.port);

    options.logger.log(
        "info",
        `${options.name} with PID ${process.pid} listening on ${
            options.config.interface || "*"
        }:${options.config.port}`
    );
    return app;
};

module.exports = initApp;
