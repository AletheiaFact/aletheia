import type { ITopicService } from "../interfaces/topic.service.interface";
import { MongoTopicService } from "./mongo/topic.service";
import { PostgresTopicService } from "./postgres/topic.service";
import {
    getTestTopicModel,
    resetTestTopics,
    stopTestMongo,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { IMPACT_AREAS } from "./constants/impact-areas";

/**
 * Dual-backend contract suite (D4.1): BOTH backends are always registered —
 * Mongo via mongodb-memory-server, Postgres via pglite, in-process, no
 * DB_TYPE gate. Intentional divergences live in topic.postgres.spec.ts and
 * the "Known divergences" table in docs/postgres-migration-foundation.md.
 */

type Backend = "postgres" | "mongodb";

const idOf = (x: any): string => {
    const value = x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

const wikidataStub = {
    queryWikibaseEntities: vi.fn(async (query: string, language: string) => [
        { id: "Q1", label: `${query}-${language}` },
    ]),
};

const backends: Array<{
    name: Backend;
    setup: () => Promise<ITopicService>;
}> = [
    {
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            return new PostgresTopicService(
                db,
                wikidataStub as any
            ) as unknown as ITopicService;
        },
    },
    {
        name: "mongodb",
        setup: async () => {
            const model = await getTestTopicModel();
            await resetTestTopics();
            // sentence/image services are only reached with a contentModel,
            // which the contract suite never passes.
            return new MongoTopicService(
                model as any,
                {} as any,
                {} as any,
                wikidataStub as any
            ) as unknown as ITopicService;
        },
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)("topic contract: $name", ({ setup }) => {
    let service: ITopicService;

    beforeEach(async () => {
        service = await setup();
    }, 60_000);

    describe("findOrCreateTopic", () => {
        it("creates a topic with a derived slug and default language", async () => {
            const created: any = await service.findOrCreateTopic({
                name: "Saúde Pública",
            });
            expect(idOf(created)).toBeTruthy();
            expect(created.slug).toBe("saude-publica");
            expect(created.name).toBe("Saúde Pública");
            expect(created.language).toBe("pt");
            expect(created.wikidataId).toBeUndefined();
        });

        it("returns the existing topic on a slug collision, keeping the original fields", async () => {
            const first: any = await service.findOrCreateTopic({
                name: "Meio Ambiente",
                wikidataId: "Q7",
                language: "pt",
            });
            const second: any = await service.findOrCreateTopic({
                name: "meio ambiente",
                wikidataId: "Q99",
                language: "en",
            });
            expect(idOf(second)).toBe(idOf(first));
            expect(second.wikidataId).toBe("Q7");
            expect(second.language).toBe("pt");
        });

        it("accepts a closed-list impact area and falls back from value to wikidataId", async () => {
            const area = IMPACT_AREAS[0];
            const created: any = await service.findOrCreateTopic(area);
            expect(created.slug).toBe(area.slug);

            const viaValue: any = await service.findOrCreateTopic({
                name: "Educação",
                value: "Q8",
            });
            expect(viaValue.wikidataId).toBe("Q8");
        });
    });

    describe("getBySlug", () => {
        it("returns the topic, or null when absent", async () => {
            const created: any = await service.findOrCreateTopic({
                name: "Economia",
            });
            const found: any = await service.getBySlug("economia");
            expect(idOf(found)).toBe(idOf(created));
            expect(await service.getBySlug("missing-slug")).toBeNull();
        });
    });

    describe("create", () => {
        it("creates wikidata picks and returns {id,label,value} refs", async () => {
            const refs: any[] = await service.create({
                topics: [
                    { label: "Saúde", value: "Q1", aliases: ["Health"] },
                    { label: "Educação", value: "Q2" },
                ],
            });
            expect(refs).toHaveLength(2);
            expect(refs[0]).toMatchObject({ label: "Saúde", value: "Q1" });
            expect(idOf(refs[0])).toBeTruthy();

            const stored: any = await service.getBySlug("saude");
            expect(stored.aliases).toEqual(["Health"]);
            expect(stored.wikidataId).toBe("Q1");
            expect(stored.language).toBe("pt");
        });

        it("uses the language argument for new topics", async () => {
            await service.create({ topics: ["Climate"] }, "en");
            const stored: any = await service.getBySlug("climate");
            expect(stored.language).toBe("en");
        });

        it("reports an existing wikidata topic as a ref and a plain one as its slug", async () => {
            await service.create({
                topics: [{ label: "Saúde", value: "Q1" }, "Cultura"],
            });
            const again: any[] = await service.create({
                topics: [{ label: "Saúde", value: "Q1" }, "Cultura"],
            });
            expect(again[0]).toMatchObject({ label: "Saúde", value: "Q1" });
            expect(again[1]).toBe("cultura");
        });

        it("resolves a {slug} reference to the existing topic without creating a duplicate", async () => {
            await service.create({ topics: ["Esporte"] });
            const refs: any[] = await service.create({
                topics: [{ slug: "esporte" }],
            });
            expect(refs).toEqual(["esporte"]);
            expect(await service.findByNames(["Esporte"])).toHaveLength(1);
        });
    });

    describe("searchTopics", () => {
        beforeEach(async () => {
            await service.create({
                topics: [
                    { label: "Saúde", value: "Q1", aliases: ["Health"] },
                    { label: "Educação", value: "Q2" },
                    { label: "Economia", value: "Q3" },
                ],
            });
            await service.create({ topics: ["Education"] }, "en");
        });

        it("matches names case-insensitively, sorted by name, scoped to the language", async () => {
            const results: any[] = await service.searchTopics("e", "pt", 10);
            expect(results.map((t) => t.name)).toEqual([
                "Economia",
                "Educação",
                "Saúde",
            ]);
            // "Health" (alias of Saúde) also contains the query.
            expect(results.map((t) => t.matchedAlias)).toEqual([
                null,
                null,
                "Health",
            ]);
            const en: any[] = await service.searchTopics("edu", "en");
            expect(en.map((t) => t.name)).toEqual(["Education"]);
        });

        it("matches aliases and reports the matched alias", async () => {
            const results: any[] = await service.searchTopics("heal", "pt");
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe("Saúde");
            expect(results[0].matchedAlias).toBe("Health");
        });

        it("honors the limit", async () => {
            const results: any[] = await service.searchTopics("e", "pt", 2);
            expect(results).toHaveLength(2);
        });

        it("rejects a non-string language with TypeError", async () => {
            await expect(
                service.searchTopics("e", 42 as any)
            ).rejects.toBeInstanceOf(TypeError);
        });
    });

    describe("findByNames", () => {
        it("matches names and aliases case-insensitively, exact only", async () => {
            await service.create({
                topics: [
                    { label: "Saúde", value: "Q1", aliases: ["Health"] },
                    { label: "Saúde Mental", value: "Q4" },
                ],
            });
            const byName: any[] = await service.findByNames(["saúde"]);
            expect(byName.map((t) => t.slug)).toEqual(["saude"]);
            const byAlias: any[] = await service.findByNames(["HEALTH"]);
            expect(byAlias.map((t) => t.slug)).toEqual(["saude"]);
            const regexSafe: any[] = await service.findByNames(["sa.de"]);
            expect(regexSafe).toEqual([]);
        });
    });

    describe("findByWikidataIds", () => {
        it("returns the topics whose wikidataId is in the list", async () => {
            await service.create({
                topics: [
                    { label: "A", value: "Q1" },
                    { label: "B", value: "Q2" },
                    { label: "C", value: "Q3" },
                ],
            });
            const found: any[] = await service.findByWikidataIds(["Q1", "Q3"]);
            expect(found.map((t) => t.wikidataId).sort()).toEqual(["Q1", "Q3"]);
            expect(await service.findByWikidataIds(["Q404"])).toEqual([]);
        });
    });

    describe("wikidata delegation", () => {
        it("findAll and getWikidataEntities forward to the wikidata service", async () => {
            const viaFindAll = await service.findAll(
                { topicName: "rio" },
                "en"
            );
            expect(viaFindAll).toEqual([{ id: "Q1", label: "rio-en" }]);
            const direct = await service.getWikidataEntities("sol", "pt");
            expect(direct).toEqual([{ id: "Q1", label: "sol-pt" }]);
        });
    });

    it("getImpactAreas returns the closed list (name + slug)", () => {
        expect(service.getImpactAreas()).toEqual(
            IMPACT_AREAS.map(({ name, slug }) => ({ name, slug }))
        );
    });
});
