import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fontFaces } from "./fontfaces";

const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const APP_CSS_PATH = path.resolve(__dirname, "./app.css");
const DOCUMENT_TSX_PATH = path.resolve(__dirname, "../pages/_document.tsx");

const PORTUGUESE_UPPER = "ÀÁÂÃÇÉÊÍÓÔÕÚ";
const PORTUGUESE_LOWER = "àáâãçéêíóôõú";
const PORTUGUESE_PUNCTUATION = "ªº«»“”‘’—–€$";
const ASCII_ALPHANUMERIC =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ALL_REQUIRED_CHARS =
    PORTUGUESE_UPPER +
    PORTUGUESE_LOWER +
    PORTUGUESE_PUNCTUATION +
    ASCII_ALPHANUMERIC;

const WOFF2_KNOWN_TAGS = [
    "cmap", "head", "hhea", "hmtx", "maxp", "name", "OS/2", "post",
    "cvt ", "fpgm", "glyf", "loca", "prep", "CFF ", "VORG", "EBDT",
    "EBLC", "EBSC", "BASE", "GPOS", "GSUB", "JSTF", "DSIG", "gasp",
    "hdmx", "kern", "LTSH", "PCLT", "VDMX", "vhea", "vmtx", "bsln",
    "feat", "lcar", "morx", "opbd", "prop", "trak", "Zapf", "Silf",
    "Glat", "Gloc", "Feat", "Sill",
];

function readUIntBase128(buf: Buffer, offset: number): [number, number] {
    let result = 0;
    for (let i = 0; i < 5; i++) {
        const b = buf[offset++];
        result = (result << 7) | (b & 0x7f);
        if ((b & 0x80) === 0) {
            return [result, offset];
        }
    }
    throw new Error("Invalid UIntBase128 in WOFF2 table directory");
}

function extractSfntTables(buf: Buffer): {
    signature: string;
    tables: Record<string, Buffer>;
} {
    const signature = buf.toString("ascii", 0, 4);
    if (signature === "wOFF") {
        const numTables = buf.readUInt16BE(12);
        const tables: Record<string, Buffer> = {};
        for (let i = 0; i < numTables; i++) {
            const base = 44 + i * 20;
            const tag = buf.toString("ascii", base, base + 4);
            const offset = buf.readUInt32BE(base + 4);
            const compLen = buf.readUInt32BE(base + 8);
            const origLen = buf.readUInt32BE(base + 12);
            const slice = buf.subarray(offset, offset + compLen);
            tables[tag] =
                compLen < origLen ? zlib.inflateSync(slice) : slice;
        }
        return { signature, tables };
    }

    if (signature === "wOF2") {
        const numTables = buf.readUInt16BE(12);
        const totalCompressedSize = buf.readUInt32BE(20);
        let pos = 48;
        const entries: Array<{ tag: string; len: number }> = [];
        for (let i = 0; i < numTables; i++) {
            const flags = buf[pos++];
            const tagIdx = flags & 0x3f;
            const tag =
                tagIdx === 63
                    ? buf.toString("ascii", pos, (pos += 4))
                    : WOFF2_KNOWN_TAGS[tagIdx];
            const xformVersion = (flags >> 6) & 0x03;
            let origLen: number;
            [origLen, pos] = readUIntBase128(buf, pos);
            let storedLen = origLen;
            const isTransformed =
                tag === "glyf" || tag === "loca"
                    ? xformVersion === 0
                    : xformVersion !== 0;
            if (isTransformed) {
                [storedLen, pos] = readUIntBase128(buf, pos);
            }
            entries.push({ tag, len: storedLen });
        }
        const decompressed = zlib.brotliDecompressSync(
            buf.subarray(pos, pos + totalCompressedSize)
        );
        const tables: Record<string, Buffer> = {};
        let tPos = 0;
        for (const entry of entries) {
            tables[entry.tag] = decompressed.subarray(
                tPos,
                tPos + entry.len
            );
            tPos += entry.len;
        }
        return { signature, tables };
    }

    throw new Error(`Unsupported font container signature: ${signature}`);
}

function parseFontFamilyName(nameTable: Buffer): string {
    const count = nameTable.readUInt16BE(2);
    const stringOffset = nameTable.readUInt16BE(4);
    const names: Record<number, string> = {};

    for (let i = 0; i < count; i++) {
        const base = 6 + i * 12;
        const platformID = nameTable.readUInt16BE(base);
        const nameID = nameTable.readUInt16BE(base + 6);
        const length = nameTable.readUInt16BE(base + 8);
        const offset = stringOffset + nameTable.readUInt16BE(base + 10);
        const raw = nameTable.subarray(offset, offset + length);

        if (platformID === 3 || platformID === 0) {
            let decoded = "";
            for (let j = 0; j < raw.length; j += 2) {
                decoded += String.fromCharCode(raw.readUInt16BE(j));
            }
            names[nameID] = decoded;
        } else if (platformID === 1 && !(nameID in names)) {
            names[nameID] = raw.toString("latin1");
        }
    }

    // Prefer Typographic Family Name (ID 16), falling back to Font Family Name (ID 1)
    return names[16] || names[1] || "";
}

