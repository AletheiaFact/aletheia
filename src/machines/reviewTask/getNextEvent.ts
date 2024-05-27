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
        [States.unassigned]: [Events.assignUser],
        [Events.assignUser]: [...defaultEvents, Events.finishReport],
        [States.assigned]:
            reportModel === ReportModelEnum.FactChecking
                ? [...defaultEvents, Events.finishReport]
                : [Events.draft, Events.finishReport],

        [Events.finishReport]: [
            Events.goback,
            reportModel === ReportModelEnum.FactChecking
                ? Events.selectedCrossChecking
                : [],
            reportModel === ReportModelEnum.FactChecking
                ? Events.selectedReview
                : [],
            reportModel === ReportModelEnum.FactChecking ? [] : Events.publish,
        ],
        [States.reported]: [
            Events.goback,
            reportModel === ReportModelEnum.FactChecking
                ? Events.selectedCrossChecking
                : [],
            reportModel === ReportModelEnum.FactChecking
                ? Events.selectedReview
                : [],
            reportModel === ReportModelEnum.FactChecking ? [] : Events.publish,
        ],
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

        [States.submitted]: [Events.reject, Events.publish],
        [Events.sendToReview]: [Events.reject, Events.publish],

        [States.rejected]: [Events.goback, Events.addRejectionComment],
        [Events.addRejectionComment]:
            reportModel === ReportModelEnum.FactChecking
                ? [...defaultEvents, Events.finishReport]
                : [Events.draft, Events.finishReport],

        [States.published]: [],
        [Events.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
