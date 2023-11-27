import {
    ReviewTaskEvents as Events,
    ReviewTaskStates as States,
} from "./enums";

const getNextEvents = (param: Events | States, isSameLabel = false) => {
    const defaultEvents = [Events.goback, Events.draft];
    const eventsMap = {
        [States.unassigned]: [Events.assignUser],
        [Events.assignUser]: [...defaultEvents, Events.finishReport],
        [States.assigned]: [...defaultEvents, Events.finishReport],

        [Events.finishReport]: [
            Events.goback,
            Events.selectedCrossChecking,
            Events.selectedReview,
        ],
        [States.reported]: [
            Events.goback,
            Events.selectedCrossChecking,
            Events.selectedReview,
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
        [Events.addRejectionComment]: [...defaultEvents, Events.finishReport],

        [States.published]: [],
        [Events.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
