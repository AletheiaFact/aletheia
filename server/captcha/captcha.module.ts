import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CaptchaService } from "./captcha.service";

@Module({
    imports: [HttpModule, ConfigModule],
    exports: [CaptchaService],
    providers: [CaptchaService],
})
export class CaptchaModule {}
