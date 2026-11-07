import { accentInsensitiveRegex } from "./regex.util";

const matches = (query: string, text: string) =>
    new RegExp(accentInsensitiveRegex(query), "i").test(text);

describe("accentInsensitiveRegex", () => {
    it("matches with or without accents, in any case", () => {
        expect(matches("saude", "Ministério da Saúde")).toBe(true);
        expect(matches("saúde", "ministerio da saude")).toBe(true);
        expect(matches("ELEICAO", "eleição")).toBe(true);
        expect(matches("açao", "AÇÃO")).toBe(true);
    });

    it("keeps other letters exact", () => {
        expect(matches("saude", "salde")).toBe(false);
    });

    it("escapes regex metacharacters", () => {
        expect(matches("a.c", "abc")).toBe(false);
        expect(matches("a.c", "a.c")).toBe(true);
        expect(matches("(x+", "(x+")).toBe(true);
        expect(matches("\\n", "\\n")).toBe(true);
    });
});
