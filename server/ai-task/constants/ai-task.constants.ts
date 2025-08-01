export enum AiTaskState {
    Pending = "pending",
    InProgress = "in_progress",
    Succeeded = "succeeded",
    Failed = "failed",
}
export const AiTaskStates = Object.values(AiTaskState) as AiTaskState[];
