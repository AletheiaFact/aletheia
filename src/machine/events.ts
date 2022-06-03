import { ReviewTaskEvents } from "./enums";

export type AssignEvent = {
    type: ReviewTaskEvents.assignUser;
    sentence_hash: string;
    userId: string;
    t: any;
};
export type ReportEvent = {
    type: ReviewTaskEvents.finishReport;
    sentence_hash: string;
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    source: string[];
    t: any;
};
export type PublishEvent = {
    type: ReviewTaskEvents.publish;
    sentence_hash: string;
    classification: string;
    t: any;
};

export type ReviewTaskMachineEvents = AssignEvent | ReportEvent | PublishEvent;
