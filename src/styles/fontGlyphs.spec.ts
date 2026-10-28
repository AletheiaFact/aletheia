import fs from "fs";
import path from "path";
import { fontFaces } from "./fontfaces";
import {
    PUBLIC_DIR,
    ALL_REQUIRED_CHARS,
    extractSfntTables,
    parseFontFamilyName,
    parseUnicodeCmap,
    parseFontFaceRules,
} from "./fontTestUtils";

describe("Webfont binary integrity & Portuguese glyph coverage", () => {
    const parsedFaces = parseFontFaceRules(fontFaces);

    it("has valid binary font files matching family, weight, style, and all Portuguese glyphs", () => {
        for (const face of parsedFaces) {
            for (const src of face.sources) {
                const diskPath = path.join(
                    PUBLIC_DIR,
                    src.url.replace(/^\//, "")
                );
                expect(
                    fs.existsSync(diskPath),
                    `Missing font file on disk: ${src.url}`
                ).toBe(true);

                const buf = fs.readFileSync(diskPath);
                const { signature, tables } = extractSfntTables(buf);

                expect(signature).toBe(
                    src.format === "woff2" ? "wOF2" : "wOFF"
                );

                // Verify internal font family name matches @font-face font-family
                const binaryFamily = parseFontFamilyName(tables["name"]);
                expect(binaryFamily).toBe(face.family);

                // Verify internal OS/2 weight and italic flag match @font-face
                const os2 = tables["OS/2"];
                const usWeightClass = os2.readUInt16BE(4);
                const fsSelection = os2.readUInt16BE(62);
                const isItalic = (fsSelection & 0x01) !== 0;

                expect(usWeightClass).toBe(face.weight);
                expect(isItalic).toBe(face.style === "italic");

                // Verify every Portuguese character + ASCII maps to a real glyph (> 0)
                const cmap = parseUnicodeCmap(tables["cmap"]);
                const missingChars = Array.from(ALL_REQUIRED_CHARS).filter(
                    (ch) => {
                        const glyphId = cmap.get(ch.codePointAt(0)!);
                        return !glyphId || glyphId <= 0;
                    }
                );

                expect(
                    missingChars,
                    `${src.url} is missing glyphs for characters: ${missingChars.join("")}`
                ).toEqual([]);
            }
        }
    });
});
