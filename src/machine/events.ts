export type SaveEvent = {
    type: string;
    userId?: string;
    summary?: string;
    questions?: string[];
    report?: string;
    verification?: string;
    source?: string[];
    classification?: string;
    formUi: any;
    sentence_hash: string;
    personality: string;
    claim: string;
    t: any;
};

export type ReviewTaskMachineEvents = SaveEvent
