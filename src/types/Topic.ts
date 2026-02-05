import { ObjectId } from "mongodb";
import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import { ContentModelEnum } from "./enums";
export interface Topic {
    _id: string;
    name: string;
    wikidataId: string;
    slug: string;
    language: string;
}

export interface ManualTopic {
    id: ObjectId | string;
    label: string;
    value: string;
}

export interface TopicDisplayProps {
    data_hash: string;
    topics: UnifiedTopic[];
    reviewTaskType: ReviewTaskTypeEnum;
    contentModel?: ContentModelEnum | null;
}

export type UnifiedTopic = Topic | ManualTopic;