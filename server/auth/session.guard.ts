import {
    CanActivate,
    ExecutionContext, Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Configuration, V0alpha2Api, V0alpha2ApiInterface } from '@ory/client';
export class SessionGuard implements CanActivate {
    constructor(private type: string = 'passport') {}

    async canActivate(context: ExecutionContext): Promise<boolean | Promise<boolean>> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        if (this.type === 'ory') {
            const ory = new V0alpha2Api(
                new Configuration({
                    basePath: process.env.ORY_SDK_URL,
                    accessToken: process.env.ORY_ACCESS_TOKEN,
                })
            );
            try {
                const { data: session } = await ory.toSession(undefined, request.header('Cookie'))
                request.user = {session};
                return true
            } catch (e) {
                response.redirect("/ory-login");
            }
        } else if (this.type === 'passport') {
            try {
                if (request.isAuthenticated && request.isAuthenticated()) {
                    return true;
                } else {
                    if (request.url.startsWith("/api")) {
                        return false;
                    } else {
                        response.redirect("/login");
                    }
                }
            } catch (e) {
                throw new UnauthorizedException();
            }
        } else {
            return false
        }
    }
}
