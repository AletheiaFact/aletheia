import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { randomUUID } from "crypto";
import type { ISourceService } from "../interfaces/source.service.interface";
import { MongoSourceService } from "./mongo/source.service";
import { PostgresSourceService } from "./postgres/source.service";
import {
    getTestSourceModel,
    resetTestSources,
    stopTestMongo,
    missingMongoId,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";

/**
 * Dual-backend contract suite (D4.1): BOTH backends are always registered —
 * Mongo via mongodb-memory-server, Postgres via pglite, in-process, no
 * DB_TYPE gate. Intentional divergences live in source.postgres.spec.ts and
 * the "Known divergences" table in docs/postgres-migration-foundation.md.
 */

type Backend = "postgres" | "mongodb";

/**
 * Normalize Mongo ObjectId / PG uuid for identity comparison. Asserts the id
 * exists so two id-less objects never compare equal.
 */
const idOf = (x: any): string => {
    const value = x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

/**
 * "No usable entity for this reference": Postgres throws NotFoundException
 * (404); Mongo resolves null (documented divergence, prod-authoritative).
 */
async function expectNoUsableEntity(promise: Promise<any>): Promise<void> {
    let result: any;
    try {
        result = await promise;
    } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        return;
    }
    expect(result).toBeNull();
}

const backends: Array<{
    name: Backend;
    setup: () => Promise<ISourceService>;
    makeMissingId: () => string;
    /** A syntactically valid target/user id for this backend. */
    makeRefId: () => string;
}> = [
    {
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            return new PostgresSourceService(db) as unknown as ISourceService;
        },
        makeMissingId: () => "00000000-0000-0000-0000-000000000000",
        makeRefId: () => randomUUID(),
    },
    {
        name: "mongodb",
        setup: async () => {
            const model = await getTestSourceModel();
            await resetTestSources();
            return new MongoSourceService(
                model as any
            ) as unknown as ISourceService;
        },
        makeMissingId: missingMongoId,
        makeRefId: () => new Types.ObjectId().toString(),
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)(
    "source contract: $name",
    ({ setup, makeMissingId, makeRefId }) => {
        let service: ISourceService;
        let n = 0;

        /** Unique href per call so data_hash dedup only fires when intended. */
        const freshHref = () => `https://example.org/article-${++n}`;

        const makeSource = (overrides: Record<string, any> = {}) =>
            service.create({
                href: freshHref(),
                user: makeRefId(),
                nameSpace: "main",
                ...overrides,
            });

        beforeEach(async () => {
            service = await setup();
        }, 60_000);

        it("create persists the source and derives data_hash from the href", async () => {
            const href = freshHref();
            const created: any = await makeSource({ href });
            expect(idOf(created)).toBeTruthy();
            expect(created.href).toBe(href);
            expect(created.data_hash).toBeTruthy();

            const fetched: any = await service.getByDataHash(created.data_hash);
            expect(idOf(fetched)).toBe(idOf(created));
            expect(fetched.href).toBe(href);
        });

        it("create rejects an href without protocol with BadRequestException", async () => {
            await expect(
                makeSource({ href: "example.org/no-protocol" })
            ).rejects.toBeInstanceOf(BadRequestException);
            await expect(
                makeSource({ href: undefined })
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it("create dedups on data_hash: same href returns the existing source", async () => {
            const href = freshHref();
            const first: any = await makeSource({ href });
            const second: any = await makeSource({ href });
            expect(idOf(second)).toBe(idOf(first));
        });

        it("create wraps a scalar targetId into a one-element array", async () => {
            const target = makeRefId();
            const created: any = await makeSource({ targetId: target });
            expect(created.targetId).toHaveLength(1);
            expect(String(created.targetId[0])).toBe(target);
        });

        it("getSourceByHref returns the source, or null when absent", async () => {
            const href = freshHref();
            await makeSource({ href });
            const found: any = await service.getSourceByHref(href);
            expect(found?.href).toBe(href);

            const missing = await service.getSourceByHref(
                "https://example.org/never-created"
            );
            expect(missing).toBeNull();
        });

        it("getByDataHash throws NotFoundException when absent (both backends)", async () => {
            await expect(
                service.getByDataHash("no-such-hash")
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("getById yields no usable entity for a missing id", async () => {
            await expectNoUsableEntity(
                Promise.resolve(service.getById(makeMissingId()))
            );
        });

        it("getById returns the source for an existing id", async () => {
            const created: any = await makeSource();
            const fetched: any = await service.getById(idOf(created));
            expect(idOf(fetched)).toBe(idOf(created));
        });

        it("updateTargetId appends a target and throws NotFoundException for a missing id", async () => {
            const target1 = makeRefId();
            const created: any = await makeSource({ targetId: target1 });

            const target2 = makeRefId();
            const updated: any = await service.updateTargetId(
                idOf(created),
                target2
            );
            expect(updated.targetId.map(String)).toEqual([target1, target2]);

            await expect(
                service.updateTargetId(makeMissingId(), makeRefId())
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("getByTargetId returns only sources containing that target, paginated", async () => {
            const target = makeRefId();
            const a: any = await makeSource({ targetId: target });
            const b: any = await makeSource({ targetId: target });
            await makeSource({ targetId: makeRefId() });

            const rows: any[] = await service.getByTargetId(
                target,
                0,
                10,
                "asc"
            );
            expect(rows.map(idOf).sort()).toEqual([idOf(a), idOf(b)].sort());

            const page0 = await service.getByTargetId(target, 0, 1, "asc");
            const page1 = await service.getByTargetId(target, 1, 1, "asc");
            expect(page0).toHaveLength(1);
            expect(page1).toHaveLength(1);
            expect(idOf(page0[0])).not.toBe(idOf(page1[0]));
        });

        it("update merges the body onto the source found by data_hash", async () => {
            const created: any = await makeSource();
            const target = makeRefId();

            const updated: any = await service.update(created.data_hash, {
                props: { classification: "trustworthy", summary: "ok" },
                targetId: target,
            });

            expect(idOf(updated)).toBe(idOf(created));
            expect(updated.props).toMatchObject({
                classification: "trustworthy",
                summary: "ok",
            });
            expect(updated.targetId.map(String)).toEqual([target]);
            // href untouched, data_hash not recomputed
            expect(updated.href).toBe(created.href);
            expect(updated.data_hash).toBe(created.data_hash);
        });

        it("update throws NotFoundException for an unknown data_hash", async () => {
            await expect(
                service.update("no-such-hash", { props: {} })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("listAll returns only classified sources in the nameSpace, paginated", async () => {
            // Unclassified — must never appear.
            await makeSource();
            // Classified in another namespace — must never appear.
            const other: any = await makeSource({ nameSpace: "other" });
            await service.update(other.data_hash, {
                props: { classification: "trustworthy" },
            });

            const classified: string[] = [];
            for (let i = 0; i < 3; i++) {
                const s: any = await makeSource();
                await service.update(s.data_hash, {
                    props: { classification: "trustworthy" },
                });
                classified.push(idOf(s));
            }

            const all: any[] = await service.listAll({
                page: 0,
                pageSize: "10",
                order: "asc",
                nameSpace: "main",
            });
            expect(all.map(idOf).sort()).toEqual([...classified].sort());

            const page0 = await service.listAll({
                page: 0,
                pageSize: "2",
                order: "asc",
                nameSpace: "main",
            });
            const page1 = await service.listAll({
                page: 1,
                pageSize: "2",
                order: "asc",
                nameSpace: "main",
            });
            expect(page0).toHaveLength(2);
            expect(page1).toHaveLength(1);
        });

        it("count counts only classified sources in the nameSpace", async () => {
            await makeSource(); // unclassified
            const s: any = await makeSource();
            await service.update(s.data_hash, {
                props: { classification: "trustworthy" },
            });
            const other: any = await makeSource({ nameSpace: "other" });
            await service.update(other.data_hash, {
                props: { classification: "trustworthy" },
            });

            const total = await service.count({ nameSpace: "main" });
            expect(total).toBe(1);
        });

        it("listAllDailySourceReviews filters by nameSpace and props.date > $gt", async () => {
            const old: any = await makeSource();
            await service.update(old.data_hash, {
                props: {
                    classification: "trustworthy",
                    date: new Date("2020-01-01T00:00:00Z"),
                },
            });
            const recent: any = await makeSource();
            await service.update(recent.data_hash, {
                props: {
                    classification: "trustworthy",
                    date: new Date("2030-01-01T00:00:00Z"),
                },
            });
            await makeSource(); // unclassified — excluded

            const all: any[] = await service.listAllDailySourceReviews({
                nameSpace: "main",
            });
            expect(all.map(idOf).sort()).toEqual(
                [idOf(old), idOf(recent)].sort()
            );

            const afterCutoff: any[] = await service.listAllDailySourceReviews({
                nameSpace: "main",
                "props.date": { $gt: new Date("2025-01-01T00:00:00Z") },
            });
            expect(afterCutoff.map(idOf)).toEqual([idOf(recent)]);
        });
    }
);
