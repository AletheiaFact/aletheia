export type AssignEvent = { type: 'ASSIGN_USER', userId: string, sentence_hash: string, t: any }
export type ReportEvent = { type: 'REPORT_FINISHED', sentence_hash: string, summary: string, questions: string[], report: string, verification: string, source: string[], t: any }
export type PublishEvent = { type: 'PUBLISHED', classification: string }

export type reviewTaskMachineEvents =
    | AssignEvent
    | ReportEvent
    | PublishEvent
