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
        const isApiRequest = url.startsWith("/api");

        if (isApiRequest) {
            this.logger.log(`API URL not found: ${url}`);
            response
                .status(status)
                .json({ status: status, message: "Not Found" });
        } else {
            this.logger.log(`Next.js URL not found: ${url}`);
            response.status(status).redirect("/404");
        }
    }
}
