import { BaseActionObject, StatesConfig } from "xstate/lib/types";
import { saveContext } from "./actions";
import {
    CompoundStates,
    ReviewTaskEvents as Events,
    ReportModelEnum,
    ReviewTaskStates as States,
} from "./enums";
import { SaveEvent } from "./events";
import { ReviewTaskMachineContextType } from "./context";

export const isSameLabel = (context, event) =>
    context?.reviewData?.classification ===
    event?.reviewData?.crossCheckingClassification;

const isDifferentLabel = (context, event) =>
    context?.classification !== event?.reviewData?.crossCheckingClassification;

const draftSubStates = {
    initial: CompoundStates.undraft,
    states: {
        undraft: {
            on: {
                SAVE_DRAFT: {
                    target: CompoundStates.draft,
                    actions: [saveContext],
                },
            },
        },
        draft: {
            on: {
                SAVE_DRAFT: {
                    target: CompoundStates.draft,
                    actions: [saveContext],
                },
            },
        },
    },
};

const factCheckingWorkflow: StatesConfig<
    ReviewTaskMachineContextType,
    any,
    SaveEvent,
    BaseActionObject
> = {
    [States.unassigned]: {
        on: {
            [Events.assignUser]: {
                target: States.assigned,
                actions: [saveContext],
            },
        },
    },
    [States.assigned]: {
        ...draftSubStates,
        on: {
            [Events.goback]: {
                target: States.unassigned,
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.finishReport]: {
                target: States.reported,
                actions: [saveContext],
            },
        },
    },
    [States.reported]: {
        on: {
            [Events.goback]: {
                target: States.assigned,
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.selectedCrossChecking]: {
                target: States.selectCrossChecker,
            },
            [Events.selectedReview]: {
                target: States.selectReviewer,
            },
        },
    },
    [States.selectCrossChecker]: {
        on: {
            [Events.goback]: {
                target: States.reported,
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.sendToCrossChecking]: {
                target: States.crossChecking,
                actions: [saveContext],
            },
        },
    },
    [States.selectReviewer]: {
        on: {
            [Events.goback]: {
                target: States.reported,
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.sendToReview]: {
                target: States.submitted,
                actions: [saveContext],
            },
        },
    },
    [States.crossChecking]: {
        on: {
            [Events.addComment]: {
                target: States.addCommentCrossChecking,
                actions: [saveContext],
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.submitCrossChecking]: {
                target: States.reported,
                actions: [saveContext],
            },
        },
    },
    [States.addCommentCrossChecking]: {
        on: {
            [Events.goback]: {
                target: States.crossChecking,
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.submitComment]: [
                {
                    target: States.reported,
                    actions: [saveContext],
                    cond: isSameLabel,
                },
                {
                    target: States.assigned,
                    actions: [saveContext],
                    cond: isDifferentLabel,
                },
            ],
        },
    },
    //TODO: Investigate how to move rejected and addComment crossChecking as substates
    [States.submitted]: {
        on: {
            [Events.reject]: {
                target: States.rejected,
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.publish]: {
                target: States.published,
                actions: [saveContext],
            },
        },
    },
    [States.rejected]: {
        on: {
            [Events.addRejectionComment]: {
                target: States.assigned,
                actions: [saveContext],
            },
            [Events.reAssignUser]: {
                target: States.unassigned,
            },
            [Events.goback]: {
                target: States.submitted,
            },
        },
    },
    [States.published]: {
        type: "final",
    },
};

const informativeNewsWorkflow: StatesConfig<
    ReviewTaskMachineContextType,
    any,
    SaveEvent,
    BaseActionObject
> = {
    [States.assigned]: {
        ...draftSubStates,
        on: {
            [Events.finishReport]: {
                target: States.reported,
                actions: [saveContext],
            },
        },
    },
    [States.reported]: {
        on: {
            [Events.goback]: {
                target: States.assigned,
            },
            [Events.publish]: {
                target: States.published,
            },
        },
    },
    [States.published]: {
        type: "final",
    },
};

export const workflowMachine = {
    [ReportModelEnum.FactChecking]: factCheckingWorkflow,
    [ReportModelEnum.InformativeNews]: informativeNewsWorkflow,
};
