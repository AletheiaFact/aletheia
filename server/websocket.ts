import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { WebsocketModule } from "./yjs-websocket/websocket.module";
import { WsAdapter } from "@nestjs/platform-ws";
const cookieParser = require("cookie-parser");

const initApp = async (options) => {
    const { config } = options;

    const app = await NestFactory.create<NestExpressApplication>(
        WebsocketModule
    );
    app.enableCors();
    app.use(cookieParser());

    // Use your custom YwsAdapter to create the WebSocket server
    // app.useWebSocketAdapter(new YwsAdapter(app));
    app.useWebSocketAdapter(new WsAdapter(app));
    console.log("aqui poora");
    await app.listen(config.port);
    console.log(`Application is running on: ${await app.getUrl()}`);
    return app;
};

module.exports = initApp;
