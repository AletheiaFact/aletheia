import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { WebsocketModule } from "./yjs-websocket/websocket.module";
import { WsAdapter } from "@nestjs/platform-ws";
import loadConfig from "./configLoader";
import { WinstonLogger } from "./winstonLogger";

async function initApp() {
    const options = loadConfig();

    const logger = new WinstonLogger();
    const app = await NestFactory.create<NestExpressApplication>(
        WebsocketModule.register(options)
    );
    app.enableCors();

    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(options.port);

    logger.log(
        `${options.name} with PID ${process.pid} listening on ${
            options.interface || "*"
        }:${options.port}`
    );
    return app;
}

initApp();
