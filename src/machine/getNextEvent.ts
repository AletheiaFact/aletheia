import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

const getNextEvents = (param: ReviewTaskEvents | ReviewTaskStates) => {
    const defaultEvents = [ReviewTaskEvents.goback, ReviewTaskEvents.draft];
    const eventsMap = {
        [ReviewTaskStates.unassigned]: [ReviewTaskEvents.assignUser],
        [ReviewTaskEvents.assignUser]: [
            ...defaultEvents,
            ReviewTaskEvents.finishReport,
        ],
        [ReviewTaskStates.assigned]: [
            ...defaultEvents,
            ReviewTaskEvents.finishReport,
        ],
        [ReviewTaskEvents.finishReport]: [
            ...defaultEvents,
            ReviewTaskEvents.submit,
        ],
        [ReviewTaskStates.reported]: [
            ...defaultEvents,
            ReviewTaskEvents.submit,
        ],
        [ReviewTaskStates.submitted]: [
            ReviewTaskEvents.reject,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskEvents.submit]: [
            ReviewTaskEvents.reject,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskStates.rejected]: [
            ReviewTaskEvents.goback,
            ReviewTaskEvents.addRejectionComment,
        ],
        [ReviewTaskEvents.addRejectionComment]: [
            ...defaultEvents,
            ReviewTaskEvents.finishReport,
        ],
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
