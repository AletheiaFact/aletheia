export type VerificationRequest = {
    data_hash: string;
    content: string;
    isSensitive: boolean;
    rejected: boolean;
    group: string[];
    date: Date;
    sources: string[];
};
