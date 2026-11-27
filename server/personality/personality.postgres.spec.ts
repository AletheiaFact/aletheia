import { PostgresPersonalityService } from "./postgres/personality.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { NotImplementedError } from "../database/errors";
import { personality } from "./postgres/schema/personality.schema";
import { deriveSlug } from "./shared/personality.rules";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "personality postgres-only",
    () => {
        let service: PostgresPersonalityService;
        // create() only accepts a Wikidata item now, so listing and counting
        // fixtures are inserted straight into the table.
        const seed = async (row: {
            name: string;
            slug?: string;
            description?: string;
            isHidden?: boolean;
        }) => {
            const db = await getTestDrizzle();
            const [inserted] = await db
                .insert(personality)
                .values({
                    name: row.name,
                    slug: row.slug ?? deriveSlug(row.name),
                    description: row.description ?? "x",
                    isHidden: row.isHidden ?? false,
                })
                .returning();
            return inserted;
        };

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
            await seed({
                name: "Ada Lovelace",
                slug: "ada-lovelace",
                description: "x",
            });
            await seed({
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

        it("findAll excludes hidden personalities from results and totalRows (Mongo $match parity)", async () => {
            await seed({
                name: "Grace Hopper",
                description: "visible",
            });
            await seed({
                name: "Grace Hoppers",
                description: "hidden",
                isHidden: true,
            });

            const res = await service.findAll({
                searchText: "Grace Hopper",
                pageSize: 10,
            });
            expect(res.totalRows).toBe(1);
            expect(res.processedPersonalities).toHaveLength(1);
            expect(res.processedPersonalities[0]?.name).toBe("Grace Hopper");

            const noSearch = await service.findAll({ pageSize: 10 } as any);
            expect(noSearch.totalRows).toBe(1);
            expect(noSearch.processedPersonalities[0]?.name).toBe(
                "Grace Hopper"
            );
        });

        it("listAll without query returns recent rows paginated", async () => {
            for (let i = 0; i < 5; i++) {
                await seed({
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
                await seed({
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
            const a = await seed({
                name: "Visible",
                slug: "visible",
                description: "x",
            });
            const b = await seed({
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
        ])("%s throws NotImplementedError", async (_name, call) => {
            await expect((async () => call())()).rejects.toBeInstanceOf(
                NotImplementedError
            );
        });

        it("extractClaimWithTextSummary is a shared rule (unblocked by Phase 2)", () => {
            expect(
                service.extractClaimWithTextSummary([
                    { content: { text: "t" } },
                ])
            ).toEqual([{ content: "t" }]);
        });
    }
);
