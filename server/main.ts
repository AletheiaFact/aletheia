import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import loadConfig from "./configLoader";
import * as dotenv from "dotenv";
import { WinstonLogger } from "./winstonLogger";
import { AllExceptionsFilter } from "./filters/http-exception.filter";
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
        allowedHeaders: [
            "accept",
            "x-requested-with",
            "content-type",
            "x-request-id",
        ],
        exposedHeaders: ["x-request-id"],
    };

    const logger = new WinstonLogger();

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
        logger.error(
            `Uncaught Exception: ${error.message}`,
            error.stack,
            "UncaughtException"
        );
        setTimeout(() => process.exit(1), 1000);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: any) => {
        const errorMessage =
            reason instanceof Error
                ? `${reason.message}\n${reason.stack}`
                : String(reason);
        logger.error(
            `Unhandled Rejection: ${errorMessage}`,
            "",
            "UnhandledRejection"
        );
    });

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

    // Global exception filter for consistent error handling and logging
    app.useGlobalFilters(new AllExceptionsFilter());

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
