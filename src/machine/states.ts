import { reviewTaskMachineContext } from "./context";

export type reviewTaskMachineState =
    | { value: 'unassigned', context: reviewTaskMachineContext}
    | { value: 'assigned', context: reviewTaskMachineContext}