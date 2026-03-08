import getNextEvents from "./getNextEvent";
import {
    ReviewTaskEvents as Events,
    ReviewTaskStates as States,
    ReportModelEnum,
} from "./enums";

describe("getNextEvents", () => {
    describe("FactChecking (default reportModel)", () => {
        it("returns assignUser event for unassigned state", () => {
            expect(getNextEvents(States.unassigned)).toEqual([
                Events.assignUser,
            ]);
        });

        it("returns default events + finishReport for assignUser event", () => {
            expect(getNextEvents(Events.assignUser)).toEqual([
                Events.goback,
                Events.draft,
                Events.finishReport,
            ]);
        });

        it("returns default events + finishReport for assigned state", () => {
            expect(getNextEvents(States.assigned)).toEqual([
                Events.goback,
                Events.draft,
                Events.finishReport,
            ]);
        });

        it("returns goback + selectedCrossChecking + selectedReview for finishReport event", () => {
            expect(getNextEvents(Events.finishReport)).toEqual([
                Events.goback,
                Events.selectedCrossChecking,
                Events.selectedReview,
            ]);
        });

        it("returns goback + selectedCrossChecking + selectedReview for reported state", () => {
            expect(getNextEvents(States.reported)).toEqual([
                Events.goback,
                Events.selectedCrossChecking,
                Events.selectedReview,
            ]);
        });

        it("returns goback + sendToCrossChecking for selectedCrossChecking event", () => {
            expect(getNextEvents(Events.selectedCrossChecking)).toEqual([
                Events.goback,
                Events.sendToCrossChecking,
            ]);
        });

        it("returns goback + sendToCrossChecking for selectCrossChecker state", () => {
            expect(getNextEvents(States.selectCrossChecker)).toEqual([
                Events.goback,
                Events.sendToCrossChecking,
            ]);
        });

        // REGRESSION TEST: Fixed bug where line 51 had sendToCrossChecking instead of sendToReview
        it("returns goback + sendToReview for selectedReview event (regression)", () => {
            expect(getNextEvents(Events.selectedReview)).toEqual([
                Events.goback,
                Events.sendToReview,
            ]);
        });

        it("returns goback + sendToReview for selectReviewer state", () => {
            expect(getNextEvents(States.selectReviewer)).toEqual([
                Events.goback,
                Events.sendToReview,
            ]);
        });

        it("returns addComment + submitCrossChecking for sendToCrossChecking event", () => {
            expect(getNextEvents(Events.sendToCrossChecking)).toEqual([
                Events.addComment,
                Events.submitCrossChecking,
            ]);
        });

        it("returns addComment + submitCrossChecking for crossChecking state", () => {
            expect(getNextEvents(States.crossChecking)).toEqual([
                Events.addComment,
                Events.submitCrossChecking,
            ]);
        });

        it("returns goback + submitComment for addComment event", () => {
            expect(getNextEvents(Events.addComment)).toEqual([
                Events.goback,
                Events.submitComment,
            ]);
        });

        it("returns goback + submitComment for addCommentCrossChecking state", () => {
            expect(getNextEvents(States.addCommentCrossChecking)).toEqual([
                Events.goback,
                Events.submitComment,
            ]);
        });

        it("returns goback + selectedCrossChecking + selectedReview for submitCrossChecking event", () => {
            expect(getNextEvents(Events.submitCrossChecking)).toEqual([
                Events.goback,
                Events.selectedCrossChecking,
                Events.selectedReview,
            ]);
        });

        it("returns addRejectionComment + publish for sendToReview event", () => {
            expect(getNextEvents(Events.sendToReview)).toEqual([
                Events.addRejectionComment,
                Events.publish,
            ]);
        });

        it("returns addRejectionComment + publish for submitted state", () => {
            expect(getNextEvents(States.submitted)).toEqual([
                Events.addRejectionComment,
                Events.publish,
            ]);
        });

        it("returns default events + finishReport for addRejectionComment event", () => {
            expect(getNextEvents(Events.addRejectionComment)).toEqual([
                Events.goback,
                Events.draft,
                Events.finishReport,
            ]);
        });

        it("returns empty array for published state", () => {
            expect(getNextEvents(States.published)).toEqual([]);
        });

        it("returns empty array for publish event", () => {
            expect(getNextEvents(Events.publish)).toEqual([]);
        });
    });

    describe("isSameLabel conditional", () => {
        it("returns goback + sendToCrossChecking + selectedReview for submitComment when isSameLabel=true", () => {
            expect(getNextEvents(Events.submitComment, true)).toEqual([
                Events.goback,
                Events.sendToCrossChecking,
                Events.selectedReview,
            ]);
        });

        it("returns default events + finishReport for submitComment when isSameLabel=false", () => {
            expect(getNextEvents(Events.submitComment, false)).toEqual([
                Events.goback,
                Events.draft,
                Events.finishReport,
            ]);
        });
    });

    describe("InformativeNews reportModel", () => {
        const model = ReportModelEnum.InformativeNews;

        it("returns assignUser for unassigned state", () => {
            expect(getNextEvents(States.unassigned, false, model)).toEqual([
                Events.assignUser,
            ]);
        });

        it("returns draft + finishReport (no goback) for assigned state", () => {
            expect(getNextEvents(States.assigned, false, model)).toEqual([
                Events.draft,
                Events.finishReport,
            ]);
        });

        it("returns goback + publish for reported state (no cross-checking)", () => {
            expect(getNextEvents(States.reported, false, model)).toEqual([
                Events.goback,
                Events.publish,
            ]);
        });

        it("returns goback + publish for finishReport event", () => {
            expect(getNextEvents(Events.finishReport, false, model)).toEqual([
                Events.goback,
                Events.publish,
            ]);
        });

        it("returns draft + finishReport for addRejectionComment event", () => {
            expect(
                getNextEvents(Events.addRejectionComment, false, model)
            ).toEqual([Events.draft, Events.finishReport]);
        });
    });

    describe("Request reportModel", () => {
        const model = ReportModelEnum.Request;

        it("returns assignRequest for unassigned state", () => {
            expect(getNextEvents(States.unassigned, false, model)).toEqual([
                Events.assignRequest,
            ]);
        });

        it("returns rejectRequest + publish for assignRequest event", () => {
            expect(getNextEvents(Events.assignRequest, false, model)).toEqual([
                Events.rejectRequest,
                Events.publish,
            ]);
        });

        it("returns rejectRequest + publish for assignedRequest state", () => {
            expect(
                getNextEvents(States.assignedRequest, false, model)
            ).toEqual([Events.rejectRequest, Events.publish]);
        });

        it("returns [reset] for published state", () => {
            expect(getNextEvents(States.published, false, model)).toEqual([
                Events.reset,
            ]);
        });

        it("returns [reset] for publish event", () => {
            expect(getNextEvents(Events.publish, false, model)).toEqual([
                Events.reset,
            ]);
        });

        it("returns rejectRequest + publish for reset event", () => {
            expect(getNextEvents(Events.reset, false, model)).toEqual([
                Events.rejectRequest,
                Events.publish,
            ]);
        });

        it("returns empty array for rejectedRequest state", () => {
            expect(
                getNextEvents(States.rejectedRequest, false, model)
            ).toEqual([]);
        });

        it("returns empty array for rejectRequest event", () => {
            expect(
                getNextEvents(Events.rejectRequest, false, model)
            ).toEqual([]);
        });
    });

    describe("edge cases", () => {
        it("returns undefined for unknown param", () => {
            expect(
                getNextEvents("nonExistentState" as any)
            ).toBeUndefined();
        });
    });
});
