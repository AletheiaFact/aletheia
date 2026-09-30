import { deriveDataHash, isValidSourceHref } from "./source.rules";

describe("source shared rules", () => {
    describe("isValidSourceHref", () => {
        it("accepts absolute URLs with a protocol", () => {
            expect(isValidSourceHref("https://aletheiafact.org/x")).toBe(true);
            expect(isValidSourceHref("http://example.com")).toBe(true);
        });

        it("rejects URLs without a protocol", () => {
            expect(isValidSourceHref("aletheiafact.org/x")).toBe(false);
            expect(isValidSourceHref("www.example.com")).toBe(false);
        });

        it("rejects empty and non-string values", () => {
            expect(isValidSourceHref("")).toBe(false);
            expect(isValidSourceHref(undefined)).toBe(false);
            expect(isValidSourceHref(null)).toBe(false);
            expect(isValidSourceHref(42)).toBe(false);
        });
    });

    describe("deriveDataHash", () => {
        it("is the md5 of the href (stable dedup key)", () => {
            // md5("https://example.com") — precomputed
            expect(deriveDataHash("https://example.com")).toBe(
                "c984d06aafbecf6bc55569f964148ea3"
            );
        });

        it("differs for different hrefs", () => {
            expect(deriveDataHash("https://a.com")).not.toBe(
                deriveDataHash("https://b.com")
            );
        });
    });
});
