import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";

/**
 * Filters out Unauthorized Exception and redirect to our custom access denied page, avoiding the default json error message.
 * API requests receive a JSON response so the frontend can handle the redirect.
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        const url = request.originalUrl;
        const isApiRequest = url.startsWith("/api");

        if (isApiRequest) {
            this.logger.log(
                `Unauthorized API request: ${request.method} ${url}`
            );
            response.status(401).json({
                statusCode: 401,
                message: "Unauthorized",
                path: url,
            });
        } else {
            this.logger.log(
                `Unauthorized page request, redirecting: ${url}`
            );
            response.redirect(
                `/unauthorized?originalUrl=${encodeURIComponent(url)}`
            );
        }
    }
}
