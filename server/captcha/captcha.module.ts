import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CaptchaController } from "./captcha.controller";
import { CaptchaService } from "./captcha.service";

@Module({
    imports: [HttpModule, ConfigModule],
    exports: [CaptchaService],
    providers: [CaptchaService],
    controllers: [CaptchaController],
})
export class CaptchaModule {}
