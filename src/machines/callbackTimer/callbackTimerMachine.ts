import { createMachine } from "xstate";
import { assignCallbackResult } from "./actions";

import { CallbackTimerContext, initialContext } from "./context";
import { CallbackTimerMachineStates } from "./states";
import { CallbackTimerStates as States } from "./types";

export const CallbackTimerMachine = {
    initial: States.running,
    context: initialContext,
    states: {
        [States.running]: {
            invoke: {
                src: (context) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            context.callbackFunction(context).then(resolve);
                        }, 1000 * context.interval);
                    });
                },
                onDone: {
                    target: States.paused,
                    actions: [assignCallbackResult],
                },
            },
        },
        [States.paused]: {
            always: {
                target: States.running,
                cond: (context) => !context.stopped,
            },
        },
    },
};

export const createCallbackTimerMachineService = (
    machine = CallbackTimerMachine
) => {
    return createMachine<CallbackTimerContext, any, CallbackTimerMachineStates>(
        machine
    );
};
