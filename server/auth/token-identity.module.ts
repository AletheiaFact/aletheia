import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import OryModule from "./ory/ory.module";
import { TokenIdentityService } from "./token-identity.service";

@Global()
@Module({
    imports: [ConfigModule, OryModule],
    providers: [TokenIdentityService],
    exports: [TokenIdentityService],
})
export class TokenIdentityModule {}
