import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Logger from "./logger";

module.exports = async (options) => {
    const corsOptions = {
        origin: options?.config?.cors || "*",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
        allowedHeaders: ["accept", "x-requested-with", "content-type"],
    };
    // TODO: interface app with service-runner metrics interface
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(options.logger),
        cors: corsOptions,
    });
    app.setGlobalPrefix("api");
    await app.listen(options.config.port);
    options.logger.log(
        "info",
        `${options.name} with PID ${process.pid} listening on ${
            options.config.interface || "*"
        }:${options.config.port}`
    );
    return app;
};
