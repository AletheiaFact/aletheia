export enum AiTaskState {
    Pending = "pending",
    InProgress = "in_progress",
    Succeeded = "succeeded",
    Failed = "failed",
}

export enum AiTaskType {
    TextEmbedding = "text-embedding",
}

export enum CallbackRoute {
    VerificationUpdateEmbedding = "verification.updateEmbedding",
}

export const AiTaskStates = Object.values(AiTaskState) as AiTaskState[];
export const AiTaskTypes = Object.values(AiTaskType) as AiTaskType[];
export const CallbackRoutes = Object.values(CallbackRoute) as CallbackRoute[];
