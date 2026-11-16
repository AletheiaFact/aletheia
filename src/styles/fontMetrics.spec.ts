import fs from "fs";
import path from "path";
import { fontFaces } from "./fontfaces";
import {
    PUBLIC_DIR,
    extractSfntTables,
    parseFontFaceRules,
} from "./fontTestUtils";

// The layout depends on these values: taller ones move every line of text
// down and grow every `line-height: normal` box. After replacing a font file,
// write the values from fontMetrics.json into its hhea and OS/2 tables.
const METRICS_PATH = path.resolve(__dirname, "fontMetrics.json");
const USE_TYPO_METRICS = 1 << 7;

interface VerticalMetrics {
    unitsPerEm: number;
    typo: { ascender: number; descender: number; lineGap: number };
    files: Record<string, { ascent: number; descent: number }>;
}

describe("Webfont vertical metrics", () => {
    const expected: VerticalMetrics = JSON.parse(
        fs.readFileSync(METRICS_PATH, "utf-8")
    );
    const sources = parseFontFaceRules(fontFaces).flatMap((f) => f.sources);

    it("lists every font file declared in fontfaces.ts", () => {
        const declared = new Set(
            sources.map((s) =>
                s.url.replace(/^\/fonts\//, "").replace(/\.woff2?$/, "")
            )
        );
        expect(new Set(Object.keys(expected.files))).toEqual(declared);
    });

    it("keeps the ascent and descent the layout was built against in every font file", () => {
        for (const { url } of sources) {
            const key = url.replace(/^\/fonts\//, "").replace(/\.woff2?$/, "");
            const { ascent, descent } = expected.files[key];
            const buf = fs.readFileSync(
                path.join(PUBLIC_DIR, url.replace(/^\//, ""))
            );
            const { tables } = extractSfntTables(buf);
            const head = tables["head"];
            const hhea = tables["hhea"];
            const os2 = tables["OS/2"];

            const actual = {
                unitsPerEm: head.readUInt16BE(18),
                // macOS and Linux read hhea, Windows reads the OS/2 win values.
                hhea: [
                    hhea.readInt16BE(4),
                    hhea.readInt16BE(6),
                    hhea.readInt16BE(8),
                ],
                win: [os2.readUInt16BE(74), os2.readUInt16BE(76)],
                typo: [
                    os2.readInt16BE(68),
                    os2.readInt16BE(70),
                    os2.readInt16BE(72),
                ],
                useTypoMetrics: (os2.readUInt16BE(62) & USE_TYPO_METRICS) !== 0,
            };

            expect(actual, url).toEqual({
                unitsPerEm: expected.unitsPerEm,
                hhea: [ascent, -descent, 0],
                win: [ascent, descent],
                typo: [
                    expected.typo.ascender,
                    expected.typo.descender,
                    expected.typo.lineGap,
                ],
                useTypoMetrics: false,
            });
        }
    });
});
