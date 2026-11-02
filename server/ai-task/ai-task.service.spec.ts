import { Types } from "mongoose";
import { AiTaskService } from "./ai-task.service";
import { AiTaskState } from "./constants/ai-task.constants";

describe("AiTaskService.updateState", () => {
    const taskId = new Types.ObjectId();
    const callbackParams = { targetId: "vr-1", field: "severity" };

    function buildService(content: unknown) {
        const task = {
            _id: taskId,
            callbackRoute: "route",
            callbackParams,
            content,
        };
        const aiTaskModel = {
            findByIdAndUpdate: vi.fn(() => ({
                exec: vi.fn(async () => task),
            })),
        };
        const dispatcher = { dispatch: vi.fn(async () => undefined) };
        const service = new AiTaskService(aiTaskModel as any, dispatcher as any);
        return { service, dispatcher };
    }

    it("dispatches the result with the task id and model", async () => {
        const { service, dispatcher } = buildService({
            text: "claim",
            model: "jev-1.13.0",
        });

        await service.updateState(taskId.toString(), {
            state: AiTaskState.SUCCEEDED,
            result: "high_1",
        });

        expect(dispatcher.dispatch).toHaveBeenCalledWith(
            "route",
            callbackParams,
            "high_1",
            { taskId: taskId.toString(), model: "jev-1.13.0" }
        );
    });

    it("leaves the model out when the task content has none", async () => {
        const { service, dispatcher } = buildService({ text: "claim" });

        await service.updateState(taskId.toString(), {
            state: AiTaskState.SUCCEEDED,
            result: "high_1",
        });

        expect(dispatcher.dispatch).toHaveBeenCalledWith(
            "route",
            callbackParams,
            "high_1",
            { taskId: taskId.toString(), model: undefined }
        );
    });

    it("does not dispatch while the task has not succeeded", async () => {
        const { service, dispatcher } = buildService({ text: "claim" });

        await service.updateState(taskId.toString(), {
            state: AiTaskState.PENDING,
        });

        expect(dispatcher.dispatch).not.toHaveBeenCalled();
    });
});
