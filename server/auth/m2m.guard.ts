import { Injectable, ExecutionContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { BaseGuard } from "./base.guard";
import { TokenIdentityService } from "./token-identity.service";

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
        const user = await this.tokenIdentity.resolveBearerToken(token);
        if (!user) return false;
        request.user = user;
        return true;
    }
}
