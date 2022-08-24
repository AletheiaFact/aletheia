import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
@Injectable()
export class GetLanguageMiddleware implements NestMiddleware {
    use(
        req: Request & { language: string },
        res: Response,
        next: NextFunction
    ) {
        req.language = req.cookies?.default_language || "pt";
        next();
    }
}
