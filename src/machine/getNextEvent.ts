import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

const getNextEvents = (param: ReviewTaskEvents | ReviewTaskStates) => {
    const eventsMap = {
        0: [ReviewTaskEvents.assignUser],
        [ReviewTaskStates.unassigned]: [ReviewTaskEvents.assignUser],
        [ReviewTaskEvents.assignUser]: [
            ReviewTaskEvents.goback,
            ReviewTaskEvents.draft,
            ReviewTaskEvents.finishReport,
        ],
        [ReviewTaskStates.assigned]: [
            ReviewTaskEvents.goback,
            ReviewTaskEvents.draft,
            ReviewTaskEvents.finishReport,
        ],
        [ReviewTaskEvents.finishReport]: [
            ReviewTaskEvents.goback,
            ReviewTaskEvents.draft,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskStates.reported]: [
            ReviewTaskEvents.goback,
            ReviewTaskEvents.draft,
            ReviewTaskEvents.publish,
        ],
        [ReviewTaskStates.published]: [],
        [ReviewTaskEvents.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
