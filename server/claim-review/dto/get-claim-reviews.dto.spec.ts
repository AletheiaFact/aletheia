import { ListClaimReviewsQuerySchema } from "./get-claim-reviews.dto";

const base = { page: "0", pageSize: "10", order: "desc", nameSpace: "main" };

describe("ListClaimReviewsQuerySchema", () => {
    it("keeps the legacy params and coerces the flags", () => {
        const r = ListClaimReviewsQuerySchema.safeParse({
            ...base,
            isHidden: "false",
            latest: "true",
        });
        expect(r.success).toBe(true);
        expect(r.data).toMatchObject({
            page: 0,
            pageSize: 10,
            isHidden: false,
            latest: true,
        });
    });

    it("accepts the repository filters", () => {
        const r = ListClaimReviewsQuerySchema.safeParse({
            ...base,
            q: "saúde",
            personality: "64b7f0c2e1a2b3c4d5e6f701",
            classification: ["false", "trustworthy"],
            classificationMethodology: "rncd-debate",
            contentModel: "Debate",
            endDate: "2024-01-01T23:59:59.999Z",
        });
        expect(r.success).toBe(true);
        expect(r.data?.contentModel).toEqual(["Debate"]);
    });

    it("rejects bad filters, page sizes and unknown keys", () => {
        for (const bad of [
            { classification: "in-progress" },
            { classificationMethodology: "other" },
            { personality: "abc" },
            { mainTopicId: "abc" },
            { pageSize: "0" },
            { pageSize: "101" },
            { unknown: "1" },
        ]) {
            expect(
                ListClaimReviewsQuerySchema.safeParse({ ...base, ...bad })
                    .success
            ).toBe(false);
        }
    });

    it("requires the params the class DTO required", () => {
        expect(
            ListClaimReviewsQuerySchema.safeParse({ page: "0" }).success
        ).toBe(false);
    });
});
