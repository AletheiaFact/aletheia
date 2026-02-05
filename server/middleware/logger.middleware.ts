import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            requestId?: string;
            startTime?: number;
        }
    }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger("HTTP");

    use(request: Request, response: Response, next: NextFunction): void {
        const startTime = Date.now();
        const { ip, method, originalUrl } = request;
        const userAgent = request.get("user-agent") || "";

        // Generate or use existing request ID
        const requestId =
            (request.headers["x-request-id"] as string) ||
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Attach to request for use in exception filters and services
        request.requestId = requestId;
        request.startTime = startTime;
        request.headers["x-request-id"] = requestId;
        response.setHeader("x-request-id", requestId);

        response.on("finish", () => {
            const { statusCode } = response;
            const contentLength = response.get("content-length") || 0;
            const responseTime = Date.now() - startTime;

            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength} ${responseTime}ms - ${userAgent} ${ip}`
            );
        });

        next();
    }
}
