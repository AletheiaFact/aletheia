import { Group } from "./Group";
import { Source } from "../../server/source/schemas/source.schema";

export type VerificationRequest = {
    data_hash: string;
    content: string;
    isSensitive: boolean;
    rejected: boolean;
    group: Group;
    date: Date;
    source?: Source[];
    _id?: string;
    publicationDate: string;
    heardFrom: string;
};
