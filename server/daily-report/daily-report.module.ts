import { Module } from "@nestjs/common";
import { DailyReport, DailyReportSchema } from "./schemas/daily-report.schema";
import { DailyReportService } from "./daily-report.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AbilityModule } from "../auth/ability/ability.module";
import { SummarizationModule } from "../summarization/summarization.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { NotificationModule } from "../notifications/notifications.module";
import { DailyReportController } from "./daily-report.controller";
import { ConfigModule } from "@nestjs/config";
import { SourceModule } from "../source/source.module";

export const DailyReportModel = MongooseModule.forFeature([
    {
        name: DailyReport.name,
        schema: DailyReportSchema,
    },
]);

@Module({
    imports: [
        DailyReportModel,
        ClaimReviewModule,
        SourceModule,
        SummarizationModule,
        AbilityModule,
        NotificationModule,
        ConfigModule,
    ],
    providers: [DailyReportService],
    controllers: [DailyReportController],
    exports: [DailyReportService],
})
export class DailyReportModule {}
