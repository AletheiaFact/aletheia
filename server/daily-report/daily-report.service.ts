import { Injectable, Scope, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import {
    DailyReport,
    DailyReportDocument,
} from "./schemas/daily-report.schema";
import { InjectModel } from "@nestjs/mongoose";
import { SummarizationService } from "../summarization/summarization.service";

@Injectable({ scope: Scope.REQUEST })
export class DailyReportService {
    private readonly logger = new Logger("SummarizationLogger");
    constructor(
        @InjectModel(DailyReport.name)
        private DailyReportModel: Model<DailyReportDocument>,
        private summarizationService: SummarizationService
    ) {}

    async create(dailyReportBody: DailyReport): Promise<DailyReport> {
        return new this.DailyReportModel(dailyReportBody).save();
    }

    async getLastDailyReportSent(query): Promise<DailyReport[]> {
        return await this.DailyReportModel.find(query)
            .sort({ date: -1 })
            .limit(1);
    }

    async generateDailyReport(
        dailyClaimReviews,
        nameSpace?: string
    ): Promise<string> {
        try {
            const summarizedReviews =
                await this.summarizationService.getSummarizedReviews(
                    dailyClaimReviews
                );

            return this.summarizationService.generateHTMLReport(
                summarizedReviews,
                nameSpace
            );
        } catch (error) {
            this.logger.error("Error generating daily report:", error);
            throw new Error("Failed to generate daily report");
        }
    }
}
