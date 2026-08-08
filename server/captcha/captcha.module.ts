import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createCaptchaProvider } from "./captcha-provider.factory";
import { CAPTCHA_PROVIDER } from "./captcha.tokens";
import { CaptchaController } from "./captcha.controller";
import { CaptchaService } from "./captcha.service";

@Module({
    imports: [HttpModule, ConfigModule],
    exports: [CaptchaService],
    providers: [
        CaptchaService,
        {
            provide: CAPTCHA_PROVIDER,
            inject: [ConfigService, HttpService],
            useFactory: createCaptchaProvider,
        },
    ],
    controllers: [CaptchaController],
})
export class CaptchaModule {}
