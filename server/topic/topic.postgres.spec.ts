import { BadRequestException } from "@nestjs/common";
import { PostgresTopicService } from "./postgres/topic.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { DuplicateKeyError, NotImplementedError } from "../database/errors";
import { ContentModelEnum } from "../types/enums";
import { topic } from "./postgres/schema/topic.schema";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "topic postgres-only",
    () => {
        let service: PostgresTopicService;
        let db: Awaited<ReturnType<typeof getTestDrizzle>>;

        beforeEach(async () => {
            await resetTestDrizzle();
            db = await getTestDrizzle();
            service = new PostgresTopicService(db, {} as any);
        });

        it("create with a contentModel is a loud 501 until the claim content tables port (Phase 2)", async () => {
            await expect(
                service.create({
                    contentModel: ContentModelEnum.Speech,
                    topics: ["x"],
                    data_hash: "abc",
                })
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("create with a {slug} reference to a missing topic is a 400 (documented divergence: Mongo CastError 500)", async () => {
            await expect(
                service.create({ topics: [{ slug: "never-created" }] })
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it("create dedups duplicate entries within one batch (documented divergence: Mongo races into E11000)", async () => {
            const refs: any[] = await service.create({
                topics: [{ label: "Saúde", value: "Q1" }, "Saúde"],
            });
            expect(refs).toHaveLength(2);
            expect(refs[1]).toMatchObject({ label: "Saúde", value: "Q1" });
        });

        it("searchTopics treats the query literally (documented divergence: Mongo evaluates it as a regex)", async () => {
            await service.create({ topics: ["Saúde", "Sa.de"] });
            const literal: any[] = await service.searchTopics("sa.de", "pt");
            expect(literal.map((t) => t.name)).toEqual(["Sa.de"]);
            const wildcard: any[] = await service.searchTopics("sa%", "pt");
            expect(wildcard).toEqual([]);
        });

        it("searchTopics rejects a non-numeric limit loudly", async () => {
            await expect(
                service.searchTopics("x", "pt", "ten" as any)
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("findByNames with an empty list returns [] (Mongo: `$or: []` driver error)", async () => {
            expect(await service.findByNames([])).toEqual([]);
        });

        it("findByWikidataIds ignores non-string ids", async () => {
            await service.create({
                topics: [{ label: "A", value: "Q1" }, "B"],
            });
            expect(
                await service.findByWikidataIds([undefined as any, "Q1"])
            ).toHaveLength(1);
            expect(await service.findByWikidataIds([undefined as any])).toEqual(
                []
            );
        });

        it("maps a slug unique violation to DuplicateKeyError with the field name", async () => {
            await service.findOrCreateTopic({ name: "Dup" });
            const error = await db
                .insert(topic)
                .values({ name: "Dup", slug: "dup", language: "pt" })
                .then(() => null)
                .catch((e: unknown) => e);
            expect(error).toBeTruthy();
            expect(() => (service as any).rethrowMapped(error)).toThrow(
                DuplicateKeyError
            );
            try {
                (service as any).rethrowMapped(error);
            } catch (mapped) {
                expect((mapped as DuplicateKeyError).fields).toEqual(["slug"]);
            }
        });

        it("exposes _id alongside id and surfaces NULL wikidata_id as undefined", async () => {
            const created: any = await service.findOrCreateTopic({
                name: "Plain",
            });
            expect(created._id).toBe(created.id);
            expect(created.wikidataId).toBeUndefined();
            expect(created.aliases).toEqual([]);
            expect(created.isDeleted).toBe(false);
        });
    }
);
