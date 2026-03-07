/**
 * getNextForm — maps review task states/events to form field lists.
 *
 * All 6 form field imports are redirected to a simple mock via
 * moduleNameMapper in src/jest.config.json, avoiding JSX/browser deps.
 * Every import resolves to the same mock (["mockedField"]), so we verify
 * the mapping structure rather than identity of each distinct form list.
 */
import getNextForm from "./getNextForm";
import {
    ReviewTaskEvents as Events,
    ReviewTaskStates as States,
} from "./enums";

const MOCKED_FIELD_LIST = ["mockedField"]; // matches __mocks__/fieldListMock.ts

describe("getNextForm", () => {
    describe("state → form mappings", () => {
        it("returns a form for unassigned state", () => {
            expect(getNextForm(States.unassigned)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for assigned state", () => {
            expect(getNextForm(States.assigned)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for reported state", () => {
            expect(getNextForm(States.reported)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for selectCrossChecker state", () => {
            expect(getNextForm(States.selectCrossChecker)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for selectReviewer state", () => {
            expect(getNextForm(States.selectReviewer)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for crossChecking state", () => {
            expect(getNextForm(States.crossChecking)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for addCommentCrossChecking state", () => {
            expect(getNextForm(States.addCommentCrossChecking)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for submitted state", () => {
            expect(getNextForm(States.submitted)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns empty array for published state", () => {
            expect(getNextForm(States.published)).toEqual([]);
        });

        it("returns empty array for rejectedRequest state", () => {
            expect(getNextForm(States.rejectedRequest)).toEqual([]);
        });

        it("returns a form for assignedRequest state", () => {
            expect(getNextForm(States.assignedRequest)).toEqual(
                MOCKED_FIELD_LIST
            );
        });
    });

    describe("event → form mappings", () => {
        it("returns a form for assignUser event", () => {
            expect(getNextForm(Events.assignUser)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for finishReport event", () => {
            expect(getNextForm(Events.finishReport)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for selectedCrossChecking event", () => {
            expect(getNextForm(Events.selectedCrossChecking)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for selectedReview event", () => {
            expect(getNextForm(Events.selectedReview)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for sendToCrossChecking event", () => {
            expect(getNextForm(Events.sendToCrossChecking)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for addComment event", () => {
            expect(getNextForm(Events.addComment)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for submitComment event", () => {
            expect(getNextForm(Events.submitComment)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for submitCrossChecking event", () => {
            expect(getNextForm(Events.submitCrossChecking)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for sendToReview event", () => {
            expect(getNextForm(Events.sendToReview)).toEqual(MOCKED_FIELD_LIST);
        });

        it("returns a form for addRejectionComment event", () => {
            expect(getNextForm(Events.addRejectionComment)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns empty array for publish event", () => {
            expect(getNextForm(Events.publish)).toEqual([]);
        });

        it("returns empty array for rejectRequest event", () => {
            expect(getNextForm(Events.rejectRequest)).toEqual([]);
        });

        it("returns a form for assignRequest event", () => {
            expect(getNextForm(Events.assignRequest)).toEqual(
                MOCKED_FIELD_LIST
            );
        });

        it("returns a form for reset event", () => {
            expect(getNextForm(Events.reset)).toEqual(MOCKED_FIELD_LIST);
        });
    });

    describe("structural validation", () => {
        it("states/events returning empty arrays are terminal states", () => {
            const emptyFormStates = [
                States.published,
                States.rejectedRequest,
            ];
            const emptyFormEvents = [Events.publish, Events.rejectRequest];

            emptyFormStates.forEach((state) => {
                expect(getNextForm(state)).toEqual([]);
            });
            emptyFormEvents.forEach((event) => {
                expect(getNextForm(event)).toEqual([]);
            });
        });

        it("all mapped states/events return either an array or undefined", () => {
            const allStates = Object.values(States);
            const allEvents = Object.values(Events);

            [...allStates, ...allEvents].forEach((param) => {
                const result = getNextForm(param);
                if (result !== undefined) {
                    expect(Array.isArray(result)).toBe(true);
                }
            });
        });
    });

    describe("edge cases", () => {
        it("returns undefined for unknown param", () => {
            expect(getNextForm("nonExistent" as any)).toBeUndefined();
        });
    });
});
