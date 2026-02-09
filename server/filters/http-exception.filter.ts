import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { randomUUID } from "crypto";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception instanceof Error
                ? exception.message
                : "Internal server error";

        const requestId =
            (request as any).requestId ||
            request.headers["x-request-id"] ||
            randomUUID();

        const errorContext = {
            requestId,
            method: request.method,
            url: request.url,
            ip: request.ip || request.socket?.remoteAddress,
            statusCode: status,
        };

        // Handle "headers already sent" error
        if (
            exception instanceof Error &&
            exception.message.includes("Cannot set headers after they are sent")
        ) {
            this.logger.error(
                `Headers already sent - ${request.method} ${request.url} | RequestId: ${requestId}`,
                exception.stack
            );
            return;
        }

        // Log the error with context
        const errorMessage =
            typeof message === "string" ? message : JSON.stringify(message);
        this.logger.error(
            `${request.method} ${request.url} | Status: ${status} | RequestId: ${requestId} | Error: ${errorMessage}`,
            exception instanceof Error ? exception.stack : ""
        );

        // Send error response only if headers haven't been sent
        if (!response.headersSent) {
            response.status(status).json({
                requestId,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message:
                    status === HttpStatus.INTERNAL_SERVER_ERROR
                        ? "Internal server error"
                        : message,
            });
        }
    }
}
