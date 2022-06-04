import { ReviewTaskEvents } from "./enums";

export type AssignEvent = {
    type: ReviewTaskEvents.assignUser;
    userId: string;
};
export type ReportEvent = {
    type: ReviewTaskEvents.finishReport;
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    source: string[];
};
export type PublishEvent = {
    type: ReviewTaskEvents.publish;
    classification: string;
};

export type ReviewTaskMachineEvents = AssignEvent | ReportEvent | PublishEvent;
