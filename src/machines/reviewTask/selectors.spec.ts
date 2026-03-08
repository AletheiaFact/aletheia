import {
    publishedSelector,
    assignedSelector,
    reportSelector,
    crossCheckingSelector,
    addCommentCrossCheckingSelector,
    reviewingSelector,
    reviewNotStartedSelector,
    reviewDataSelector,
} from "./selectors";
import { ReviewTaskStates } from "./enums";

const createMockState = (
    currentState: string,
    context: any = {}
) => ({
    matches: (state: string) => state === currentState,
    context,
});

describe("reviewTask selectors", () => {
    describe("publishedSelector", () => {
        it("returns true when state is published", () => {
            const state = createMockState(ReviewTaskStates.published);
            expect(publishedSelector(state)).toBe(true);
        });

        it("returns false when state is not published", () => {
            const state = createMockState(ReviewTaskStates.assigned);
            expect(publishedSelector(state)).toBe(false);
        });
    });

    describe("assignedSelector", () => {
        it("returns true when state is assigned", () => {
            const state = createMockState(ReviewTaskStates.assigned);
            expect(assignedSelector(state)).toBe(true);
        });

        it("returns false when state is not assigned", () => {
            const state = createMockState(ReviewTaskStates.unassigned);
            expect(assignedSelector(state)).toBe(false);
        });
    });

    describe("reportSelector", () => {
        it("returns true when state is reported", () => {
            const state = createMockState(ReviewTaskStates.reported);
            expect(reportSelector(state)).toBe(true);
        });

        it("returns true when state is selectCrossChecker", () => {
            const state = createMockState(ReviewTaskStates.selectCrossChecker);
            expect(reportSelector(state)).toBe(true);
        });

        it("returns true when state is selectReviewer", () => {
            const state = createMockState(ReviewTaskStates.selectReviewer);
            expect(reportSelector(state)).toBe(true);
        });

        it("returns false for assigned state", () => {
            const state = createMockState(ReviewTaskStates.assigned);
            expect(reportSelector(state)).toBe(false);
        });

        it("returns false for published state", () => {
            const state = createMockState(ReviewTaskStates.published);
            expect(reportSelector(state)).toBe(false);
        });
    });

    describe("crossCheckingSelector", () => {
        it("returns true when state is crossChecking", () => {
            const state = createMockState(ReviewTaskStates.crossChecking);
            expect(crossCheckingSelector(state)).toBe(true);
        });

        it("returns false when state is not crossChecking", () => {
            const state = createMockState(ReviewTaskStates.assigned);
            expect(crossCheckingSelector(state)).toBe(false);
        });
    });

    describe("addCommentCrossCheckingSelector", () => {
        it("returns true when state is addCommentCrossChecking", () => {
            const state = createMockState(
                ReviewTaskStates.addCommentCrossChecking
            );
            expect(addCommentCrossCheckingSelector(state)).toBe(true);
        });

        it("returns false when state is not addCommentCrossChecking", () => {
            const state = createMockState(ReviewTaskStates.crossChecking);
            expect(addCommentCrossCheckingSelector(state)).toBe(false);
        });
    });

    describe("reviewingSelector", () => {
        it("returns true when state is submitted", () => {
            const state = createMockState(ReviewTaskStates.submitted);
            expect(reviewingSelector(state)).toBe(true);
        });

        it("returns true when state is rejected (dead code)", () => {
            const state = createMockState(ReviewTaskStates.rejected);
            expect(reviewingSelector(state)).toBe(true);
        });

        it("returns false when state is assigned", () => {
            const state = createMockState(ReviewTaskStates.assigned);
            expect(reviewingSelector(state)).toBe(false);
        });
    });

    describe("reviewNotStartedSelector", () => {
        it("returns true when state is unassigned", () => {
            const state = createMockState(ReviewTaskStates.unassigned);
            expect(reviewNotStartedSelector(state)).toBe(true);
        });

        it("returns false when state is assigned", () => {
            const state = createMockState(ReviewTaskStates.assigned);
            expect(reviewNotStartedSelector(state)).toBe(false);
        });
    });

    describe("reviewDataSelector", () => {
        it("extracts reviewData from context", () => {
            const reviewData = {
                summary: "Test summary",
                classification: "true",
            };
            const state = createMockState(ReviewTaskStates.assigned, {
                reviewData,
            });
            expect(reviewDataSelector(state)).toEqual(reviewData);
        });

        it("returns undefined when context has no reviewData", () => {
            const state = createMockState(ReviewTaskStates.assigned, {});
            expect(reviewDataSelector(state)).toBeUndefined();
        });
    });

    describe("all selectors return false for non-matching states", () => {
        const allStates = Object.values(ReviewTaskStates);

        it("publishedSelector only matches published", () => {
            const matching = allStates.filter((s) =>
                publishedSelector(createMockState(s))
            );
            expect(matching).toEqual([ReviewTaskStates.published]);
        });

        it("assignedSelector only matches assigned", () => {
            const matching = allStates.filter((s) =>
                assignedSelector(createMockState(s))
            );
            expect(matching).toEqual([ReviewTaskStates.assigned]);
        });

        it("reportSelector matches exactly 3 states", () => {
            const matching = allStates.filter((s) =>
                reportSelector(createMockState(s))
            );
            expect(matching).toHaveLength(3);
            expect(matching).toContain(ReviewTaskStates.reported);
            expect(matching).toContain(ReviewTaskStates.selectCrossChecker);
            expect(matching).toContain(ReviewTaskStates.selectReviewer);
        });

        it("reviewingSelector matches submitted and rejected", () => {
            const matching = allStates.filter((s) =>
                reviewingSelector(createMockState(s))
            );
            expect(matching).toEqual([
                ReviewTaskStates.submitted,
                ReviewTaskStates.rejected,
            ]);
        });
    });
});
