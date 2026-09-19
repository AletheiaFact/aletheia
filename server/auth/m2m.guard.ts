import { Injectable, ExecutionContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { BaseGuard } from "./base.guard";
import { TokenIdentityService } from "./token-identity.service";
import { toError } from "../util/error-handling";

@Injectable()
export class M2MGuard extends BaseGuard {
    protected readonly logger = new Logger(M2MGuard.name);

    constructor(
        configService: ConfigService,
        reflector: Reflector,
        private readonly tokenIdentity: TokenIdentityService
    ) {
        super(configService, reflector);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractBearerToken(request.headers["authorization"]);
        if (!token) return false;
        try {
            const user = await this.tokenIdentity.resolveBearerToken(token);
            if (!user) return false;
            request.user = user;
            return true;
        } catch (error) {
            const err = toError(error);
            this.logger.error(`M2M token resolution failed: ${err.message}`, err.stack);
            return false;
        }
    }
}
