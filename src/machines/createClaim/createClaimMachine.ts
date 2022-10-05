import { createMachine, interpret } from "xstate";
import {
    CreateClaimEvents as Events,
    CreateClaimStates as States,
} from "./types";
import { CreateClaimMachineEvents } from "./events";
import { CreateClaimMachineStates } from "./states";
import { saveClaimContext } from "./actions";
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
                        actions: [saveClaimContext],
                    },
                    [Events.startImage]: {
                        target: States.setupImage,
                        actions: [saveClaimContext],
                    },
                },
            },
            [States.setupSpeech]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.personalityAdded,
                        actions: [saveClaimContext],
                    },
                },
            },
            [States.setupImage]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.personalityAdded,
                        actions: [saveClaimContext],
                    },
                    [Events.noPersonality]: {
                        target: States.personalityAdded,
                        actions: [saveClaimContext],
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
