import { PostgresSourceService } from "./postgres/source.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { DuplicateKeyError, NotImplementedError } from "../database/errors";
import { randomUUID } from "crypto";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "source postgres-only",
    () => {
        let service: PostgresSourceService;
        let n = 0;
        const freshHref = () => `https://pg-only.example.org/a-${++n}`;

        beforeEach(async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            service = new PostgresSourceService(db);
        });

        it("create without user stores NULL (documented divergence: Mongo fabricates a random ObjectId)", async () => {
            const created: any = await service.create({ href: freshHref() });
            expect(created.user).toBeNull();
            expect(created.userId).toBeNull();
        });

        it("props.date is persisted in jsonb as an ISO string (documented divergence: Mongo stores a BSON Date)", async () => {
            const created: any = await service.create({
                href: freshHref(),
                props: {
                    classification: "x",
                    date: "2026-01-02T03:04:05.000Z",
                },
            });
            expect(created.props.date).toBe("2026-01-02T03:04:05.000Z");
        });

        it("guards unsupported surface loudly with NotImplementedError", async () => {
            await expect(
                service.listAllDailySourceReviews({ topic: "x" })
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.listAllDailySourceReviews({
                    "props.date": { $lt: new Date() },
                })
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.count({ name: { $regex: "x" } })
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.listAll({
                    page: 0,
                    pageSize: "not-a-number",
                    order: "asc",
                    nameSpace: "main",
                })
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.listAll({
                    page: 0,
                    pageSize: "10",
                    order: "random",
                    nameSpace: "main",
                })
            ).rejects.toBeInstanceOf(NotImplementedError);
            expect(() => service.find({ href: "x" })).toThrow(
                NotImplementedError
            );
            // data_hash IS a Mongo schema key update() would apply — guarded
            // here instead of silently stripped (documented divergence).
            const created: any = await service.create({ href: freshHref() });
            await expect(
                service.update(created.data_hash, { data_hash: "rewrite" })
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("maps a data_hash unique violation to DuplicateKeyError naming the field", async () => {
            await service.create({ href: "https://pg-only.example.org/dup" });
            const db = await getTestDrizzle();
            const { source } = await import("./postgres/schema/source.schema");
            const { deriveDataHash } = await import("./shared/source.rules");
            // Bypass create()'s dedup pre-check to simulate the insert race.
            const raced = db
                .insert(source)
                .values({
                    href: "https://pg-only.example.org/dup",
                    dataHash: deriveDataHash("https://pg-only.example.org/dup"),
                    targetIds: [],
                })
                .then(
                    () => {
                        throw new Error(
                            "insert should have violated source_data_hash_uq"
                        );
                    },
                    (error) => {
                        expect(() =>
                            (service as any).rethrowMapped(error)
                        ).toThrowError(DuplicateKeyError);
                        try {
                            (service as any).rethrowMapped(error);
                        } catch (mapped: any) {
                            expect(mapped.fields).toEqual(["data_hash"]);
                        }
                    }
                );
            await raced;
        });

        it("listAll orders by insertion time (created_at) — Mongo sorts by _id", async () => {
            // Explicit created_at values: deterministic regardless of clock
            // precision (sequential service.create timestamps could collide).
            const db = await getTestDrizzle();
            const { source } = await import("./postgres/schema/source.schema");
            const { deriveDataHash } = await import("./shared/source.rules");
            const mkRow = (href: string, createdAt: Date) =>
                db
                    .insert(source)
                    .values({
                        href,
                        dataHash: deriveDataHash(href),
                        targetIds: [],
                        props: { classification: "x" },
                        createdAt,
                    })
                    .returning()
                    .then(([r]) => r);
            const older = await mkRow(
                freshHref(),
                new Date("2026-01-01T00:00:00Z")
            );
            const newer = await mkRow(
                freshHref(),
                new Date("2026-01-02T00:00:00Z")
            );
            const asc: any[] = await service.listAll({
                page: 0,
                pageSize: "10",
                order: "asc",
                nameSpace: "main",
            });
            const desc: any[] = await service.listAll({
                page: 0,
                pageSize: "10",
                order: "desc",
                nameSpace: "main",
            });
            expect(asc.map((r) => r.id)).toEqual([older.id, newer.id]);
            expect(desc.map((r) => r.id)).toEqual([newer.id, older.id]);
        });

        it("getByTargetId uses uuid containment on target_ids", async () => {
            const target = randomUUID();
            const created: any = await service.create({
                href: freshHref(),
                targetId: target,
            });
            const rows: any[] = await service.getByTargetId(
                target,
                0,
                10,
                "asc"
            );
            expect(rows.map((r) => r.id)).toEqual([created.id]);
        });
    }
);
