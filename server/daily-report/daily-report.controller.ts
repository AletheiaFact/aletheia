import { Controller, Param, Post } from "@nestjs/common";
import { AdminOnly } from "../auth/decorators/auth.decorator";
import { DailyReportService } from "../daily-report/daily-report.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { NotificationService } from "../notifications/notifications.service";
import { SourceService } from "../source/source.service";
import { SourceProps } from "../source/dto/create-source.dto";

interface DailyReportQuery {
    date?: object;
    isHidden?: boolean;
    isDeleted?: boolean;
    nameSpace: string;
    props?: SourceProps;
}

@Controller()
export class DailyReportController {
    constructor(
        private readonly dailyReportService: DailyReportService,
        private claimReviewService: ClaimReviewService,
        private notificationService: NotificationService,
        private sourceService: SourceService
    ) {}

    @AdminOnly()
    @Post("api/daily-report/topic/:topic/send/:nameSpace")
    async sendDailyReport(
        @Param("topic") topic,
        @Param("nameSpace") nameSpace
    ) {
        const claimReviewsQuery: DailyReportQuery = {
            isHidden: false,
            isDeleted: false,
            nameSpace,
        };
        const sourceReviewsQuery: DailyReportQuery = { nameSpace };

        const [lastDailyReportSent] =
            await this.dailyReportService.getLastDailyReportSent({ nameSpace });

        if (lastDailyReportSent) {
            claimReviewsQuery.date = { $gt: lastDailyReportSent?.date };
            sourceReviewsQuery["props.date"] = {
                $gt: lastDailyReportSent?.date,
            };
        }

        const dailyReviews = (
            await Promise.all([
                this.claimReviewService.listDailyClaimReviews(
                    claimReviewsQuery
                ),
                this.sourceService.listAllDailySourceReviews(
                    sourceReviewsQuery
                ),
            ])
        ).reduce((acc, current) => [...acc, ...current], []);

        if (dailyReviews.length > 0) {
            const reports = dailyReviews.map((review: any) =>
                review?.report?._id ? review.report._id : review._id
            );

            await this.dailyReportService.create({
                reports,
                nameSpace,
                date: new Date(),
            });
        }

        const dailyReport = await this.dailyReportService.generateDailyReport(
            dailyReviews,
            nameSpace
        );

        this.notificationService.sendDailyReviewsEmail(topic, dailyReport);

        if (dailyReviews.length < 1) {
            throw new Error("No daily reports today");
        }

        return dailyReviews;
    }
}
