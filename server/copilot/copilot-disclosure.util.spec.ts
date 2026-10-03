import {
    SearchType,
    SearchOutcome,
    summarizeOutcomes,
    buildFailureDisclosure,
    applyFailureDisclosure,
} from "./copilot-disclosure.util";

describe("copilot-disclosure.util", () => {
    describe("summarizeOutcomes", () => {
        it("collapses repeated searchType last-write-wins (failed then ok → ok)", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.online, status: "ok" },
            ];
            expect(summarizeOutcomes(outcomes)).toEqual([
                { searchType: SearchType.online, status: "ok" },
            ]);
        });

        it("collapses repeated searchType last-write-wins (ok then failed → failed)", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.gazettes, status: "ok" },
                { searchType: SearchType.gazettes, status: "failed" },
            ];
            expect(summarizeOutcomes(outcomes)).toEqual([
                { searchType: SearchType.gazettes, status: "failed" },
            ]);
        });
    });

    describe("buildFailureDisclosure", () => {
        it("returns empty string when nothing failed", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "ok" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            expect(buildFailureDisclosure(outcomes, "Portuguese")).toBe("");
        });

        it("returns empty string for empty outcomes", () => {
            expect(buildFailureDisclosure([], "Portuguese")).toBe("");
        });

        it("discloses failed online leg + retry offer when gazettes succeeded (pt)", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const msg = buildFailureDisclosure(outcomes, "Portuguese");
            expect(msg).toContain("busca online");
            expect(msg).toContain("diários oficiais");
            expect(msg.toLowerCase()).toContain("novamente");
        });

        it("discloses in English when language is English", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const msg = buildFailureDisclosure(outcomes, "English");
            expect(msg).toContain("online search");
            expect(msg).toContain("public gazette search");
            expect(msg.toLowerCase()).toContain("retry");
        });

        it("states all searches failed when none succeeded", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
            ];
            const msg = buildFailureDisclosure(outcomes, "Portuguese");
            expect(msg.toLowerCase()).toContain("nenhuma");
            expect(msg).toContain("busca online");
        });
    });

    describe("applyFailureDisclosure", () => {
        it("prepends disclosure above the output when a leg failed", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const result = applyFailureDisclosure(
                "Resultado dos diários oficiais...",
                outcomes,
                "Portuguese"
            );
            expect(result.startsWith("⚠️")).toBe(true);
            expect(result).toContain("Resultado dos diários oficiais...");
        });

        it("returns output unchanged when nothing failed", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const output = "Resultado...";
            expect(applyFailureDisclosure(output, outcomes, "Portuguese")).toBe(
                output
            );
        });
    });
});
