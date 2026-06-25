import { BadRequestException } from "@nestjs/common";
import {
    DiffValidatorService,
    PreviousSentenceSnapshot,
} from "./diff-validator.service";

describe("DiffValidatorService (Unit)", () => {
    const service = new DiffValidatorService();

    const makeSnapshot = (
        sentenceId: string,
        text: string,
        dataHash = `hash-${sentenceId}`
    ): PreviousSentenceSnapshot => ({
        sentenceId,
        dataHash,
        text,
        position: 0,
        paragraphDataHash: "p-hash",
        sentenceSequence: 1,
    });

    describe("classifyForEditOnly", () => {
        it("returns empty for empty ops", () => {
            expect(service.classifyForEditOnly([], [])).toEqual([]);
        });

        it("classifies noop op preserving dataHash", () => {
            const snaps = [makeSnapshot("s1", "original")];
            const result = service.classifyForEditOnly(snaps, [
                { intent: "noop", sourceSentenceId: "s1" } as any,
            ]);
            expect(result).toEqual([
                {
                    intent: "noop",
                    sourceSentenceIds: ["s1"],
                    sourceDataHashes: ["hash-s1"],
                    newTexts: [],
                },
            ]);
        });

        it("classifies edit op with trimmed newText", () => {
            const snaps = [makeSnapshot("s1", "original")];
            const result = service.classifyForEditOnly(snaps, [
                {
                    intent: "edit",
                    sourceSentenceId: "s1",
                    newText: "  changed  ",
                } as any,
            ]);
            expect(result).toEqual([
                {
                    intent: "edit",
                    sourceSentenceIds: ["s1"],
                    sourceDataHashes: ["hash-s1"],
                    newTexts: ["changed"],
                },
            ]);
        });

        it("throws when source sentence id not found", () => {
            expect(() =>
                service.classifyForEditOnly(
                    [],
                    [{ intent: "noop", sourceSentenceId: "missing" } as any]
                )
            ).toThrow(BadRequestException);
        });

        it("throws when same source sentence referenced twice", () => {
            const snaps = [makeSnapshot("s1", "original")];
            expect(() =>
                service.classifyForEditOnly(snaps, [
                    { intent: "noop", sourceSentenceId: "s1" } as any,
                    {
                        intent: "edit",
                        sourceSentenceId: "s1",
                        newText: "x",
                    } as any,
                ])
            ).toThrow(/multiple operations/);
        });

        it("throws when edit text equals existing text after trim", () => {
            const snaps = [makeSnapshot("s1", "same")];
            expect(() =>
                service.classifyForEditOnly(snaps, [
                    {
                        intent: "edit",
                        sourceSentenceId: "s1",
                        newText: "  same  ",
                    } as any,
                ])
            ).toThrow(/identical text/);
        });
    });
});
