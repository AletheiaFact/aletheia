import {
    validateFormSubmission,
    ValidationInput,
} from "../../src/machines/reviewTask/validation";
import { ReviewTaskEvents } from "../../src/machines/reviewTask/enums";

const buildInput = (
    overrides: Partial<ValidationInput> = {}
): ValidationInput => ({
    event: ReviewTaskEvents.finishReport,
    formData: {
        classification: "false",
        visualEditor: null,
    },
    editorSources: [{ href: "https://example.com" }],
    machineSources: [],
    ...overrides,
});

describe("validateFormSubmission", () => {
    describe("finishReport", () => {
        it("should require classification", () => {
            const errors = validateFormSubmission(
                buildInput({
                    formData: { classification: "", visualEditor: null },
                })
            );

            expect(errors.some((e) => e.field === "classification")).toBe(true);
        });

        it("should pass with valid classification", () => {
            const errors = validateFormSubmission(buildInput());

            expect(errors.some((e) => e.field === "classification")).toBe(
                false
            );
        });

        it("should require sources on finishReport", () => {
            const errors = validateFormSubmission(
                buildInput({
                    editorSources: [],
                    machineSources: [],
                })
            );

            expect(errors.some((e) => e.field === "sources")).toBe(true);
        });

        it("should pass sources check when editorSources has items", () => {
            const errors = validateFormSubmission(
                buildInput({
                    editorSources: [{ href: "https://example.com" }],
                    machineSources: [],
                })
            );

            expect(errors.some((e) => e.field === "sources")).toBe(false);
        });
    });

    describe("publish", () => {
        it("should require classification", () => {
            const errors = validateFormSubmission(
                buildInput({
                    event: ReviewTaskEvents.publish,
                    formData: { classification: "", visualEditor: null },
                })
            );

            expect(errors.some((e) => e.field === "classification")).toBe(true);
        });

        it("should require sources from editorSources", () => {
            const errors = validateFormSubmission(
                buildInput({
                    event: ReviewTaskEvents.publish,
                    editorSources: [],
                    machineSources: [],
                })
            );

            expect(errors.some((e) => e.field === "sources")).toBe(true);
        });

        it("should accept sources from machineSources fallback", () => {
            const errors = validateFormSubmission(
                buildInput({
                    event: ReviewTaskEvents.publish,
                    editorSources: [],
                    machineSources: [{ href: "https://example.com" }],
                })
            );

            expect(errors.some((e) => e.field === "sources")).toBe(false);
        });

        it("should accept sources from editorSources", () => {
            const errors = validateFormSubmission(
                buildInput({
                    event: ReviewTaskEvents.publish,
                    editorSources: [{ href: "https://example.com" }],
                    machineSources: [],
                })
            );

            expect(errors.some((e) => e.field === "sources")).toBe(false);
        });
    });

    describe("non-validated events", () => {
        const nonValidatedEvents = [
            ReviewTaskEvents.draft,
            ReviewTaskEvents.goback,
            ReviewTaskEvents.addComment,
            ReviewTaskEvents.selectedReview,
            ReviewTaskEvents.selectedCrossChecking,
            ReviewTaskEvents.assignUser,
        ];

        nonValidatedEvents.forEach((event) => {
            it(`should return no errors for ${event}`, () => {
                const errors = validateFormSubmission(
                    buildInput({
                        event,
                        formData: { classification: "", visualEditor: null },
                        editorSources: [],
                        machineSources: [],
                    })
                );

                expect(errors).toEqual([]);
            });
        });
    });
});
