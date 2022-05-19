export type AssignEvent = { type: 'ASSIGN_USER', userId: string, sentence_hash: string }

export type reviewTaskMachineEvents =
    | AssignEvent
