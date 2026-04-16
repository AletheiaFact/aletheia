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

        const userId = (request as any).user?._id || "anonymous";
        const userAgent = request.headers["user-agent"] || "unknown";

        const diagnostics: Record<string, unknown> = {
            userId,
            userAgent,
        };

        if (request.query && Object.keys(request.query).length > 0) {
            diagnostics.query = request.query;
        }

        if (
            request.body &&
            typeof request.body === "object" &&
            Object.keys(request.body).length > 0
        ) {
            diagnostics.bodyKeys = Object.keys(request.body);
        }

        if (request.params && Object.keys(request.params).length > 0) {
            diagnostics.params = request.params;
        }

        this.logger.error(
            `${request.method} ${request.url} | Status: ${status} | RequestId: ${requestId} | Error: ${errorMessage} | Context: ${JSON.stringify(diagnostics)}`,
            exception instanceof Error ? exception.stack : ""
        );

        // Sanitize response message to prevent stack trace / XSS exposure
        let safeMessage: string | object;
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            safeMessage = "Internal server error";
        } else if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            safeMessage =
                typeof exceptionResponse === "object"
                    ? exceptionResponse
                    : String(exceptionResponse);
        } else {
            safeMessage = "An error occurred";
        }

        // Send error response only if headers haven't been sent
        if (!response.headersSent) {
            const isApiRequest = request.originalUrl.startsWith("/api");
            const shouldRedirect = [
                HttpStatus.NOT_FOUND,
                HttpStatus.INTERNAL_SERVER_ERROR,
            ].includes(status);

            if (!isApiRequest && shouldRedirect) {
                return response.redirect("/404");
            }

            response.status(status).json({
                requestId,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: safeMessage,
            });
        }
    }
}
