export interface IVerificationRequest {
    _id?: any;
    id?: any;
    data_hash: string;
    content: string;
    sourceChannel: string;
    reportType?: string;
    impactArea?: any;
    additionalInfo?: string;
    publicationDate?: string;
    email?: string;
    heardFrom?: string;
    source?: any[];
    date: Date;
    group?: any;
    rejected?: boolean;
    isSensitive?: boolean;
    embedding?: number[];
    topics?: any[];
    severity?: string;
    status: string;
    statesExecuted?: string[];
    identifiedData?: any[];
    stateRetries?: any;
    stateErrors?: Array<{ state: string; error: string; timestamp: Date }>;
    stateTransitions?: Array<{
        from: string;
        to: string;
        timestamp: Date;
        duration: number;
    }>;
    progress?: any;
    stateFingerprints?: any;
    auditLog?: Array<Record<string, any>>;
    pendingAiTasks?: any;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
