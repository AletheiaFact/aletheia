export type AssignEvent = { type: 'ASSIGN_USER', sentence_hash: string, userId: string, t: any }
export type ReportEvent = { type: 'REPORT_FINISHED', sentence_hash: string, summary: string, questions: string[], report: string, verification: string, source: string[], t: any }
export type PublishEvent = { type: 'PUBLISHED', sentence_hash: string, classification: string, t: any }

export type reviewTaskMachineEvents =
    | AssignEvent
    | ReportEvent
    | PublishEvent
