import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NotificationService } from "./notifications.service";
import { NovuProvider } from "./novu.provider";
import { NotificationController } from "./notification.controller";

@Module({
    imports: [ConfigModule],
    exports: [NotificationService],
    providers: [NotificationService, NovuProvider],
    controllers: [NotificationController],
})
export class NotificationModule {}
