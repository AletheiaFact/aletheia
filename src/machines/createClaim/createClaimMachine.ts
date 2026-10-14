import { createMachine } from "xstate";
import {
    CreateClaimEvents as Events,
    CreateClaimStates as States,
} from "./types";
import { CreateClaimMachineEvents } from "./events";
import { CreateClaimMachineStates } from "./states";
import {
    persistClaim,
    removePersonality,
    resetClaimContext,
    saveClaimContext,
    startDebate,
    startUnattributed,
    startImage,
    startSpeech,
} from "./actions";
import { CreateClaimContext } from "./context";

const updateGroupEvent = {
    [Events.updateGroup]: {
        actions: [saveClaimContext],
    },
};

// Every step currently goes back to the format selection. To go back one step
// at a time, change the personalityAdded target to the matching setup state.
const backEvent = {
    [Events.back]: {
        target: States.notStarted,
        actions: [resetClaimContext],
    },
};

export const newCreateClaimMachine = ({ value, context }) => {
    return createMachine<
        CreateClaimContext,
        CreateClaimMachineEvents,
        CreateClaimMachineStates
    >({
        initial: value,
        context,
        states: {
            [States.notStarted]: {
                on: {
                    [Events.startSpeech]: {
                        target: States.setupSpeech,
                        actions: [startSpeech],
                    },
                    [Events.startImage]: {
                        target: States.setupImage,
                        actions: [startImage],
                    },
                    [Events.startDebate]: {
                        target: States.setupDebate,
                        actions: [startDebate],
                    },
                    [Events.startUnattributed]: {
                        target: States.personalityAdded,
                        actions: [startUnattributed],
                    },
                    ...updateGroupEvent,
                },
            },
            [States.setupSpeech]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.setupSpeech,
                        actions: [saveClaimContext],
                    },
                    [Events.savePersonality]: {
                        target: States.personalityAdded,
                    },
                    [Events.removePersonality]: {
                        target: States.setupSpeech,
                        actions: [removePersonality],
                    },
                    ...updateGroupEvent,
                    ...backEvent,
                },
            },
            [States.setupImage]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.setupImage,
                        actions: [saveClaimContext],
                    },
                    [Events.noPersonality]: {
                        target: States.personalityAdded,
                        actions: [saveClaimContext],
                    },
                    [Events.savePersonality]: {
                        target: States.personalityAdded,
                    },
                    ...updateGroupEvent,
                    ...backEvent,
                },
            },
            [States.setupDebate]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.setupDebate,
                        actions: [saveClaimContext],
                    },
                    [Events.savePersonality]: {
                        target: States.personalityAdded,
                    },
                    [Events.removePersonality]: {
                        target: States.setupDebate,
                        actions: [removePersonality],
                    },
                    ...updateGroupEvent,
                    ...backEvent,
                },
            },
            [States.personalityAdded]: {
                on: {
                    [Events.persist]: {
                        target: States.persisted,
                        actions: [persistClaim],
                    },
                    ...updateGroupEvent,
                    ...backEvent,
                },
            },
            [States.persisted]: {
                type: "final",
            },
        },
    });
};
