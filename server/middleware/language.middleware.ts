import { Request, Response, NextFunction } from 'express';

export function GetLanguageMiddleware (
        req: Request & { language: string },
        res: Response,
        next: NextFunction
    ) {
        req.language = req.headers["accept-language"] || "en";
        next();
}
