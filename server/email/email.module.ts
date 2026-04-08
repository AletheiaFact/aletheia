import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigModule } from "@nestjs/config";


/**
 * @deprecated Unused. Email is handled by NotificationService via Novu.
 * Scheduled for removal.
 */
@Module({
    exports: [EmailService],
    imports: [ConfigModule],
    providers: [EmailService],
})
export class EmailModule {}
