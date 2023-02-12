import { CallbackTimerContext } from "./context";
import { CallbackTimerStates } from "./types";

export type CallbackTimerMachineStates =
    | { value: CallbackTimerStates.paused; context: CallbackTimerContext }
    | { value: CallbackTimerStates.running; context: CallbackTimerContext };
