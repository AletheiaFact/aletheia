// Polyfill for File constructor to fix undici compatibility issue
if (typeof global.File === 'undefined') {
    (global as any).File = class File {
        name: string;
        size: number;
        type: string;
        lastModified: number;
        
        constructor(blobParts: any, filename: string, options?: any) {
            this.name = filename || '';
            this.size = 0;
            this.type = options?.type || '';
            this.lastModified = options?.lastModified || Date.now();
        }
    };
}

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import loadConfig from "./configLoader";
import * as dotenv from "dotenv";
import { WinstonLogger } from "./winstonLogger";
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

    const logger = new WinstonLogger();

    const app = await NestFactory.create<NestExpressApplication>(
        AppModule.register(options),
        {
            bodyParser: false,
            logger: logger,
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
        `${options.name} with PID ${process.pid} listening on ${
            options.interface || "*"
        }:${options.port}`
    );
    return app;
}

initApp();
