import { randomUUID } from "crypto";
import { Types } from "mongoose";
import type { IVerificationRequestStatsService } from "../interfaces/verification-request.service.interface";
import { MongoVerificationRequestStatsService } from "./mongo/verification-request-stats.service";
import { PostgresVerificationRequestStatsService } from "./postgres/verification-request-stats.service";
import {
    getTestVerificationRequestModel,
    resetTestVerificationRequests,
    stopTestMongo,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { verificationRequest } from "./postgres/schema/verification-request.schema";
import { VerificationRequestStatus } from "./dto/types";

type Row = { status: string; sourceChannel: string; date: Date };

const backends: Array<{
    name: string;
    setup: () => Promise<{
        service: IVerificationRequestStatsService;
        insert: (rows: Row[]) => Promise<void>;
    }>;
}> = [
    {
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            return {
                service: new PostgresVerificationRequestStatsService(db),
                insert: async (rows) => {
                    for (const row of rows) {
                        await db.insert(verificationRequest).values({
                            ...row,
                            dataHash: randomUUID(),
                            content: "c",
                        });
                    }
                },
            };
        },
    },
    {
        name: "mongodb",
        setup: async () => {
            const model = await getTestVerificationRequestModel();
            await resetTestVerificationRequests();
            return {
                service: new MongoVerificationRequestStatsService(model as any),
                insert: async (rows) => {
                    for (const row of rows) {
                        await model.create({
                            ...row,
                            data_hash: new Types.ObjectId().toString(),
                            content: "c",
                        });
                    }
                },
            };
        },
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)(
    "verification-request stats contract: $name",
    ({ setup }) => {
        it("returns zeros and empty lists on an empty collection", async () => {
            const { service } = await setup();
            expect(await service.getStats()).toEqual({
                statsCount: {
                    total: 0,
                    totalThisMonth: 0,
                    verified: 0,
                    inAnalysis: 0,
                    pending: 0,
                },
                statsSourceChannels: [],
                statsRecentActivity: [],
            });
        }, 60_000);

        it("counts by status, this month by date, groups channels by count and lists the latest ten", async () => {
            const { service, insert } = await setup();
            const now = new Date();
            const lastYear = new Date(now.getFullYear() - 1, 0, 10);
            await insert([
                {
                    status: VerificationRequestStatus.POSTED,
                    sourceChannel: "Web",
                    date: now,
                },
                {
                    status: VerificationRequestStatus.IN_TRIAGE,
                    sourceChannel: "Web",
                    date: now,
                },
                {
                    status: VerificationRequestStatus.PRE_TRIAGE,
                    sourceChannel: "whatsapp",
                    date: lastYear,
                },
                {
                    status: VerificationRequestStatus.DECLINED,
                    sourceChannel: "instagram",
                    date: lastYear,
                },
                ...Array.from({ length: 8 }, () => ({
                    status: VerificationRequestStatus.PRE_TRIAGE,
                    sourceChannel: "Web",
                    date: lastYear,
                })),
            ]);
            const stats = await service.getStats();
            expect(stats.statsCount).toEqual({
                total: 12,
                totalThisMonth: 2,
                verified: 1,
                inAnalysis: 1,
                pending: 10,
            });
            expect(stats.statsSourceChannels[0]).toEqual({
                label: "Web",
                value: 10,
                percentage: (10 / 12) * 100,
            });
            expect(
                stats.statsSourceChannels.slice(1).map((c) => c.value)
            ).toEqual([1, 1]);
            expect(stats.statsRecentActivity).toHaveLength(10);
            expect(stats.statsRecentActivity[0]).toMatchObject({
                status: VerificationRequestStatus.PRE_TRIAGE,
                sourceChannel: "Web",
            });
            expect(stats.statsRecentActivity[0].data_hash).toHaveLength(8);
            expect(stats.statsRecentActivity[0].timestamp).toBeInstanceOf(Date);
            expect(typeof stats.statsRecentActivity[0].id).toBe("string");
        }, 60_000);
    }
);
