import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
} from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import type {
    IReportService,
    ReportSourceInput,
} from "../../interfaces/report.service.interface";
import type { IReport } from "../../interfaces/report.interface";
import type { ISource } from "../../interfaces/source.interface";
import type { ISourceService } from "../../interfaces/source.service.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { toError } from "../../util/error-handling";
import { isValidClassification } from "../shared/report.rules";
import { report } from "./schema/report.schema";
import type { ReportRow } from "./schema/report.schema";

export function toReportEntity(row: ReportRow): IReport {
    const { dataHash, userId, legacyObjectId, isDeleted, deletedAt, ...rest } =
        row;
    return {
        ...rest,
        _id: row.id,
        data_hash: dataHash,
        usersId: userId ?? undefined,
    } as unknown as IReport;
}

@Injectable()
export class PostgresReportService implements IReportService {
    private readonly logger = new Logger(PostgresReportService.name);

    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        @Inject("SourceService") private readonly sourceService: ISourceService
    ) {}

    async create(input: Record<string, any>): Promise<IReport> {
        if (!isValidClassification(input.classification)) {
            throw new BadRequestException(
                "Classification doesn't match options"
            );
        }
        const [row] = await this.db
            .insert(report)
            .values({
                dataHash: input.data_hash,
                reportModel: input.reportModel,
                userId: input.usersId ? String(input.usersId) : null,
                summary: input.summary,
                questions: input.questions ?? [],
                report: input.report ?? null,
                verification: input.verification ?? null,
                sources: (input.sources ?? []).map((s: any) =>
                    typeof s === "string" ? s : s.href
                ),
                classification: input.classification,
            })
            .returning();

        if (input.sources) {
            this.createReportSources(input.sources, row.id);
        } else {
            this.updateReportSource(input as any, row.id).catch((error) =>
                this.logSourceFailure(row.id, error)
            );
        }
        return this.toEntity(row);
    }

    createReportSources(sources: ReportSourceInput[], targetId: string): void {
        for (const source of sources) {
            this.sourceService
                .create({ href: source.href, props: source?.props, targetId })
                .catch((error) => this.logSourceFailure(targetId, error));
        }
    }

    updateReportSource(
        {
            classification,
            summary,
            data_hash,
        }: { classification: string; summary: string; data_hash: string },
        targetId: string
    ): Promise<ISource> {
        return this.sourceService.update(data_hash, {
            props: { classification, summary, date: new Date() },
            targetId,
        } as any);
    }

    async findByDataHash(data_hash: string): Promise<IReport | null> {
        if (!data_hash) {
            throw new BadRequestException("Invalid data hash provided.");
        }
        const [row] = await this.db
            .select()
            .from(report)
            .where(eq(report.dataHash, data_hash))
            .orderBy(asc(report.createdAt), asc(report.id))
            .limit(1);
        return row ? this.toEntity(row) : null;
    }

    private toEntity(row: ReportRow): IReport {
        return toReportEntity(row);
    }

    private logSourceFailure(reportId: string, error: unknown) {
        const err = toError(error);
        this.logger.error(
            `Failed to link a source to report ${reportId}: ${err.message}`,
            err.stack
        );
    }
}