function parseCmapFormat4(subtable: Buffer): Map<number, number> {
    const segCount = subtable.readUInt16BE(6) / 2;
    const endCodesOffset = 14;
    const startCodesOffset = endCodesOffset + segCount * 2 + 2;
    const idDeltasOffset = startCodesOffset + segCount * 2;
    const idRangeOffsetsOffset = idDeltasOffset + segCount * 2;
    const codePointToGlyph = new Map<number, number>();

    for (let i = 0; i < segCount; i++) {
        const endCode = subtable.readUInt16BE(endCodesOffset + i * 2);
        const startCode = subtable.readUInt16BE(startCodesOffset + i * 2);
        const idDelta = subtable.readInt16BE(idDeltasOffset + i * 2);
        const idRangeOffsetPos = idRangeOffsetsOffset + i * 2;
        const idRangeOffset = subtable.readUInt16BE(idRangeOffsetPos);

        if (startCode === 0xffff && endCode === 0xffff) {
            break;
        }

        for (let code = startCode; code <= endCode; code++) {
            let glyphId = 0;
            if (idRangeOffset === 0) {
                glyphId = (code + idDelta) & 0xffff;
            } else {
                const glyphIndexPos =
                    idRangeOffsetPos + idRangeOffset + (code - startCode) * 2;
                if (glyphIndexPos + 2 <= subtable.length) {
                    glyphId = subtable.readUInt16BE(glyphIndexPos);
                    if (glyphId !== 0) {
                        glyphId = (glyphId + idDelta) & 0xffff;
                    }
                }
            }
            if (glyphId !== 0) {
                codePointToGlyph.set(code, glyphId);
            }
        }
    }

    return codePointToGlyph;
}

function parseUnicodeCmap(cmapTable: Buffer): Map<number, number> {
    const numTables = cmapTable.readUInt16BE(2);
    for (let i = 0; i < numTables; i++) {
        const base = 4 + i * 8;
        const platformID = cmapTable.readUInt16BE(base);
        const offset = cmapTable.readUInt32BE(base + 4);
        const format = cmapTable.readUInt16BE(offset);
        if (format === 4 && (platformID === 3 || platformID === 0)) {
            return parseCmapFormat4(cmapTable.subarray(offset));
        }
    }
    throw new Error("No Unicode format 4 cmap subtable found");
}

function parseUnicodeRangeSet(unicodeRangeCss: string): Set<number> {
    const covered = new Set<number>();
    for (const token of unicodeRangeCss.split(",").map((s) => s.trim())) {
        const match = token.match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
        if (!match) {
            continue;
        }
        const start = parseInt(match[1], 16);
        const end = match[2] ? parseInt(match[2], 16) : start;
        for (let cp = start; cp <= end; cp++) {
            covered.add(cp);
        }
    }
    return covered;
}

interface ParsedFontFace {
    family: string;
    style: string;
    weight: number;
    display: string;
    sources: Array<{ url: string; format: string }>;
    unicodeRange: string;
}

function parseFontFaceRules(css: string): ParsedFontFace[] {
    const blocks = css.match(/@font-face\s*\{[^}]+\}/g) || [];
    return blocks.map((block) => {
        const family =
            block.match(/font-family:\s*"([^"]+)"/)?.[1] ?? "";
        const style =
            block.match(/font-style:\s*([^;]+);/)?.[1]?.trim() ?? "";
        const weight = Number(
            block.match(/font-weight:\s*(\d+);/)?.[1] ?? 0
        );
        const display =
            block.match(/font-display:\s*([^;]+);/)?.[1]?.trim() ?? "";
        const unicodeRange =
            block
                .match(/unicode-range:\s*([^;]+);/)?.[1]
                ?.replace(/\s+/g, " ")
                .trim() ?? "";
        const sources = Array.from(
            block.matchAll(/url\("([^"]+)"\)\s*format\("([^"]+)"\)/g)
        ).map((m) => ({ url: m[1], format: m[2] }));

        return { family, style, weight, display, sources, unicodeRange };
    });
}

describe("Webfont installation & Portuguese character coverage", () => {
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
