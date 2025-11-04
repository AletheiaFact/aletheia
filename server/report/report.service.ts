import { BadRequestException, Injectable } from "@nestjs/common";
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

    create(report) {
        if (
            !Object.values(ClassificationEnum).includes(report.classification)
        ) {
            throw new Error("Classification doesn't match options");
        }
        const newReport = new this.ReportModel(report);

        if (report.sources) {
            this.createReportSources(report.sources, newReport.id);
        } else {
            this.updateReportSource(report, newReport.id);
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

  findByDataHash(data_hash: string) {
  if (!data_hash || typeof data_hash !== "string" || data_hash.length !== 32) {
    throw new BadRequestException("Invalid data hash provided.");
  }

  return this.ReportModel.findOne({ data_hash: { $eq: data_hash } });
}
}