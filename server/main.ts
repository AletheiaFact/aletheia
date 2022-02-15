import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import Logger from "./logger";
import * as passport from "passport";
import * as session from "express-session";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

const initApp = async (options) => {
    const corsOptions = {
        origin: options?.config?.cors || "*",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
        allowedHeaders: ["accept", "x-requested-with", "content-type"],
    };

    options.db = {
        connection_uri: `mongodb://${mongodb_host}/${mongodb_name}`,
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    }
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options),
        {
            logger: new Logger(options.logger) || undefined,
            cors: corsOptions,
        }
    );

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )

    app.use(cookieParser());
    app.use(
        session({
            secret: "replace_me",
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: options.db.connection_uri,
                mongoOptions: options.db.options
            })
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.useStaticAssets(join(__dirname, "..", "public"));
    // app.setGlobalPrefix("api");
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
