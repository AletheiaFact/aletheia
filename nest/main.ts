import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Logger from "./logger";
import * as passport from "passport";
import * as session from "express-session";
const cookieParser = require("cookie-parser");

const initApp = async (options) => {
    const corsOptions = {
        origin: options?.config?.cors || "*",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
        allowedHeaders: ["accept", "x-requested-with", "content-type"],
    };
    const app = await NestFactory.create(AppModule.register(options), {
        logger: new Logger(options.logger) || undefined,
        cors: corsOptions,
    });

    app.use(cookieParser());
    app.use(
        session({
            secret: "replace_me",
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

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

module.exports = initApp;
