import { ClassificationEnum } from "./enums";

export type Report = {
    classification?: ClassificationEnum;
    sources?: string[];
    summary?: string;
    verification?: string;
    report?: string;
    questions?: string[];
};
