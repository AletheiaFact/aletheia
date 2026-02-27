import React from "react";
import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import { ContentModelEnum } from "./enums";
import { UnifiedDefaultValue } from "../components/Form/DynamicInput";

export interface Topic {
    _id: string;
    name: string;
    wikidataId: string;
    slug: string;
    language: string;
}

export interface ManualTopic {
    id?: string;
    aliases?: string[];
    displayLabel?: string;
    label: string;
    matchedAlias?: string | null;
    value: string;
}

export type UnifiedTopic = Topic | ManualTopic;
export interface ITagDisplay {
    handleClose: (removedTopicValue: string) => Promise<void>;
    tags: ManualTopic[];
    setShowTopicsForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ITopicForm {
    contentModel: ContentModelEnum;
    data_hash: string;
    topicsArray: UnifiedTopic[];
    setTopicsArray: React.Dispatch<React.SetStateAction<UnifiedTopic[]>>;
    setSelectedTags: React.Dispatch<React.SetStateAction<ManualTopic[]>>;
    tags: ManualTopic[];
    reviewTaskType: ReviewTaskTypeEnum;
}

export interface ITopicDisplay {
    data_hash: string;
    topics: UnifiedTopic[];
    reviewTaskType: ReviewTaskTypeEnum;
    contentModel?: ContentModelEnum | null;
}

export interface IImpactAreaSelect {
    defaultValue: UnifiedDefaultValue;
    onChange: (value: ManualTopic) => void;
    placeholder?: string;
    isDisabled: boolean;
    dataCy?: string;
}

export interface IMultiSelectAutocomplete {
    defaultValue?: UnifiedDefaultValue;
    isMultiple?: boolean;
    onChange: (value: ManualTopic[] | ManualTopic) => void;
    isLoading: boolean;
    placeholder: string;
    setSelectedTags: React.Dispatch<React.SetStateAction<ManualTopic[] | ManualTopic>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isDisabled?: boolean;
    dataCy?: string;
}
