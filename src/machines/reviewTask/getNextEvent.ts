import {
    ReviewTaskEvents as Events,
    ReportModelEnum,
    ReviewTaskStates as States,
} from "./enums";

const getNextEvents = (
    param: Events | States,
    isSameLabel = false,
    reportModel: ReportModelEnum = ReportModelEnum.FactChecking
) => {
    const defaultEvents = [Events.goback, Events.draft];
    const eventsMap = {
        [States.unassigned]: [
            reportModel === ReportModelEnum.Request
                ? Events.assignRequest
                : Events.assignUser,
        ],
        [Events.assignUser]: [...defaultEvents, Events.finishReport],
        [States.assigned]:
            reportModel === ReportModelEnum.FactChecking
                ? [...defaultEvents, Events.finishReport]
                : [Events.draft, Events.finishReport],

        [Events.assignRequest]: [Events.rejectRequest, Events.publish],
        [States.assignedRequest]: [Events.rejectRequest, Events.publish],

        [Events.finishReport]: 
            reportModel === ReportModelEnum.FactChecking
                ? [Events.goback ,Events.selectedCrossChecking, Events.selectedReview]
                : [Events.goback, Events.publish],
        [States.reported]:
            reportModel === ReportModelEnum.FactChecking
                ? [Events.goback,Events.selectedCrossChecking, Events.selectedReview]
                : [Events.goback, Events.publish],
        [Events.submitCrossChecking]: [
            Events.goback,
            Events.selectedCrossChecking,
            Events.selectedReview,
        ],

        [Events.selectedCrossChecking]: [
            Events.goback,
            Events.sendToCrossChecking,
        ],
        [States.selectCrossChecker]: [
            Events.goback,
            Events.sendToCrossChecking,
        ],

        [Events.selectedReview]: [Events.goback, Events.sendToCrossChecking],
        [States.selectReviewer]: [Events.goback, Events.sendToReview],

        [Events.sendToCrossChecking]: [
            Events.addComment,
            Events.submitCrossChecking,
        ],
        [States.crossChecking]: [Events.addComment, Events.submitCrossChecking],

        [States.addCommentCrossChecking]: [Events.goback, Events.submitComment],
        [Events.addComment]: [Events.goback, Events.submitComment],

        [Events.submitComment]: isSameLabel
            ? [Events.goback, Events.sendToCrossChecking, Events.selectedReview]
            : [...defaultEvents, Events.finishReport],

        [States.submitted]: [Events.addRejectionComment, Events.publish],
        [Events.sendToReview]: [Events.addRejectionComment, Events.publish],

        [Events.addRejectionComment]:
            reportModel === ReportModelEnum.FactChecking
                ? [...defaultEvents, Events.finishReport]
                : [Events.draft, Events.finishReport],

        [States.published]:
            reportModel === ReportModelEnum.Request ? [Events.reset] : [],
        [Events.publish]:
            reportModel === ReportModelEnum.Request ? [Events.reset] : [],

        [Events.reset]: [Events.rejectRequest, Events.publish],
        [States.rejectedRequest]: [],
        [Events.rejectRequest]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
