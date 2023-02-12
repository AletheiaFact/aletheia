import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * Filters out Unauthorized Exception and redirect to our custom acess denied page, avoiding the default json error message
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter<UnauthorizedException>
    implements ExceptionFilter
{
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        response.redirect(
            `/unauthorized?originalUrl=${response.req.originalUrl}`
        );
    }
}
