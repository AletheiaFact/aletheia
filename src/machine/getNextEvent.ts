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
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskStates.reported]: [
            ...defaultEvents,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
