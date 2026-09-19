import { PostgresPersonalityService } from "./postgres/personality.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { DuplicateKeyError, NotImplementedError } from "../database/errors";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "personality postgres-only",
    () => {
        let service: PostgresPersonalityService;

        beforeEach(async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            const wikidataStub = {
                queryWikibaseEntities: async () => [],
            } as any;
            const configStub = {
                get: (key: string) =>
                    key === "db.postgres.fuzzy_threshold" ? 0.3 : undefined,
            } as any;
            service = new PostgresPersonalityService(
                db,
                wikidataStub,
                configStub
            );
        });

        it("findAll fuzzy-matches a 1-edit typo on name", async () => {
            await service.create({
                name: "Ada Lovelace",
                slug: "ada-lovelace",
                description: "x",
            });
            await service.create({
                name: "Alan Turing",
                slug: "alan-turing",
                description: "y",
            });

            const res = await service.findAll({
                searchText: "Ada Lovelce", // 1-char typo
                pageSize: 10,
            });

            expect(res.totalRows).toBeGreaterThanOrEqual(1);
            expect(res.processedPersonalities[0]?.name).toBe("Ada Lovelace");
        });

        it("listAll without query returns recent rows paginated", async () => {
            for (let i = 0; i < 5; i++) {
                await service.create({
                    name: `P${i}`,
                    slug: `p${i}`,
                    description: "x",
                });
            }
            const page0 = await service.listAll(0, 3, "desc", {}, "en", false);
            expect(page0).toHaveLength(3);
            const page1 = await service.listAll(1, 3, "desc", {}, "en", false);
            expect(page1).toHaveLength(2);
        });

        it("listAll with pageSize=0 returns ALL rows (Mongo limit(0) parity — sitemap)", async () => {
            for (let i = 0; i < 4; i++) {
                await service.create({
                    name: `Q${i}`,
                    slug: `q${i}`,
                    description: "x",
                });
            }
            const all = await service.listAll(0, 0, "asc", {}, "pt", false);
            expect(all).toHaveLength(4);
        });

        it("listAll guards unsupported surface with NotImplementedError", async () => {
            await expect(
                service.listAll(0, 10, "random", {}, "en", false)
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.listAll(0, 10, "asc", {}, "en", true)
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.listAll(
                    0,
                    10,
                    "asc",
                    { name: { $regex: "x" } },
                    "en",
                    false
                )
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("count excludes hidden rows by default and includes them when asked", async () => {
            const a = await service.create({
                name: "Visible",
                slug: "visible",
                description: "x",
            });
            const b = await service.create({
                name: "Hidden",
                slug: "hidden",
                description: "x",
            });
            await service.hideOrUnhidePersonality(
                (b as any).id,
                true,
                "reason"
            );
            expect(await service.count()).toBe(1);
            expect(await service.count({ isHidden: false })).toBe(1);
            expect(await service.count({ isHidden: true })).toBe(1);
            await service.delete((a as any).id);
            expect(await service.count()).toBe(0);
        });

        it("count guards unsupported query keys with NotImplementedError", async () => {
            await expect(
                service.count({ name: { $regex: "x" }, isDeleted: false })
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("create defaults description to empty string when omitted (documented divergence: Mongo requires it)", async () => {
            const created = await service.create({ name: "No Desc" });
            expect((created as any).description).toBe("");
        });

        it("a soft-deleted wikidata does not block findOrCreate of a live one (documented divergence: Mongo's sparse unique index also covers deleted rows and throws E11000)", async () => {
            const first = await service.create({
                name: "Ada",
                description: "x",
                wikidata: "Q42",
            });
            await service.delete((first as any).id);

            // Must NOT throw a unique-violation — the partial index excludes
            // soft-deleted rows. (findOrCreatePersonality has no restore
            // branch on either backend.)
            const second = await service.findOrCreatePersonality({
                name: "Ada Again",
                wikidata: { id: "Q42" },
            });
            expect((second as any)._id).toBeDefined();
            expect((second as any)._id).not.toBe((first as any)._id);
        });

        it("create with an already-live wikidata throws DuplicateKeyError naming the field", async () => {
            await service.create({
                name: "First",
                description: "x",
                wikidata: "Q42",
            });
            await expect(
                service.create({
                    name: "Second",
                    description: "y",
                    wikidata: "Q42",
                })
            ).rejects.toMatchObject(
                expect.objectContaining({
                    name: "DuplicateKeyError",
                    fields: ["wikidata"],
                })
            );
            await expect(
                service.create({
                    name: "Second",
                    description: "y",
                    wikidata: "Q42",
                })
            ).rejects.toBeInstanceOf(DuplicateKeyError);
        });
    }
);

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "personality cross-collection deferrals",
    () => {
        let service: PostgresPersonalityService;
        beforeEach(async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            const wikidataStub = {
                queryWikibaseEntities: async () => [],
            } as any;
            const configStub = {
                get: (key: string) =>
                    key === "db.postgres.fuzzy_threshold" ? 0.3 : undefined,
            } as any;
            service = new PostgresPersonalityService(
                db,
                wikidataStub,
                configStub
            );
        });

        it.each([
            [
                "getClaimsByPersonalitySlug",
                () => service.getClaimsByPersonalitySlug({ slug: "x" }),
            ],
            [
                "getReviewStats",
                () =>
                    service.getReviewStats(
                        "00000000-0000-0000-0000-000000000000"
                    ),
            ],
            ["combinedListAll", () => service.combinedListAll({})],
            [
                "extractClaimWithTextSummary",
                () => service.extractClaimWithTextSummary([]),
            ],
        ])("%s throws NotImplementedError", async (_name, call) => {
            // `call()` may throw synchronously (e.g. extractClaimWithTextSummary
            // is non-async) or reject (async methods). Wrap in an async IIFE so
            // both forms surface as a rejected promise.
            await expect((async () => call())()).rejects.toBeInstanceOf(
                NotImplementedError
            );
        });
    }
);
