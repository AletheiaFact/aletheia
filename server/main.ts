import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import Logger from "./logger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const initApp = async (options) => {
    const corsOptions = {
        origin: options?.config?.cors || "*",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
        allowedHeaders: ["accept", "x-requested-with", "content-type"],
    };

    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options),
        {
            bodyParser: false,
            logger: new Logger(options.logger) || undefined,
            cors: corsOptions,
        }
    );

    mongoose.set("useCreateIndex", true);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    // FIXME: not working but we need to enable in the future
    // app.use(helmet());
    app.use(cookieParser());
    app.useStaticAssets(join(__dirname, "..", "public"), {
        setHeaders: (res: any) => {
            res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable"
            );
        },
    });
    await app.listen(options.config.port);
    options.logger.log(
        "info",
        `${options.name} with PID ${process.pid} listening on ${
            options.config.interface || "*"
        }:${options.config.port}`
    );
    return app;
};

module.exports = initApp;
