import { PostgresPersonalityService } from "./postgres/personality.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { NotImplementedError } from "../database/errors";

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
            service = new PostgresPersonalityService(db, wikidataStub);
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
            service = new PostgresPersonalityService(db, wikidataStub);
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
