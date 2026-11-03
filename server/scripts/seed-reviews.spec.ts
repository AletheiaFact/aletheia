import { EditorParser } from "../../lib/editor-parser";
import { toStored } from "../mcp/review-workflow/review-log";
import { seedReviews } from "./seed-data/reviews";
import { reportToReviewLog } from "./seed-reviews";

describe("reportToReviewLog", () => {
    const parser = new EditorParser();

    it.each(seedReviews.map((review) => [review.claimTitle, review]))(
        "renders the published HTML back unchanged: %s",
        (_, review) => {
            const stored = toStored(reportToReviewLog(review.report));
            const html = parser.schema2html(stored as any);
            for (const field of [
                "summary",
                "report",
                "verification",
            ] as const) {
                expect(html[field]).toBe(review.report[field]);
            }
            expect(stored.sources.map((s) => s.href).sort()).toEqual(
                [...review.report.sources].sort()
            );
        }
    );
});
