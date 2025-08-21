export enum AiTaskState {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
}

export enum AiTaskType {
    TEXT_EMBEDDING = "text_embedding",
}

export enum CallbackRoute {
    VERIFICATION_UPDATE_EMBEDDING = "verification_update_embedding",
}

export const AiTaskStates = Object.values(AiTaskState) as AiTaskState[];
export const AiTaskTypes = Object.values(AiTaskType) as AiTaskType[];
export const CallbackRoutes = Object.values(CallbackRoute) as CallbackRoute[];

export const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
