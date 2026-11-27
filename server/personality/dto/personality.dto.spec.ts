import {
    CreatePersonalitySchema,
    UpdatePersonalitySchema,
} from "./personality.dto";

describe("CreatePersonalitySchema", () => {
    it("accepts a Wikidata id", () => {
        expect(
            CreatePersonalitySchema.safeParse({ wikidata: "Q76" }).success
        ).toBe(true);
    });
    it.each([{}, { wikidata: "" }, { wikidata: "76" }])(
        "rejects %j",
        (body) => {
            expect(CreatePersonalitySchema.safeParse(body).success).toBe(false);
        }
    );
    it("rejects unknown keys (name comes from Wikidata)", () => {
        expect(
            CreatePersonalitySchema.safeParse({ wikidata: "Q76", name: "X" })
                .success
        ).toBe(false);
    });
});

describe("UpdatePersonalitySchema", () => {
    it("accepts any subset of name, description, wikidata", () => {
        expect(UpdatePersonalitySchema.safeParse({ name: "Ana" }).success).toBe(
            true
        );
        expect(
            UpdatePersonalitySchema.safeParse({
                description: "x",
                wikidata: "Q1",
            }).success
        ).toBe(true);
    });
    it.each([
        {},
        { isHidden: true },
        { name: "" },
        { name: "a".repeat(201) },
        { description: "a".repeat(1001) },
        { wikidata: "P31" },
    ])("rejects %j", (body) => {
        expect(UpdatePersonalitySchema.safeParse(body).success).toBe(false);
    });
});
