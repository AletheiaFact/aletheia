import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    NotFoundException,
    Logger,
} from "@nestjs/common";
import { Response, Request } from "express";

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
    private readonly logger = new Logger(NotFoundFilter.name);

    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const url = request.originalUrl;

        this.logger.log(`URL not found: ${url}`);

        response.status(status).redirect("/404");
    }
}
