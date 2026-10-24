import { EditorParser } from "../../../lib/editor-parser";
import { fromStored, reviewLogErrors, toStored } from "./review-log";

const parser = new EditorParser();

const log = {
    classification: "trustworthy",
    summary: "Diana morreu em 31 de agosto de 1997, em Paris.",
    questions: ["Diana morreu em Paris?", "Fazia 25 anos em maio de 2023?"],
    report: "Diana morreu em 31 de agosto de 1997.\nA frase foi publicada em 6 de maio de 2023.",
    verification: "Consultamos registros biográficos.",
    sources: [
        {
            href: "https://example.org/death",
            field: "report" as const,
            quotedText: "31 de agosto de 1997",
        },
        {
            href: "https://example.org/article",
            field: "report" as const,
            quotedText: "6 de maio de 2023",
        },
        { href: "https://example.org/listed-only" },
    ],
};

describe("review log conversion", () => {
    it("round-trips the plain log through the stored shape", async () => {
        const stored = await toStored(log);
        expect(
            fromStored({ ...stored, classification: "trustworthy" })
        ).toEqual(log);
    });

    it("links each quoted passage with the editor's markup and numbers sources", async () => {
        const stored = await toStored(log);
        const [first, second, third] = stored.sources;
        expect(stored.report).toBe(
            `Diana morreu em {{${first.props.id}|31 de agosto de 1997}}.\nA frase foi publicada em {{${second.props.id}|6 de maio de 2023}}.`
        );
        expect(stored.report.slice(...first.props.textRange)).toBe(
            `{{${first.props.id}|31 de agosto de 1997}}`
        );
        expect(third.props).toMatchObject({ field: null, sup: 3 });
        expect(stored.reviewDataHtml.report).toContain("<sup>1</sup>");
        expect(stored.reviewDataHtml.report).toContain("<sup>2</sup>");
    });

    it("builds an editor document the web reads back to the same fields", async () => {
        const stored = await toStored(log);
        const schema = parser.editor2schema(stored.visualEditor as any);
        expect(schema.summary).toBe(stored.summary);
        expect(schema.report).toBe(stored.report);
        expect(schema.verification).toBe(stored.verification);
        expect(schema.questions).toEqual(log.questions);
        expect(schema.sources.map((s: any) => s.href)).toEqual([
            "https://example.org/death",
            "https://example.org/article",
        ]);
    });

    it("rejects quoted text that is not in its field", () => {
        expect(
            reviewLogErrors({
                report: "Texto.",
                sources: [
                    {
                        href: "https://x.org",
                        field: "report",
                        quotedText: "nada",
                    },
                ],
            })
        ).toEqual([`sources[0].quotedText "nada" is not in report`]);
    });

    it("rejects HTML and source markup in text", () => {
        expect(
            reviewLogErrors({
                summary: "<script>x</script>",
                questions: ["{{a|b}}"],
            })
        ).toHaveLength(2);
    });

    it("allows comparison signs that are not tags", () => {
        expect(reviewLogErrors({ report: "Variação > 10% e < 20%." })).toEqual(
            []
        );
    });
});

describe("sources listed out of text order", () => {
    // The writer lists sources in any order; the editor and HTML builders
    // expect them in the order their passages appear.
    const outOfOrder = {
        classification: "trustworthy",
        summary: "Resumo com fonte no fim da frase.",
        questions: ["Pergunta?"],
        report: "Primeiro parágrafo com a data.\nSegundo parágrafo com o lançamento e com a regra da categoria.\nTerceiro parágrafo com a novidade.",
        verification: "Método.",
        sources: [
            {
                href: "https://a.org",
                field: "report" as const,
                quotedText: "a data",
            },
            {
                href: "https://b.org",
                field: "report" as const,
                quotedText: "o lançamento",
            },
            {
                href: "https://a.org",
                field: "report" as const,
                quotedText: "a novidade",
            },
            {
                href: "https://b.org",
                field: "report" as const,
                quotedText: "a regra da categoria",
            },
            {
                href: "https://a.org",
                field: "summary" as const,
                quotedText: "fonte no fim",
            },
        ],
    };

    it("renders HTML with every passage linked once and no leftover markup", async () => {
        const stored = await toStored(outOfOrder);
        const html = stored.reviewDataHtml.report as string;
        expect(html).not.toMatch(/{{|}}/);
        for (const text of [
            "a data",
            "o lançamento",
            "a regra da categoria",
            "a novidade",
        ]) {
            expect(html.split(`>${text}<sup>`).length - 1).toBe(1);
        }
        expect(html).toBe(
            "<div><p>Primeiro parágrafo com <a href='#a data' rel='noopener noreferrer nofollow'>a data<sup>2</sup></a>.</p>" +
                "<p>Segundo parágrafo com <a href='#o lançamento' rel='noopener noreferrer nofollow'>o lançamento<sup>3</sup></a> e com <a href='#a regra da categoria' rel='noopener noreferrer nofollow'>a regra da categoria<sup>4</sup></a>.</p>" +
                "<p>Terceiro parágrafo com <a href='#a novidade' rel='noopener noreferrer nofollow'>a novidade<sup>5</sup></a>.</p></div>"
        );
    });

    it("numbers sources in reading order and keeps the editor document intact", async () => {
        const stored = await toStored(outOfOrder);
        expect(
            stored.sources.map((s: any) => [s.props.sup, s.props.targetText])
        ).toEqual([
            [1, "fonte no fim"],
            [2, "a data"],
            [3, "o lançamento"],
            [4, "a regra da categoria"],
            [5, "a novidade"],
        ]);
        const schema = parser.editor2schema(stored.visualEditor as any);
        expect(schema.report).toBe(stored.report);
        expect(schema.summary).toBe(stored.summary);
    });
});
