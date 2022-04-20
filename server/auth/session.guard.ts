import {
    CanActivate,
    ExecutionContext, Injectable,
} from "@nestjs/common";
import { Configuration, V0alpha2Api } from '@ory/client';
import { Reflector } from "@nestjs/core";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private readonly reflector: Reflector
    ) {}

    // @ts-ignore
    async canActivate(context: ExecutionContext): Promise<boolean | Promise<boolean>> {
        const isPublic = this.reflector.get<boolean>('public', context.getHandler());

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const type = this.configService.get<string>('authentication_type')

        try {
            if (type === 'ory') {
                const ory = new V0alpha2Api(
                    new Configuration({
                        basePath: this.configService.get<string>('ory.url'),
                        accessToken: this.configService.get<string>('access_token'),
                    })
                );
                const { data: session } = await ory.toSession(undefined, request.header('Cookie'))
                request.user = { _id: session?.identity?.traits?.user_id };
                return true
            }

            if ((type === 'passport') && request.isAuthenticated && request.isAuthenticated()) {
                return true;
            }
            this.redirect(request, response);
        } catch (e) {
            if (isPublic) {
                return true
            }
            // TODO: logging
            this.redirect(request, response);
        }
    }

    redirect(request, response) {
        if (request.url.startsWith("/api")) {
            return false;
        } else {
            response.redirect("/login");
        }
    }
}
