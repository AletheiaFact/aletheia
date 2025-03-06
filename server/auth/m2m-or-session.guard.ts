import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { SessionGuard } from "./session.guard";
import { M2MGuard } from "./m2m.guard";

@Injectable()
export class SessionOrM2MGuard implements CanActivate {
    constructor(
        private readonly sessionGuard: SessionGuard,
        private readonly m2mGuard: M2MGuard
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const m2mOk = await this.m2mGuard.canActivate(context);
        if (m2mOk) {
            return true;
        }

        const sessionOk = await this.sessionGuard.canActivate(context);
        if (sessionOk) {
            return true;
        }

        return false;
    }
}
