export type AssignEvent = { type: 'ASSIGN_USER', id: string, sentenceHash: string }

export type reviewTaskMachineEvents =
    | AssignEvent