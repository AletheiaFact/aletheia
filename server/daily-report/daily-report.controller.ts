import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { DailyReportService } from "../daily-report/daily-report.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { NotificationService } from "../notifications/notifications.service";

@Controller()
export class DailyReportController {
    constructor(
        private readonly dailyReportService: DailyReportService,
        private claimReviewService: ClaimReviewService,
        private notificationService: NotificationService
    ) {}

    @Post("api/daily-report/topic/:topic/send/:nameSpace")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async sendDailyReport(
        @Param("topic") topic,
        @Param("nameSpace") nameSpace
    ) {
        const queryParams: any = { isHidden: false, isDeleted: false };
        const [lastDailyReportSent] =
            await this.dailyReportService.getLastDailyReportSent({ nameSpace });

        if (lastDailyReportSent) {
            queryParams.date = { $gt: lastDailyReportSent?.date };
        }

        const dailyClaimReviews =
            await this.claimReviewService.listDailyClaimReviews({
                page: 0,
                pageSize: 30,
                order: "asc",
                nameSpace,
                query: queryParams,
            });

        if (dailyClaimReviews.length > 0) {
            const reportIds = dailyClaimReviews.map(({ report }) => report._id);
            await this.dailyReportService.create({
                reports: reportIds,
                date: new Date(),
                nameSpace: nameSpace,
            });
        }

        const dailyReport = await this.dailyReportService.generateDailyReport(
            dailyClaimReviews,
            nameSpace
        );

        this.notificationService.sendDailyReviewsEmail(topic, dailyReport);

        if (dailyClaimReviews.length < 1) {
            throw new Error("No daily reports today");
        }

        return dailyClaimReviews;
    }
}
