import { createMachine, interpret } from "xstate";
import {
    CreateClaimEvents as Events,
    CreateClaimStates as States,
} from "./types";
import { CreateClaimMachineEvents } from "./events";
import { CreateClaimMachineStates } from "./states";
import { saveClaimContext, startImage, startSpeech } from "./actions";
import { CreateClaimContext } from "./context";

export const createNewMachine = ({ value, context }) => {
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
                },
            },
            [States.personalityAdded]: {
                on: {
                    [Events.publish]: {
                        target: States.published,
                        actions: [saveClaimContext],
                    },
                },
            },
            [States.published]: {
                type: "final",
            },
        },
    });
};

export const createNewCreateClaimMachineService = (machine: any) => {
    return interpret(createNewMachine(machine)).start();
};
