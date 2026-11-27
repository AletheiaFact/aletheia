import {
    addUnmatched,
    removeUnmatched,
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
