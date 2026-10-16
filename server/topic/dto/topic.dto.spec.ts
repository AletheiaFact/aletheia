import {
    CreateTopicsSchema,
    GetTopicsQuerySchema,
    SearchTopicsQuerySchema,
} from "./topic.dto";

describe("topic DTO schemas", () => {
    describe("GetTopicsQuerySchema", () => {
        it("accepts a topicName", () => {
            expect(
                GetTopicsQuerySchema.safeParse({ topicName: "saúde" }).success
            ).toBe(true);
        });

        it("rejects a missing topicName", () => {
            expect(GetTopicsQuerySchema.safeParse({}).success).toBe(false);
        });
    });

    describe("SearchTopicsQuerySchema", () => {
        it("coerces limit and applies defaults", () => {
            const parsed = SearchTopicsQuerySchema.parse({
                query: "e",
                limit: "5",
            });
            expect(parsed).toEqual({ query: "e", limit: 5, language: "pt" });
        });

        it("rejects a missing query and an out-of-range limit", () => {
            expect(SearchTopicsQuerySchema.safeParse({}).success).toBe(false);
            expect(
                SearchTopicsQuerySchema.safeParse({ query: "e", limit: "0" })
                    .success
            ).toBe(false);
            expect(
                SearchTopicsQuerySchema.safeParse({ query: "e", limit: "101" })
                    .success
            ).toBe(false);
        });
    });

    describe("CreateTopicsSchema", () => {
        it("accepts wikidata picks, bare names and slug references", () => {
            const result = CreateTopicsSchema.safeParse({
                contentModel: "Speech",
                data_hash: "abc",
                topics: [
                    { label: "Saúde", value: "Q1", aliases: ["Health"] },
                    "Cultura",
                    { slug: "esporte" },
                ],
            });
            expect(result.success).toBe(true);
        });

        it("accepts any contentModel string or null (the review UI forwards non-claim targets)", () => {
            expect(
                CreateTopicsSchema.safeParse({
                    contentModel: "VerificationRequest",
                    topics: ["x"],
                }).success
            ).toBe(true);
            expect(
                CreateTopicsSchema.safeParse({ contentModel: null, topics: [] })
                    .success
            ).toBe(true);
        });

        it("rejects a non-array topics and unknown keys", () => {
            expect(CreateTopicsSchema.safeParse({ topics: "x" }).success).toBe(
                false
            );
            expect(
                CreateTopicsSchema.safeParse({ topics: ["x"], extra: 1 })
                    .success
            ).toBe(false);
        });
    });
});
