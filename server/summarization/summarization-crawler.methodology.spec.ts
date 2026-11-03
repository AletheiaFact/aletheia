import { SummarizationCrawlerService } from "./summarization-crawler.service";

describe("summarization email classification wording", () => {
    const service = new SummarizationCrawlerService(
        {} as any,
        {} as any,
        {} as any
    );

    it("uses the methodology's label and names the methodology", () => {
        const html = service.generateHTMLReport(
            [
                {
                    classification: "trustworthy",
                    classificationMethodology: "rncd-debate",
                    summary: "Resumo",
                    href: "https://aletheiafact.org/x",
                },
            ],
            "main"
        );
        expect(html).toContain("Verdadeiro");
        expect(html).toContain("RNCD Debate");
    });

    it("keeps the aletheia wording for reviews without a methodology", () => {
        const html = service.generateHTMLReport(
            [
                {
                    classification: "trustworthy",
                    summary: "Resumo",
                    href: "https://aletheiafact.org/y",
                },
            ],
            "main"
        );
        expect(html).toContain("Confiável");
        expect(html).toContain("Aletheia");
    });
});
