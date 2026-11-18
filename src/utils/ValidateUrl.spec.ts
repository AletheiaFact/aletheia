import {
    isSafeImageSrc,
    isSafeLinkUrl,
    isSafeWikipediaUrl,
} from "./ValidateUrl";

describe("URL guards", () => {
    it.each([
        "javascript:alert(1)",
        " javascript:alert(1)",
        "JaVaScRiPt:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "vbscript:msgbox(1)",
        "//evil.example",
        "",
        undefined,
        { href: "https://example.com" },
    ])("isSafeLinkUrl rejects %p", (url) => {
        expect(isSafeLinkUrl(url)).toBe(false);
    });

    it.each(["https://example.com/a?b=1", "HTTP://example.com"])(
        "isSafeLinkUrl accepts %p",
        (url) => {
            expect(isSafeLinkUrl(url)).toBe(true);
        }
    );

    it.each([
        "https://cdn.example.com/a.png",
        "blob:https://aletheiafact.org/123",
        "data:image/png;base64,AAAA",
        "/images/a.png",
    ])("isSafeImageSrc accepts %p", (src) => {
        expect(isSafeImageSrc(src)).toBe(true);
    });

    it.each(["javascript:alert(1)", "data:text/html,x", "//evil.example/a.png"])(
        "isSafeImageSrc rejects %p",
        (src) => {
            expect(isSafeImageSrc(src)).toBe(false);
        }
    );

    it.each([
        ["https://pt.wikipedia.org/wiki/Brasil", true],
        ["https://wikipedia.org", true],
        ["http://pt.wikipedia.org/wiki/Brasil", false],
        ["https://wikipedia.org.evil.example/wiki", false],
        ["https://evilwikipedia.org/wiki", false],
        ["javascript:alert(1)//wikipedia.org", false],
    ])("isSafeWikipediaUrl(%p) is %p", (url, expected) => {
        expect(isSafeWikipediaUrl(url)).toBe(expected);
    });
});
