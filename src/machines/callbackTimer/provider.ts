import { atom } from "jotai";
import { atomWithMachine } from "jotai/xstate";
import { initialContext } from "./context";
import {
    CallbackTimerMachine,
    createCallbackTimerMachineService as createMachine,
} from "./callbackTimerMachine";

const callbackTimerInitialContext = atom(initialContext);

const callbackTimerAtom = atomWithMachine((get) =>
    createMachine({
        ...CallbackTimerMachine,
        context: {
            ...CallbackTimerMachine.context,
            ...get(callbackTimerInitialContext),
        },
    })
);

export {
    callbackTimerAtom,
    callbackTimerInitialContext as callbackTimerInitialConfig,
};
