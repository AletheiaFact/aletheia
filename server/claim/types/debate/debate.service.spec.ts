import { sortBySpokenOrder } from "./debate.service";

const at = (iso: string) => new Date(iso);

describe("sortBySpokenOrder", () => {
    it("orders turns by startedAt, not arrival", () => {
        const turns = [
            {
                id: "late",
                startedAt: at("2026-10-22T20:05:00Z"),
                createdAt: at("2026-10-22T20:05:10Z"),
            },
            {
                id: "early",
                startedAt: at("2026-10-22T20:01:00Z"),
                createdAt: at("2026-10-22T20:06:00Z"),
            },
        ];

        expect(sortBySpokenOrder(turns).map((t) => t.id)).toEqual([
            "early",
            "late",
        ]);
    });

    it("uses the arrival time for a turn without startedAt", () => {
        const turns = [
            { id: "no-start", createdAt: at("2026-10-22T20:03:00Z") },
            {
                id: "a",
                startedAt: at("2026-10-22T20:04:00Z"),
                createdAt: at("2026-10-22T20:04:05Z"),
            },
            {
                id: "b",
                startedAt: at("2026-10-22T20:02:00Z"),
                createdAt: at("2026-10-22T20:04:06Z"),
            },
        ];

        expect(sortBySpokenOrder(turns).map((t) => t.id)).toEqual([
            "b",
            "no-start",
            "a",
        ]);
    });

    it("keeps arrival order for equal times and does not mutate the input", () => {
        const same = at("2026-10-22T20:00:00Z");
        const turns = [
            { id: "first", createdAt: same },
            { id: "second", createdAt: same },
        ];

        expect(sortBySpokenOrder(turns).map((t) => t.id)).toEqual([
            "first",
            "second",
        ]);
        expect(turns.map((t) => t.id)).toEqual(["first", "second"]);
    });
});
