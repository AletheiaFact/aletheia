import {
    resolvePermissions,
    PermissionInput,
} from "../../src/machines/reviewTask/permissions";
import {
    ReviewTaskStates,
    ReviewTaskEvents,
    ReportModelEnum,
} from "../../src/machines/reviewTask/enums";
import { Roles } from "../../src/types/enums";

const buildInput = (
    overrides: Partial<PermissionInput> = {}
): PermissionInput => ({
    state: ReviewTaskStates.assigned,
    userRole: Roles.FactChecker,
    isLoggedIn: true,
    userAssignments: {
        isAssignee: true,
        isReviewer: false,
        isCrossChecker: false,
        isAdmin: false,
    },
    reportModel: ReportModelEnum.FactChecking,
    availableEvents: [
        ReviewTaskEvents.finishReport,
        ReviewTaskEvents.draft,
        ReviewTaskEvents.goback,
    ],
    ...overrides,
});

describe("resolvePermissions", () => {
    describe("non-logged-in users", () => {
        it("should deny access on non-published states", () => {
            const nonPublishedStates = [
                ReviewTaskStates.unassigned,
                ReviewTaskStates.assigned,
                ReviewTaskStates.reported,
                ReviewTaskStates.crossChecking,
                ReviewTaskStates.submitted,
            ];

            nonPublishedStates.forEach((state) => {
                const result = resolvePermissions(
                    buildInput({
                        state,
                        isLoggedIn: false,
                        userAssignments: {
                            isAssignee: false,
                            isReviewer: false,
                            isCrossChecker: false,
                            isAdmin: false,
                        },
                    })
                );

                expect(result.canAccessState).toBe(false);
                expect(result.showForm).toBe(false);
                expect(result.canViewEditor).toBe(false);
                expect(result.formType).toBe("none");
            });
        });

        it("should allow viewing published reports", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.published,
                    isLoggedIn: false,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canAccessState).toBe(true);
            expect(result.canViewEditor).toBe(true);
            expect(result.showForm).toBe(false);
            expect(result.canSubmitActions).toEqual([]);
        });
    });

    describe("unassigned state", () => {
        it("should allow admin to assign users", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.unassigned,
                    userRole: Roles.Admin,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: true,
                    },
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.canSelectUsers).toBe(true);
            expect(result.formType).toBe("selection");
        });

        it("should allow FactChecker to assign users", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.unassigned,
                    userRole: Roles.FactChecker,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.canSelectUsers).toBe(true);
        });

        it("should give Regular users readonly view", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.unassigned,
                    userRole: Roles.Regular,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canAccessState).toBe(true);
            expect(result.showForm).toBe(true);
            expect(result.canSubmitActions).toEqual([]);
            expect(result.canEditEditor).toBe(false);
        });
    });

    describe("assigned state", () => {
        it("should allow assignee to edit and save drafts", () => {
            const result = resolvePermissions(buildInput());

            expect(result.canEditEditor).toBe(true);
            expect(result.canSaveDraft).toBe(true);
            expect(result.showSaveDraftButton).toBe(true);
            expect(result.formType).toBe("editor");
        });

        it("should give non-assignee readonly view", () => {
            const result = resolvePermissions(
                buildInput({
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.canEditEditor).toBe(false);
            expect(result.canSaveDraft).toBe(false);
        });
    });

    describe("reported state", () => {
        it("should allow assignee to edit", () => {
            const result = resolvePermissions(
                buildInput({ state: ReviewTaskStates.reported })
            );

            expect(result.canEditEditor).toBe(true);
            expect(result.canSaveDraft).toBe(true);
        });

        it("should give non-assignee readonly view", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.reported,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canEditEditor).toBe(false);
            expect(result.canViewEditor).toBe(true);
        });
    });

    describe("crossChecking state", () => {
        it("should allow cross-checker to view but not edit", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.crossChecking,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: true,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canViewEditor).toBe(true);
            expect(result.canEditEditor).toBe(false);
            expect(result.showForm).toBe(true);
            expect(result.formType).toBe("readonly");
        });

        it("should give non-cross-checker readonly view with no form", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.crossChecking,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.canSubmitActions).toEqual([]);
        });
    });

    describe("addCommentCrossChecking state", () => {
        it("should allow cross-checker to comment", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.addCommentCrossChecking,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: true,
                        isAdmin: false,
                    },
                })
            );

            expect(result.formType).toBe("comment");
            expect(result.showForm).toBe(true);
            expect(result.canEditEditor).toBe(false);
        });

        it("should give non-cross-checker readonly view", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.addCommentCrossChecking,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canSubmitActions).toEqual([]);
        });
    });

    describe("submitted state", () => {
        it("should allow reviewer to act but filter goback", () => {
            const events = [ReviewTaskEvents.publish, ReviewTaskEvents.goback];
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.submitted,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: true,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                    availableEvents: events,
                })
            );

            expect(result.showForm).toBe(true);
            // Reviewers can't go back — only admins can
            expect(result.canSubmitActions).toEqual([ReviewTaskEvents.publish]);
        });

        it("should deny non-reviewer form access", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.submitted,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.canSubmitActions).toEqual([]);
        });
    });

    describe("rejected state", () => {
        it("should allow reviewer to comment", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.rejected,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: true,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.formType).toBe("comment");
        });

        it("should deny non-reviewer form access", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.rejected,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canSubmitActions).toEqual([]);
        });
    });

    describe("published state", () => {
        it("should allow admin to act", () => {
            const events = [ReviewTaskEvents.goback];
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.published,
                    userRole: Roles.Admin,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: true,
                    },
                    availableEvents: events,
                })
            );

            expect(result.showForm).toBe(true);
            expect(result.canSubmitActions).toEqual(events);
        });

        it("should deny non-admin actions", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.published,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: false,
                        isAdmin: false,
                    },
                })
            );

            expect(result.showForm).toBe(false);
            expect(result.canSubmitActions).toEqual([]);
        });
    });

    describe("admin override", () => {
        const adminAssignments = {
            isAssignee: false,
            isReviewer: false,
            isCrossChecker: false,
            isAdmin: true,
        };

        it("should allow admin to edit in assigned state", () => {
            const result = resolvePermissions(
                buildInput({
                    userRole: Roles.Admin,
                    userAssignments: adminAssignments,
                })
            );

            expect(result.canEditEditor).toBe(true);
            expect(result.canSaveDraft).toBe(true);
        });

        it("should restrict admin editing in selectReviewer state", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.selectReviewer,
                    userRole: Roles.Admin,
                    userAssignments: adminAssignments,
                })
            );

            expect(result.canEditEditor).toBe(false);
            expect(result.editorReadonly).toBe(true);
        });

        it("should restrict admin editing in published state", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.published,
                    userRole: Roles.Admin,
                    userAssignments: adminAssignments,
                })
            );

            expect(result.canEditEditor).toBe(false);
        });

        it("should always give admin access and view permissions", () => {
            const states = [
                ReviewTaskStates.assigned,
                ReviewTaskStates.reported,
                ReviewTaskStates.crossChecking,
                ReviewTaskStates.submitted,
            ];

            states.forEach((state) => {
                const result = resolvePermissions(
                    buildInput({
                        state,
                        userRole: Roles.Admin,
                        userAssignments: adminAssignments,
                    })
                );

                expect(result.canAccessState).toBe(true);
                expect(result.canViewEditor).toBe(true);
                expect(result.canSelectUsers).toBe(true);
            });
        });
    });

    describe("permission consistency validation", () => {
        it("should lock down draft when canEditEditor is false", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.crossChecking,
                    userAssignments: {
                        isAssignee: false,
                        isReviewer: false,
                        isCrossChecker: true,
                        isAdmin: false,
                    },
                })
            );

            expect(result.canEditEditor).toBe(false);
            expect(result.canSaveDraft).toBe(false);
            expect(result.showSaveDraftButton).toBe(false);
        });

        it("should lock down editing when canViewEditor is false", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.assigned,
                    isLoggedIn: false,
                })
            );

            expect(result.canViewEditor).toBe(false);
            expect(result.canEditEditor).toBe(false);
            expect(result.canSaveDraft).toBe(false);
        });

        it("should lock everything when canAccessState is false", () => {
            const result = resolvePermissions(
                buildInput({
                    state: ReviewTaskStates.assigned,
                    isLoggedIn: false,
                })
            );

            expect(result.canAccessState).toBe(false);
            expect(result.canViewEditor).toBe(false);
            expect(result.canEditEditor).toBe(false);
            expect(result.canSubmitActions).toEqual([]);
            expect(result.showForm).toBe(false);
            expect(result.formType).toBe("none");
        });
    });
});
