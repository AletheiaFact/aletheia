import {
    ReviewTaskEvents as Events,
    ReviewTaskStates as States,
} from "./enums";

const getNextEvents = (param: Events | States) => {
    const defaultEvents = [Events.goback, Events.draft];
    const eventsMap = {
        [States.unassigned]: [Events.assignUser],
        [Events.assignUser]: [
            ...defaultEvents,
            Events.partialReview,
            Events.fullReview,
        ],
        [States.assigned]: [
            ...defaultEvents,
            Events.partialReview,
            Events.fullReview,
        ],
        [Events.fullReview]: [...defaultEvents, Events.finishReport],
        [States.summarized]: [...defaultEvents, Events.finishReport],

        [Events.finishReport]: [Events.goback, Events.submit],
        [Events.partialReview]: [Events.goback, Events.submit],
        [States.reported]: [Events.goback, Events.submit],

        [States.submitted]: [Events.reject, Events.publish],
        [Events.submit]: [Events.reject, Events.publish],

        [States.rejected]: [Events.goback, Events.addRejectionComment],
        [Events.addRejectionComment]: [
            ...defaultEvents,
            Events.partialReview,
            Events.fullReview,
        ],

        [States.published]: [],
        [Events.publish]: [],
    };

    return eventsMap[param];
};

export default getNextEvents;
