import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SourceService } from "../source/source.service";
import { SourceTargetModel } from "../source/schemas/source.schema";
import { Report, ReportDocument } from "./schemas/report.schema";
import { ClassificationEnum } from "../claim-review/dto/create-claim-review.dto";

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name)
        private ReportModel: Model<ReportDocument>,
        private sourceService: SourceService
    ) {}

    async create(report) {
        if (Object.values(ClassificationEnum).includes(report.classification)) {
            const newReport = new this.ReportModel(report);
            if (report.sources && Array.isArray(report.sources)) {
                for (const source of report.sources) {
                    await this.sourceService.create({
                        link: source,
                        targetId: newReport.id,
                        targetModel: SourceTargetModel.ClaimReview,
                    });
                }
            }
            newReport.save();
            return newReport;
        } else {
            throw new Error("Classification doesn't match options");
        }
    }

    findBySentenceHash(sentence_hash) {
        return this.ReportModel.findOne({ sentence_hash });
    }
}
