import { seedClaims } from "./claims";
import queue from "./queue.json";
import { seedReviews } from "./reviews";

const titles = new Set(seedClaims.map((c) => c.title.trim()));

describe("seed data", () => {
    it("links every review to a seeded claim", () => {
        for (const review of seedReviews) {
            expect(titles.has(review.claimTitle.trim())).toBe(true);
        }
    });

    it("links every queue scenario to a seeded claim", () => {
        for (const scenario of queue.scenarios) {
            expect(titles.has(scenario.claimTitle.trim())).toBe(true);
        }
    });
});
