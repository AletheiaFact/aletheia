import { buildReviewRating } from "./buildReviewRating";

const t = (key: string) => `t(${key})`;

describe("buildReviewRating", () => {
    it("keeps today's numbers and wording for aletheia reviews", () => {
        expect(
            buildReviewRating({
                classification: "trustworthy",
                language: "pt",
                t,
            })
        ).toEqual({
            "@type": "Rating",
            ratingValue: 8,
            bestRating: 8,
            worstRating: 1,
            alternateName: "Confiável",
        });
    });

    it("uses the methodology's wording but the stored value's rating", () => {
        const rating = buildReviewRating({
            classification: "trustworthy",
            classificationMethodology: "rncd-debate",
            language: "pt",
            t,
        });
        expect(rating.ratingValue).toBe(8);
        expect(rating.alternateName).toBe("Verdadeiro");
    });

    it("keeps the hidden-review output", () => {
        expect(
            buildReviewRating({
                classification: "trustworthy",
                classificationMethodology: "rncd-debate",
                isHidden: true,
                language: "pt",
                t,
            })
        ).toEqual(
            expect.objectContaining({
                ratingValue: 0,
                alternateName: "t(claimReviewForm:notReviewed)",
            })
        );
    });
});
