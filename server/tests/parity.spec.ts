import {
    diffNormalized,
    normalizeForParity,
} from "../../scripts/parity/normalize";

describe("parity normalize", () => {
    it("tokenizes ids by order of appearance, collapses dates and empties, drops bookkeeping keys", () => {
        const mongo = {
            _id: "64b7f0c2e1a2b3c4d5e6f701",
            __v: 0,
            name: "x",
            createdAt: new Date(),
            topics: [],
        };
        const postgres = {
            _id: "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
            name: "x",
            createdAt: "2026-01-01T00:00:00.000Z",
            topics: [],
            legacyObjectId: null,
            isDeleted: false,
        };
        expect(normalizeForParity(mongo)).toEqual(normalizeForParity(postgres));
        expect(normalizeForParity(mongo)).toEqual({
            _id: "<id:1>",
            createdAt: "<date>",
            name: "x",
        });
    });

    it("reports leaf differences with paths", () => {
        const diffs = diffNormalized(
            normalizeForParity({ a: [{ b: 1 }], c: "x" }),
            normalizeForParity({ a: [{ b: 2 }], c: "x", d: "y" })
        );
        expect(diffs).toEqual([
            { path: "$.a[0].b", left: 1, right: 2 },
            { path: "$.d", left: undefined, right: "y" },
        ]);
    });
});
