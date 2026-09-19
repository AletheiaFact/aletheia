import { Module } from "@nestjs/common";
import { CaptchaModule } from "../captcha/captcha.module";
import { NotificationModule } from "../notifications/notifications.module";
import { CommitteeInterestController } from "./committee-interest.controller";

@Module({
    imports: [CaptchaModule, NotificationModule],
    controllers: [CommitteeInterestController],
})
export class CommitteeInterestModule {}
