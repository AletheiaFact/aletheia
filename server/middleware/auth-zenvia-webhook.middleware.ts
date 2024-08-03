import {
    Injectable,
    Logger,
    NestMiddleware,
    UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthZenviaWebHookMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) {}
    private logger = new Logger("HTTP");

    async use(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const { ip, method, originalUrl } = request;
        const { api_token } = this.configService.get("zenvia");
        const userAgent = request.get("user-agent") || "";

        const authHeader = request.headers["authorization"];
        if (!authHeader) {
            throw new UnauthorizedException("Authorization header is missing");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new UnauthorizedException("Token is missing");
        }

        if (token !== api_token) {
            throw new UnauthorizedException("Invalid token");
        }

        response.on("finish", () => {
            const { statusCode } = response;
            const contentLength = response.get("content-length");

            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
            );
        });

        next();
    }
}
