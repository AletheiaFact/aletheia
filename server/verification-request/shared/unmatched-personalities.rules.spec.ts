import {
    addUnmatched,
    mergeAfterRun,
    removeUnmatched,
    splitResolvedPersonalities,
    UnmatchedPersonality,
} from "./unmatched-personalities.rules";

describe("addUnmatched", () => {
    it("appends new names and skips case-insensitive duplicates", () => {
        const current: UnmatchedPersonality[] = [
            { name: "Bartolomeu Almeida" },
        ];
        expect(
            addUnmatched(current, [
                { name: "bartolomeu almeida" },
                { name: "Glaydson Botelho", wikidataCandidate: "Q9" },
            ])
        ).toEqual([
            { name: "Bartolomeu Almeida" },
            { name: "Glaydson Botelho", wikidataCandidate: "Q9" },
        ]);
    });
});

describe("removeUnmatched", () => {
    it("removes a name case-insensitively and reports if it was there", () => {
        expect(
            removeUnmatched([{ name: "Ana" }, { name: "Bia" }], "ana")
        ).toEqual({ list: [{ name: "Bia" }], found: true });
        expect(removeUnmatched([{ name: "Bia" }], "Ana")).toEqual({
            list: [{ name: "Bia" }],
            found: false,
        });
    });
});

describe("splitResolvedPersonalities", () => {
    it("splits matched from unmatched, keeping the candidate only when given", () => {
        expect(
            splitResolvedPersonalities([
                { name: "Ana", personality: { id: 1 } },
                { name: "Bia", wikidataId: "Q7", personality: null },
                { name: "Caio", wikidataId: null, personality: null },
            ])
        ).toEqual({
            matched: [{ id: 1 }],
            matchedNames: ["Ana"],
            unmatched: [
                { name: "Bia", wikidataCandidate: "Q7" },
                { name: "Caio" },
            ],
        });
    });

    it("drops a candidate that is not a Wikidata id", () => {
        expect(
            splitResolvedPersonalities([
                { name: "Bia", wikidataId: "banana", personality: null },
                { name: "Caio", wikidataId: "q7", personality: null },
            ]).unmatched
        ).toEqual([{ name: "Bia" }, { name: "Caio" }]);
    });

    it("trims names, skips blank ones and truncates to 200 characters", () => {
        const long = "x".repeat(250);
        const result = splitResolvedPersonalities([
            { name: "  Ana  ", personality: null },
            { name: "   ", personality: null },
            { name: "", personality: { id: 2 } },
            { name: long, personality: null },
        ]);
        expect(result.unmatched).toEqual([
            { name: "Ana" },
            { name: "x".repeat(200) },
        ]);
        expect(result.matched).toEqual([{ id: 2 }]);
    });
});

describe("mergeAfterRun", () => {
    it("drops names this run matched and adds the new unmatched ones", () => {
        expect(
            mergeAfterRun(
                [{ name: "Ana" }, { name: "Bia" }],
                ["ana"],
                [{ name: "Caio" }, { name: "bia" }]
            )
        ).toEqual([{ name: "Bia" }, { name: "Caio" }]);
    });
});
