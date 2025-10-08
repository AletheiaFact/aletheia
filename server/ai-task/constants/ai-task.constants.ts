export enum AiTaskState {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
}

export enum AiTaskType {
    TEXT_EMBEDDING = "text_embedding",
    IDENTIFYING_DATA = "identifying_data",
    DEFINING_TOPICS = "defining_topics",
    DEFINING_IMPACT_AREA = "defining_impact_area",
    DEFINING_SEVERITY = "defining_severity",
}

export enum CallbackRoute {
    VERIFICATION_UPDATE_EMBEDDING = "verification_update_embedding",
    VERIFICATION_UPDATE_IDENTIFIED_DATA = "verification_update_identified_data",
    VERIFICATION_UPDATE_TOPICS = "verification_update_topics",
    VERIFICATION_UPDATE_IMPACT_AREA = "verification_update_impact_area",
    VERIFICATION_UPDATE_SEVERITY = "verification_update_severity",
}

export const AiTaskStates = Object.values(AiTaskState) as AiTaskState[];
export const AiTaskTypes = Object.values(AiTaskType) as AiTaskType[];
export const CallbackRoutes = Object.values(CallbackRoute) as CallbackRoute[];

export const DEFAULT_EMBEDDING_MODEL = "nomic-embed-text";
export const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
export const OPENAI_IDENTIFY_DATA = "o3";
