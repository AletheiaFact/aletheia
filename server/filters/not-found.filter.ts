import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    NotFoundException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * Filters out not found exceptions and redirect to our custom 404 page, avoiding the default json error message
 */
@Catch(NotFoundException)
export class NotFoundFilter<NotFoundException> implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        response.redirect("/404");
    }
}
