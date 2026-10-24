import { withClassificationLabels } from "./classification-labels";

describe("withClassificationLabels", () => {
    it("labels a report with its own methodology", () => {
        const out: any = withClassificationLabels({
            report: {
                classification: "trustworthy",
                classificationMethodology: "rncd-debate",
            },
        });
        expect(out.report.classificationLabel).toEqual({
            pt: "Verdadeiro",
            en: "True",
        });
        expect(out.report.methodologyName).toEqual({
            pt: "RNCD Debate",
            en: "RNCD Debate",
        });
        expect(out.report.classification).toBe("trustworthy");
    });

    it("inherits a review task's methodology into reviewData", () => {
        const out: any = withClassificationLabels({
            classificationMethodology: "rncd-debate",
            machine: {
                context: { reviewData: { classification: "misleading" } },
            },
        });
        expect(out.machine.context.reviewData.classificationLabel.pt).toBe(
            "Enganosa"
        );
        expect(out.machine.context.reviewData.classificationMethodology).toBe(
            "rncd-debate"
        );
    });

    it("defaults to aletheia and ignores non-classification values", () => {
        const out: any = withClassificationLabels([
            { props: { classification: "trustworthy" } },
            { props: { classification: "in-progress" } },
            { props: { classification: "" } },
        ]);
        expect(out[0].props.classificationMethodology).toBe("aletheia");
        expect(out[0].props.classificationLabel.pt).toBe("Confiável");
        expect(out[1].props.classificationLabel).toBeUndefined();
        expect(out[2].props.classificationLabel).toBeUndefined();
    });

    it("words combined review stats in the aletheia scale and says so", () => {
        const out: any = withClassificationLabels({
            stats: {
                total: 3,
                reviews: [
                    { _id: "trustworthy", percentage: "67", count: 2 },
                    { _id: ["false"], count: 1 },
                    { _id: "507f1f77bcf86cd799439011", count: 4 },
                ],
            },
        });
        const [trustworthy, falseStat, other] = out.stats.reviews;
        expect(trustworthy.classificationLabel).toEqual({
            pt: "Confiável",
            en: "Trustworthy",
        });
        expect(trustworthy.labelMethodology).toBe("aletheia");
        expect(falseStat.classificationLabel.pt).toBe("Falso");
        expect(other.classificationLabel).toBeUndefined();
    });

    it("passes null through", () => {
        expect(withClassificationLabels(null)).toBeNull();
    });
});
