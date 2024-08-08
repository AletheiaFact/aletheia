import { Group } from "./Group";

export type VerificationRequest = {
    data_hash: string;
    content: string;
    isSensitive: boolean;
    rejected: boolean;
    group: Group;
    date: Date;
    sources?: string[];
    _id?: string;
};
