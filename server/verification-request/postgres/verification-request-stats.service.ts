import { Inject, Injectable, Logger } from "@nestjs/common";
import { desc, gte, sql } from "drizzle-orm";
import type {
    IVerificationRequestStatsService,
    VerificationRequestStats,
} from "../../interfaces/verification-request.service.interface";
import type {
    StatsCount,
    StatsRecentActivity,
    StatsSourceChannels,
} from "../dto/stats-verification-request-dto";
import { VerificationRequestStatus } from "../dto/types";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { toError } from "../../util/error-handling";
import { verificationRequest } from "./schema/verification-request.schema";

@Injectable()
export class PostgresVerificationRequestStatsService
    implements IVerificationRequestStatsService
{
    private readonly logger = new Logger(
        PostgresVerificationRequestStatsService.name
    );

    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    async getStats(): Promise<VerificationRequestStats> {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );
            const statsCount = await this.getStatsCount(firstDayOfMonth);
            const statsSourceChannels = await this.getStatsSourceChannels(
                statsCount.total
            );
            const statsRecentActivity = await this.getStatsRecentActivity();
            return { statsCount, statsSourceChannels, statsRecentActivity };
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to get dashboard stats: ${err.message}`,
                err.stack
            );
            return {
                statsCount: {
                    total: 0,
                    totalThisMonth: 0,
                    verified: 0,
                    inAnalysis: 0,
                    pending: 0,
                },
                statsSourceChannels: [],
                statsRecentActivity: [],
            };
        }
    }

    private async getStatsCount(firstDayOfMonth: Date): Promise<StatsCount> {
        const statuses = await this.db
            .select({
                status: verificationRequest.status,
                count: sql<number>`count(*)::int`,
            })
            .from(verificationRequest)
            .groupBy(verificationRequest.status);
        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)::int` })
            .from(verificationRequest);
        const [{ totalThisMonth }] = await this.db
            .select({ totalThisMonth: sql<number>`count(*)::int` })
            .from(verificationRequest)
            .where(gte(verificationRequest.date, firstDayOfMonth));
        const statusMap: Record<string, number> = Object.fromEntries(
            statuses.map((s) => [s.status, s.count])
        );
        return {
            total,
            verified: statusMap[VerificationRequestStatus.POSTED] || 0,
            inAnalysis: statusMap[VerificationRequestStatus.IN_TRIAGE] || 0,
            pending:
                (statusMap[VerificationRequestStatus.PRE_TRIAGE] || 0) +
                (statusMap[VerificationRequestStatus.DECLINED] || 0),
            totalThisMonth,
        };
    }

    private async getStatsSourceChannels(
        totalCount?: number
    ): Promise<StatsSourceChannels[]> {
        const count = sql<number>`count(*)::int`;
        const rows = await this.db
            .select({ sourceChannel: verificationRequest.sourceChannel, count })
            .from(verificationRequest)
            .groupBy(verificationRequest.sourceChannel)
            .orderBy(desc(count), verificationRequest.sourceChannel);
        return rows.map((item) => ({
            label: item.sourceChannel || "Unknown",
            value: item.count,
            percentage:
                (totalCount ?? 0) > 0
                    ? (item.count / (totalCount ?? 1)) * 100
                    : 0,
        }));
    }

    private async getStatsRecentActivity(): Promise<StatsRecentActivity[]> {
        const rows = await this.db
            .select({
                id: verificationRequest.id,
                status: verificationRequest.status,
                sourceChannel: verificationRequest.sourceChannel,
                dataHash: verificationRequest.dataHash,
                updatedAt: verificationRequest.updatedAt,
            })
            .from(verificationRequest)
            .orderBy(
                desc(verificationRequest.updatedAt),
                desc(verificationRequest.id)
            )
            .limit(10);
        return rows.map((r) => ({
            id: r.id,
            status: r.status,
            sourceChannel: r.sourceChannel,
            data_hash: r.dataHash.substring(0, 8),
            timestamp: r.updatedAt,
        }));
    }
}
