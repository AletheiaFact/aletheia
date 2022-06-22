import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SourceService } from "../source/source.service";
import { SourceTargetModel } from "../source/schemas/source.schema";
import { Report, ReportDocument } from "./schemas/report.schema";

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name)
        private ReportModel: Model<ReportDocument>,
        private sourceService: SourceService
    ) {}

    async create(report) {
        const newReport = new this.ReportModel(report);
        if (report.sources && Array.isArray(report.sources)) {
            try {
                for (let i = 0; i < report.sources.length ; i++) {
                    await this.sourceService.create({
                        link: report.sources[i],
                        targetId: newReport.id,
                        targetModel: SourceTargetModel.ClaimReview,
                    });
                }
            } catch (e) {
                throw e;
            }
        }
        newReport.save();
        return newReport;
    }

    findBySentenceHash(sentence_hash) {
        return this.ReportModel.findOne({ sentence_hash })
    }
}
