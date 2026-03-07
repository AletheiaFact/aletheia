import { isSameLabel, machineWorkflow } from "./machineWorkflow";
import {
    ReviewTaskStates as States,
    ReviewTaskEvents as Events,
    ReportModelEnum,
    CompoundStates,
} from "./enums";

describe("machineWorkflow", () => {
    describe("isSameLabel guard", () => {
        it("returns true when classifications match", () => {
            const context = {
                reviewData: { classification: "true" },
            };
            const event = {
                reviewData: { crossCheckingClassification: "true" },
            };
            expect(isSameLabel(context, event)).toBe(true);
        });

        it("returns false when classifications differ", () => {
            const context = {
                reviewData: { classification: "true" },
            };
            const event = {
                reviewData: { crossCheckingClassification: "false" },
            };
            expect(isSameLabel(context, event)).toBe(false);
        });

        it("handles undefined context gracefully", () => {
            expect(isSameLabel(undefined, { reviewData: {} })).toBe(true);
        });

        it("handles undefined event gracefully", () => {
            expect(isSameLabel({ reviewData: {} }, undefined)).toBe(true);
        });

        it("handles null reviewData in context", () => {
            expect(
                isSameLabel(
                    { reviewData: null },
                    { reviewData: { crossCheckingClassification: "true" } }
                )
            ).toBe(false);
        });

        it("handles null reviewData in event", () => {
            expect(
                isSameLabel(
                    { reviewData: { classification: "true" } },
                    { reviewData: null }
                )
            ).toBe(false);
        });

        it("returns true when both are undefined", () => {
            expect(
                isSameLabel({ reviewData: {} }, { reviewData: {} })
            ).toBe(true);
        });
    });

    describe("factCheckingWorkflow structure", () => {
        const workflow = machineWorkflow[ReportModelEnum.FactChecking];

        it("has 9 top-level states", () => {
            const states = Object.keys(workflow);
            expect(states).toHaveLength(9);
            expect(states).toContain(States.unassigned);
            expect(states).toContain(States.assigned);
            expect(states).toContain(States.reported);
            expect(states).toContain(States.selectCrossChecker);
            expect(states).toContain(States.selectReviewer);
            expect(states).toContain(States.crossChecking);
            expect(states).toContain(States.addCommentCrossChecking);
            expect(states).toContain(States.submitted);
            expect(states).toContain(States.published);
        });

        it("has published as final state", () => {
            expect(workflow[States.published]).toEqual({ type: "final" });
        });

        it("unassigned transitions to assigned on ASSIGN_USER", () => {
            expect(
                workflow[States.unassigned].on[Events.assignUser].target
            ).toBe(States.assigned);
        });

        it("assigned has draft sub-states", () => {
            expect(workflow[States.assigned].initial).toBe(
                CompoundStates.undraft
            );
            expect(workflow[States.assigned].states).toBeDefined();
            expect(
                workflow[States.assigned].states[CompoundStates.undraft]
            ).toBeDefined();
            expect(
                workflow[States.assigned].states[CompoundStates.draft]
            ).toBeDefined();
        });

        it("reported transitions to selectReviewer on SELECTED_REVIEW", () => {
            expect(
                workflow[States.reported].on[Events.selectedReview].target
            ).toBe(States.selectReviewer);
        });

        it("reported transitions to selectCrossChecker on SELECTED_CROSS_CHECKING", () => {
            expect(
                workflow[States.reported].on[Events.selectedCrossChecking]
                    .target
            ).toBe(States.selectCrossChecker);
        });

        it("selectReviewer transitions to submitted on SEND_TO_REVIEW", () => {
            expect(
                workflow[States.selectReviewer].on[Events.sendToReview].target
            ).toBe(States.submitted);
        });

        it("selectCrossChecker transitions to crossChecking on SEND_TO_CROSS_CHECKING", () => {
            expect(
                workflow[States.selectCrossChecker].on[
                    Events.sendToCrossChecking
                ].target
            ).toBe(States.crossChecking);
        });

        it("submitted transitions to published on PUBLISH", () => {
            expect(
                workflow[States.submitted].on[Events.publish].target
            ).toBe(States.published);
        });

        it("submitted transitions to assigned on ADD_REJECTION_COMMENT", () => {
            expect(
                workflow[States.submitted].on[Events.addRejectionComment]
                    .target
            ).toBe(States.assigned);
        });

        it("addCommentCrossChecking has conditional submitComment transition", () => {
            const transitions =
                workflow[States.addCommentCrossChecking].on[
                    Events.submitComment
                ];
            expect(Array.isArray(transitions)).toBe(true);
            expect(transitions).toHaveLength(2);
            expect(transitions[0].target).toBe(States.reported);
            expect(transitions[0].cond).toBe(isSameLabel);
            expect(transitions[1].target).toBe(States.assigned);
        });
    });

    describe("informativeNewsWorkflow structure", () => {
        const workflow = machineWorkflow[ReportModelEnum.InformativeNews];

        it("has 3 states (assigned, reported, published)", () => {
            const states = Object.keys(workflow);
            expect(states).toHaveLength(3);
            expect(states).toContain(States.assigned);
            expect(states).toContain(States.reported);
            expect(states).toContain(States.published);
        });

        it("has published as final state", () => {
            expect(workflow[States.published]).toEqual({ type: "final" });
        });

        it("assigned has draft sub-states", () => {
            expect(workflow[States.assigned].initial).toBe(
                CompoundStates.undraft
            );
        });

        it("assigned transitions to reported on FINISH_REPORT", () => {
            expect(
                workflow[States.assigned].on[Events.finishReport].target
            ).toBe(States.reported);
        });

        it("reported transitions to published on PUBLISH", () => {
            expect(
                workflow[States.reported].on[Events.publish].target
            ).toBe(States.published);
        });

        it("reported transitions to assigned on GO_BACK", () => {
            expect(
                workflow[States.reported].on[Events.goback].target
            ).toBe(States.assigned);
        });

        it("does NOT have cross-checking states", () => {
            expect(workflow[States.crossChecking]).toBeUndefined();
            expect(workflow[States.selectCrossChecker]).toBeUndefined();
            expect(workflow[States.addCommentCrossChecking]).toBeUndefined();
        });
    });

    describe("RequestWorkflow structure", () => {
        const workflow = machineWorkflow[ReportModelEnum.Request];

        it("has 4 states (unassigned, assignedRequest, published, rejectedRequest)", () => {
            const states = Object.keys(workflow);
            expect(states).toHaveLength(4);
            expect(states).toContain(States.unassigned);
            expect(states).toContain(States.assignedRequest);
            expect(states).toContain(States.published);
            expect(states).toContain(States.rejectedRequest);
        });

        it("has rejectedRequest as final state", () => {
            expect(workflow[States.rejectedRequest]).toEqual({
                type: "final",
            });
        });

        it("unassigned transitions to assignedRequest on ASSIGN_REQUEST", () => {
            expect(
                workflow[States.unassigned].on[Events.assignRequest].target
            ).toBe(States.assignedRequest);
        });

        it("assignedRequest transitions to rejectedRequest on REJECT_REQUEST", () => {
            expect(
                workflow[States.assignedRequest].on[Events.rejectRequest]
                    .target
            ).toBe(States.rejectedRequest);
        });

        it("assignedRequest transitions to published on PUBLISH", () => {
            expect(
                workflow[States.assignedRequest].on[Events.publish].target
            ).toBe(States.published);
        });

        it("published transitions to assignedRequest on RESET", () => {
            expect(
                workflow[States.published].on[Events.reset].target
            ).toBe(States.assignedRequest);
        });

        it("published is NOT a final state (has transitions)", () => {
            expect(workflow[States.published].type).toBeUndefined();
            expect(workflow[States.published].on).toBeDefined();
        });
    });

    describe("all three workflows are exported", () => {
        it("contains FactChecking workflow", () => {
            expect(
                machineWorkflow[ReportModelEnum.FactChecking]
            ).toBeDefined();
        });

        it("contains InformativeNews workflow", () => {
            expect(
                machineWorkflow[ReportModelEnum.InformativeNews]
            ).toBeDefined();
        });

        it("contains Request workflow", () => {
            expect(machineWorkflow[ReportModelEnum.Request]).toBeDefined();
        });
    });
});
