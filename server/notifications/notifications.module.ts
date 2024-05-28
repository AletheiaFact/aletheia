import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NotificationService } from "./notifications.service";
import { NovuProvider } from "./novu.provider";
import { NotificationController } from "./notification.controller";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { SummarizationModule } from "../summarization/summarization.module";
import { EmailModule } from "../email/email.module";
import { AbilityModule } from "../auth/ability/ability.module";

@Module({
    imports: [
        ConfigModule,
        ClaimReviewModule,
        SummarizationModule,
        EmailModule,
        AbilityModule,
    ],
    exports: [NotificationService],
    providers: [NotificationService, NovuProvider],
    controllers: [NotificationController],
})
export class NotificationModule {}
