import { Module } from "@nestjs/common";
import { ViewController } from "./view.controller";
import { ViewService } from "./view.service";
import {ConfigModule} from "@nestjs/config";
import { CaptchaModule } from "../captcha/captcha.module";

@Module({
    imports: [ConfigModule, CaptchaModule],
    providers: [ViewService],
    controllers: [ViewController],
    exports: [ViewService]
})
export class ViewModule {}
