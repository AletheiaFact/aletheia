import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';

@Injectable()
export class DisableBodyParserMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: () => any) {
        req['disableBodyParser'] = true
        next();
    }
}
