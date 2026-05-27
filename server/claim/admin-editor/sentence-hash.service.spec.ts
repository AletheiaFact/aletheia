import { SentenceHashService } from "./sentence-hash.service";

describe("SentenceHashService (Unit)", () => {
    const service = new SentenceHashService();

    describe("computeParagraphHash", () => {
        it("returns deterministic md5 for same inputs", () => {
            const a = service.computeParagraphHash(0, "hello", "p");
            const b = service.computeParagraphHash(0, "hello", "p");
            expect(a).toBe(b);
            expect(a).toMatch(/^[a-f0-9]{32}$/);
        });

        it("differs when sequence changes", () => {
            const a = service.computeParagraphHash(0, "hello", "p");
            const b = service.computeParagraphHash(1, "hello", "p");
            expect(a).not.toBe(b);
        });

        it("differs when text changes", () => {
            const a = service.computeParagraphHash(0, "hello", "p");
            const b = service.computeParagraphHash(0, "world", "p");
            expect(a).not.toBe(b);
        });
    });

    describe("computeSentenceHash", () => {
        it("returns deterministic md5 for same inputs", () => {
            const a = service.computeSentenceHash("p-hash", 1, "content");
            const b = service.computeSentenceHash("p-hash", 1, "content");
            expect(a).toBe(b);
            expect(a).toMatch(/^[a-f0-9]{32}$/);
        });

        it("differs when content changes", () => {
            const a = service.computeSentenceHash("p-hash", 1, "a");
            const b = service.computeSentenceHash("p-hash", 1, "b");
            expect(a).not.toBe(b);
        });

        it("differs when paragraph hash changes", () => {
            const a = service.computeSentenceHash("hash-1", 1, "x");
            const b = service.computeSentenceHash("hash-2", 1, "x");
            expect(a).not.toBe(b);
        });

        it("differs when sequence changes", () => {
            const a = service.computeSentenceHash("p", 1, "x");
            const b = service.computeSentenceHash("p", 2, "x");
            expect(a).not.toBe(b);
        });

        it("matches md5 formula `${paragraphHash}${seq}${content}`", () => {
            const md5 = require("md5");
            const expected = md5(`p-hash1text`);
            expect(service.computeSentenceHash("p-hash", 1, "text")).toBe(
                expected
            );
        });
    });
});
