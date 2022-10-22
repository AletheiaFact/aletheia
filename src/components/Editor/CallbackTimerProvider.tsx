import { assign, createMachine } from "xstate";
import React, { createContext } from "react";
import { useInterpret } from "@xstate/react";

interface CallbackTimerContext {
    stopped: boolean;
    interval: number;
    autoSaveCallback: any;
}

type CallbackTimerEvent = {
    type: "AUTO_SAVE";
};

export const CallbackTimerMachine = {
    initial: "running",
    context: {
        stopped: false,
        interval: 5,
        callbackResult: null,
        autoSaveCallback: () => {},
    },
    states: {
        running: {
            invoke: {
                src: (context) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            context.autoSaveCallback().then(resolve);
                        }, 1000 * context.interval);
                    });
                },
                onDone: {
                    target: "resetting",
                    actions: assign({
                        callbackResult: (context, event: any) => {
                            return event.data;
                        },
                    }),
                },
            },
        },
        resetting: {
            always: {
                target: "running",
            },
        },
        paused: {
            always: {
                target: "running",
                cond: (context) => !context.stopped,
            },
        },
    },
};

export const GlobalStateContext = createContext({});

export const CallbackTimerProvider = ({ callback, children }) => {
    CallbackTimerMachine.context.autoSaveCallback = callback;
    const timerService = useInterpret(
        createMachine<CallbackTimerContext, CallbackTimerEvent>(
            CallbackTimerMachine
        )
    );
    return (
        <GlobalStateContext.Provider value={{ timerService }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
