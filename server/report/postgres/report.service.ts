import { Inject, Injectable } from "@nestjs/common";
import type {
    IReportService,
    ReportSourceInput,
} from "../../interfaces/report.service.interface";
import type { IReport } from "../../interfaces/report.interface";
import type { ISource } from "../../interfaces/source.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";

@Injectable()
export class PostgresReportService implements IReportService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    create(_report: Record<string, any>): Promise<IReport> {
        throw new NotImplementedError("postgres", "create");
    }

    createReportSources(
        _sources: ReportSourceInput[],
        _targetId: string
    ): void {
        throw new NotImplementedError("postgres", "createReportSources");
    }

    updateReportSource(
        _report: { classification: string; summary: string; data_hash: string },
        _targetId: string
    ): Promise<ISource> {
        throw new NotImplementedError("postgres", "updateReportSource");
    }

    findByDataHash(_data_hash: string): Promise<IReport | null> {
        throw new NotImplementedError("postgres", "findByDataHash");
    }
}
