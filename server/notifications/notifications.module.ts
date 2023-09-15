import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NotificationService } from "./notifications.service";
import { NovuProvider } from "./novu.provider";

@Module({
    imports: [ConfigModule],
    exports: [NotificationService],
    providers: [NotificationService, NovuProvider],
})
export class NotificationModule {}
