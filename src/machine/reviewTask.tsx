import { assign, createMachine } from "xstate"

type reviewTaskMachineContext = {
    id: string;
    sentenceHash: string;
}

type AssignEvent = { type: 'ASSIGN_USER', id: string, sentenceHash: string }

type reviewTaskMachineEvents =
    | AssignEvent

type reviewTaskMachineState =
    | { value: 'unassigned', context: reviewTaskMachineContext}
    | { value: 'assigned', context: reviewTaskMachineContext}

const assignedUser = assign<reviewTaskMachineContext, AssignEvent>({
    id: (context, event) => event.id,
    sentenceHash: (context, event) => event.sentenceHash
});

const initialContext: reviewTaskMachineContext = {
    id: '',
    sentenceHash: ''
}

export const reviewTaskMachine = createMachine<reviewTaskMachineContext, reviewTaskMachineEvents, reviewTaskMachineState>({
    initial: "unassigned",
    context: initialContext,
    states: {
        unassigned: {
            on: {
                ASSIGN_USER: {
                    target: "assigned",
                    actions: [assignedUser]
                }
            }
        },
        assigned: {
            type: "final"
        }
    },
})