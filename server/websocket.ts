import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { WebsocketModule } from "./yjs-websocket/websocket.module";
import { WsAdapter } from "@nestjs/platform-ws";
// const cookieParser = require("cookie-parser");

const initApp = async (options) => {
    const app = await NestFactory.create<NestExpressApplication>(
        WebsocketModule
    );
    app.enableCors();
    // app.use(cookieParser());

    // Use your custom YwsAdapter to create the WebSocket server
    // app.useWebSocketAdapter(new YwsAdapter(app));
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(5002);
    console.log(`Application is running on: ${await app.getUrl()}`);
    return app;
};

module.exports = initApp;
