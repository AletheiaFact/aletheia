import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SourceService } from "../source/source.service";
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

        if (report.sources) {
            await this.createReportSources(report.sources, newReport.id);
        } else {
            await this.updateReportSource(report, newReport.id);
        }

        newReport.save();
        return newReport;
    }

    createReportSources(sources, targetId) {
        for (const source of sources) {
            this.sourceService.create({
                href: source.href,
                props: source?.props,
                targetId,
            });
        }
    }

    updateReportSource({ classification, summary, data_hash }, targetId) {
        const newSourceBody = {
            props: {
                classification: classification,
                summary: summary,
                date: new Date(),
            },
            targetId,
        };

        return this.sourceService.update(data_hash, newSourceBody);
    }

    findByDataHash(data_hash) {
        return this.ReportModel.findOne({ data_hash });
    }
}
