import fs from "fs";
import path from "path";
import { fontFaces } from "./fontfaces";
import {
    APP_CSS_PATH,
    DOCUMENT_TSX_PATH,
    PUBLIC_DIR,
    ALL_REQUIRED_CHARS,
    parseFontFaceRules,
    parseUnicodeRangeSet,
} from "./fontTestUtils";

describe("Webfont CSS declarations & preloads", () => {
    const parsedFaces = parseFontFaceRules(fontFaces);

    it("declares the exact expected @font-face variants for Noticia Text and Open Sans", () => {
        const variants = parsedFaces.map(
            (f) => `${f.family} ${f.weight} ${f.style}`
        );
        expect(variants).toEqual([
            "Noticia Text 400 normal",
            "Noticia Text 700 normal",
            "Open Sans 400 italic",
            "Open Sans 400 normal",
            "Open Sans 600 normal",
            "Open Sans 700 normal",
            "Open Sans 800 normal",
        ]);

        for (const face of parsedFaces) {
            expect(face.display).toBe("swap");
            expect(face.sources.map((s) => s.format)).toEqual([
                "woff2",
                "woff",
            ]);
        }
    });

    it("does not duplicate @font-face rules in app.css", () => {
        const appCss = fs.readFileSync(APP_CSS_PATH, "utf-8");
        expect(appCss).not.toMatch(/@font-face\b/);
    });

    it("covers every Portuguese character in each @font-face unicode-range", () => {
        for (const face of parsedFaces) {
            const rangeSet = parseUnicodeRangeSet(face.unicodeRange);
            const uncovered = Array.from(ALL_REQUIRED_CHARS).filter(
                (ch) => !rangeSet.has(ch.codePointAt(0)!)
            );
            expect(
                uncovered,
                `${face.family} ${face.weight} ${face.style} unicode-range missing characters`
            ).toEqual([]);
        }
    });

    it("preloads only existing woff2 font files declared in fontfaces.ts and leaves no orphan font files", () => {
        const documentTsx = fs.readFileSync(DOCUMENT_TSX_PATH, "utf-8");
        const preloadedUrls = Array.from(
            documentTsx.matchAll(/href="(\/fonts\/[^"]+)"/g)
        ).map((m) => m[1]);

        const declaredUrls = new Set(
            parsedFaces.flatMap((f) => f.sources.map((s) => s.url))
        );

        expect(preloadedUrls.length).toBeGreaterThan(0);
        for (const url of preloadedUrls) {
            expect(url.endsWith(".woff2")).toBe(true);
            expect(declaredUrls.has(url)).toBe(true);
        }

        // Ensure no unused/orphan font files remain in public/fonts/
        const filesOnDisk: string[] = [];
        for (const subdir of ["Noticia_Text", "Open_Sans"]) {
            const fullSubdir = path.join(PUBLIC_DIR, "fonts", subdir);
            for (const file of fs.readdirSync(fullSubdir)) {
                filesOnDisk.push(`/fonts/${subdir}/${file}`);
            }
        }
        expect(new Set(filesOnDisk)).toEqual(declaredUrls);
    });
});
