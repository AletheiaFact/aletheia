export interface IReport {
    _id?: any;
    id?: any;
    data_hash: string;
    reportModel: string;
    usersId?: any;
    summary: string;
    questions?: string[];
    report?: string;
    verification?: string;
    sources: string[];
    classification: string;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
