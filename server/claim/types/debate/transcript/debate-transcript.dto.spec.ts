import {
    AppendDebateTranscriptSchema,
    DEBATE_TRANSCRIPT_MAX_TURNS,
    EditTranscriptTurnSchema,
    ListTranscriptTurnsQuerySchema,
    ReviewTranscriptTurnsSchema,
} from "./debate-transcript.dto";

const objectId = "64b7f0c2e1a2b3c4d5e6f701";
const otherObjectId = "64b7f0c2e1a2b3c4d5e6f702";

describe("debate transcript DTO schemas", () => {
    describe("AppendDebateTranscriptSchema", () => {
        const turn = { personality: objectId, text: "Hello there." };

        it("accepts a batch of turns with optional metadata", () => {
            const r = AppendDebateTranscriptSchema.safeParse({
                turns: [
                    {
                        ...turn,
                        externalId: "seg-1",
                        startedAt: "2024-01-01T10:00:00.000Z",
                    },
                    { ...turn, text: "  Second turn.  " },
                ],
                isLive: true,
            });
            expect(r.success).toBe(true);
            expect(r.success && r.data.turns[1].text).toBe("Second turn.");
        });

        it.each([0, 72, 100])("accepts a checkability of %s", (value) => {
            const r = AppendDebateTranscriptSchema.safeParse({
                turns: [{ ...turn, checkability: value }],
            });
            expect(r.success && r.data.turns[0].checkability).toBe(value);
        });

        it("accepts a turn without checkability", () => {
            const r = AppendDebateTranscriptSchema.safeParse({
                turns: [turn],
            });
            expect(r.success).toBe(true);
            expect(r.success && "checkability" in r.data.turns[0]).toBe(false);
        });

        it.each([-1, 101, 7.5, "72", null])(
            "rejects a checkability of %j",
            (value) => {
                const r = AppendDebateTranscriptSchema.safeParse({
                    turns: [{ ...turn, checkability: value }],
                });
                expect(r.success).toBe(false);
                expect(!r.success && r.error.issues[0].path).toEqual([
                    "turns",
                    0,
                    "checkability",
                ]);
            }
        );

        it.each([
            ["an empty turns array", { turns: [] }],
            ["a missing turns key", {}],
            ["a whitespace-only text", { turns: [{ ...turn, text: "   " }] }],
            [
                "a malformed personality",
                { turns: [{ ...turn, personality: "not-an-id" }] },
            ],
            [
                "a non-ISO startedAt",
                { turns: [{ ...turn, startedAt: "yesterday" }] },
            ],
            ["an unknown turn key", { turns: [{ ...turn, speaker: "x" }] }],
            ["an unknown body key", { turns: [turn], content: "x" }],
            [
                "a repeated externalId",
                {
                    turns: [
                        { ...turn, externalId: "a" },
                        { ...turn, externalId: "a" },
                    ],
                },
            ],
            [
                "too many turns",
                {
                    turns: Array.from(
                        { length: DEBATE_TRANSCRIPT_MAX_TURNS + 1 },
                        () => turn
                    ),
                },
            ],
        ])("rejects %s", (_label, body) => {
            expect(AppendDebateTranscriptSchema.safeParse(body).success).toBe(
                false
            );
        });
    });

    describe("ListTranscriptTurnsQuerySchema", () => {
        it("accepts a known status or none, and strips other keys", () => {
            expect(ListTranscriptTurnsQuerySchema.parse({})).toEqual({});
            expect(
                ListTranscriptTurnsQuerySchema.parse({
                    status: "draft",
                    _: "123",
                })
            ).toEqual({ status: "draft" });
        });

        it("rejects an unknown status", () => {
            expect(
                ListTranscriptTurnsQuerySchema.safeParse({ status: "pending" })
                    .success
            ).toBe(false);
        });
    });

    describe("EditTranscriptTurnSchema", () => {
        it("accepts text, personality or both", () => {
            expect(
                EditTranscriptTurnSchema.safeParse({ text: "Fixed." }).success
            ).toBe(true);
            expect(
                EditTranscriptTurnSchema.safeParse({ personality: objectId })
                    .success
            ).toBe(true);
        });

        it.each([
            ["an empty body", {}],
            ["a whitespace-only text", { text: "  " }],
            ["an unknown key", { text: "Fixed.", status: "approved" }],
        ])("rejects %s", (_label, body) => {
            expect(EditTranscriptTurnSchema.safeParse(body).success).toBe(
                false
            );
        });
    });

    describe("ReviewTranscriptTurnsSchema", () => {
        it("accepts distinct ObjectIds", () => {
            expect(
                ReviewTranscriptTurnsSchema.safeParse({
                    turnIds: [objectId, otherObjectId],
                }).success
            ).toBe(true);
        });

        it.each([
            ["an empty list", { turnIds: [] }],
            ["a repeated id", { turnIds: [objectId, objectId] }],
            ["a malformed id", { turnIds: ["turn-1"] }],
            [
                "too many ids",
                {
                    turnIds: Array.from(
                        { length: DEBATE_TRANSCRIPT_MAX_TURNS + 1 },
                        (_, i) => i.toString(16).padStart(24, "0")
                    ),
                },
            ],
        ])("rejects %s", (_label, body) => {
            expect(ReviewTranscriptTurnsSchema.safeParse(body).success).toBe(
                false
            );
        });
    });
});
