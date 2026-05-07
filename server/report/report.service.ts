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

    create(report: any) {
        if (
            !Object.values(ClassificationEnum).includes(report.classification)
        ) {
            throw new BadRequestException(
                "Classification doesn't match options"
            );
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

    createReportSources(
        sources: Array<{ href: string; props?: any }>,
        targetId: string
    ) {
        for (const source of sources) {
            this.sourceService.create({
                href: source.href,
                props: source?.props,
                targetId,
            });
        }
    }

    updateReportSource(
        {
            classification,
            summary,
            data_hash,
        }: { classification: string; summary: string; data_hash: string },
        targetId: string
    ) {
        const newSourceBody = {
            props: {
                classification: classification,
                summary: summary,
                date: new Date(),
            },
            targetId,
        };

        return this.sourceService.update(data_hash, newSourceBody as any);
    }

    findByDataHash(data_hash: string) {
        if (!data_hash) {
            throw new BadRequestException("Invalid data hash provided.");
        }

        return this.ReportModel.findOne({ data_hash: { $eq: data_hash } });
    }
}
