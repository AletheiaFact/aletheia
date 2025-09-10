import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionsHandler');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Extract error details
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception instanceof Error
                ? exception.message
                : 'Internal server error';

        // Get request ID from request object (set by logger middleware)
        const requestId = (request as any).requestId || 
                         request.headers['x-request-id'] || 
                         `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Log detailed error information
        const errorDetails = {
            requestId,
            method: request.method,
            url: request.url,
            path: request.path,
            params: request.params,
            query: request.query,
            body: request.body,
            headers: {
                'user-agent': request.headers['user-agent'],
                'content-type': request.headers['content-type'],
                'referer': request.headers['referer'],
            },
            ip: request.ip || request.connection.remoteAddress,
            statusCode: status,
            timestamp: new Date().toISOString(),
            error: exception instanceof Error ? {
                name: exception.name,
                message: exception.message,
                stack: exception.stack,
            } : exception,
        };

        // Special handling for "headers already sent" error
        if (exception instanceof Error && exception.message.includes('Cannot set headers after they are sent')) {
            this.logger.error(
                `Headers already sent error - Request: ${request.method} ${request.url} | RequestId: ${requestId} | Route: ${request.route?.path || 'unknown'} | IP: ${errorDetails.ip}`,
                exception.stack,
                'DoubleResponse'
            );
            
            // Don't try to send another response if headers are already sent
            if (!response.headersSent) {
                response.status(status).json({
                    requestId,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: 'An error occurred processing your request',
                });
            }
            return;
        }

        // Log the error with full context
        this.logger.error(
            `${request.method} ${request.url} | Status: ${status} | RequestId: ${requestId} | Message: ${JSON.stringify(message)}`,
            exception instanceof Error ? exception.stack : '',
            'HTTP'
        );

        // Send error response only if headers haven't been sent
        if (!response.headersSent) {
            response.status(status).json({
                requestId,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message,
            });
        }
    }
}