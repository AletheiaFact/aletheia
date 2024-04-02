import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import loadConfig from "./configLoader";
import * as dotenv from "dotenv";
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
dotenv.config();

const isLocal = process.env.ENV === "local";
if (!isLocal) {
    require("newrelic");
}

async function initApp() {
    const options = loadConfig();

    const corsOptions = {
        origin: options?.cors || "*",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
        allowedHeaders: ["accept", "x-requested-with", "content-type"],
    };

    const logger = new Logger();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options),
        {
            bodyParser: false,
            cors: corsOptions,
        }
    );

    const config = new DocumentBuilder()
        .setTitle("AletheiaFact.org")
        .setDescription(
            "AletheiaFact.org API endpoint OpenAPI specification. This is a work in progress."
        )
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

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
