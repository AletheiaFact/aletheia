import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";

export class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        try {
            if (request.isAuthenticated && request.isAuthenticated()) {
                return true;
            } else {
                response.redirect("/login");
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
