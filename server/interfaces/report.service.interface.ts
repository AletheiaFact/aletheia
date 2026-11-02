import type { IReport } from "./report.interface";
import type { ISource } from "./source.interface";

export type ReportSourceInput = { href: string; props?: any };

export type IReportService = {
    create(report: Record<string, any>): IReport | Promise<IReport>;
    createReportSources(sources: ReportSourceInput[], targetId: string): void;
    updateReportSource(
        report: { classification: string; summary: string; data_hash: string },
        targetId: string
    ): Promise<ISource>;
    findByDataHash(data_hash: string): Promise<IReport | null>;
};
