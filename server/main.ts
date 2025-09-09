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

// Console log interceptor to route all logs through NestJS logger
function setupConsoleInterceptor(logger: WinstonLogger) {
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalError = console.error;

    const parseLogLevel = (message: string): 'info' | 'warn' | 'error' => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('error') || lowerMessage.includes('failed')) {
            return 'error';
        }
        if (lowerMessage.includes('warn') || lowerMessage.includes('deprecated')) {
            return 'warn';
        }
        return 'info';
    };

    const formatMessage = (args: any[]): string => {
        return args.map(arg => {
            if (arg instanceof Error) {
                // Properly format Error objects with stack trace
                return `${arg.name}: ${arg.message}${arg.stack ? '\n' + arg.stack : ''}`;
            } else if (typeof arg === 'object' && arg !== null) {
                // Check if it's an error-like object
                if ('message' in arg && 'stack' in arg) {
                    return `${arg.name || 'Error'}: ${arg.message}${arg.stack ? '\n' + arg.stack : ''}`;
                }
                // Try to stringify regular objects
                try {
                    const stringified = JSON.stringify(arg, null, 2);
                    // If it returns empty object, try to get more info
                    if (stringified === '{}' && Object.keys(arg).length > 0) {
                        // Use util.inspect for better object representation
                        return Object.entries(arg)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ');
                    }
                    return stringified;
                } catch (e) {
                    // Fallback for circular structures
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
    };

    console.log = (...args: any[]) => {
        const message = formatMessage(args);
        const level = parseLogLevel(message);
        
        if (level === 'error') {
            logger.error(message, '', 'Console');
        } else if (level === 'warn') {
            logger.warn(message, 'Console');
        } else {
            logger.log(message, 'Console');
        }
    };

    console.info = (...args: any[]) => {
        const message = formatMessage(args);
        logger.log(message, 'Console');
    };

    console.warn = (...args: any[]) => {
        const message = formatMessage(args);
        logger.warn(message, 'Console');
    };

    console.error = (...args: any[]) => {
        const message = formatMessage(args);
        logger.error(message, '', 'Console');
    };
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
    
    // Setup console interceptor to route all logs through NestJS logger
    setupConsoleInterceptor(logger);

    // Add better uncaught exception handling
    process.on('uncaughtException', (error: Error) => {
        logger.error(`Uncaught Exception: ${error.message}`, error.stack, 'UncaughtException');
        // Give logger time to write before exiting
        setTimeout(() => process.exit(1), 1000);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        const errorMessage = reason instanceof Error 
            ? `${reason.message}\n${reason.stack}` 
            : String(reason);
        logger.error(`Unhandled Rejection at: ${promise}, reason: ${errorMessage}`, '', 'UnhandledRejection');
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

    // mongoose.set("useCreateIndex", true); // Deprecated in Mongoose 6+, createIndexes is now the default

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    // Add global exception filter for better error tracking
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
