import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CaptchaController } from "./captcha.controller";

@Module({
    imports: [
        HttpModule,
        ConfigModule
    ],
    controllers: [CaptchaController]
})
export class CaptchaModule {}
