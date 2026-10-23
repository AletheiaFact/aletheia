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

    it("passes null through", () => {
        expect(withClassificationLabels(null)).toBeNull();
    });
});
