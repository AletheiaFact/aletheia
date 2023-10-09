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
        if (
            !Object.values(ClassificationEnum).includes(report.classification)
        ) {
            throw new Error("Classification doesn't match options");
        }
        const newReport = new this.ReportModel(report);

        for (const source of report.sources) {
            await this.sourceService.create({
                href: source.href,
                props: source?.props,
                targetId: newReport.id,
            });
        }

        newReport.save();
        return newReport;
    }

    findByDataHash(data_hash) {
        return this.ReportModel.findOne({ data_hash });
    }
}
