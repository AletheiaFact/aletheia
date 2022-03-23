import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response } from 'express'

@Injectable()
export class GetLanguageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        req.language = req.headers["accept-language"] || "en";
        next()
    }
}