import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

const getNextEvents = (param: ReviewTaskEvents | ReviewTaskStates) => {
    const defaultEvents = [ReviewTaskEvents.goback, ReviewTaskEvents.draft];
    const eventsMap = {
        // When going back from the 'assigned' to the 'unassigned' state
        // the param received by the function is 0
        0: [ReviewTaskEvents.assignUser],
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
            ReviewTaskEvents.goback, //remove after tests
            ReviewTaskEvents.reject,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskEvents.submit]: [
            ReviewTaskEvents.goback, //remove after tests
            ReviewTaskEvents.reject,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
