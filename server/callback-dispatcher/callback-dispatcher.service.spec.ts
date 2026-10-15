import { BadRequestException } from "@nestjs/common";
import { CallbackDispatcherService } from "./callback-dispatcher.service";

describe("CallbackDispatcherService", () => {
    const params = { targetId: "vr-1", field: "severity" };
    let dispatcher: CallbackDispatcherService;

    beforeEach(() => {
        dispatcher = new CallbackDispatcherService();
    });

    it("passes params, result and the task meta to the handler", async () => {
        const handler = vi.fn(async () => undefined);
        dispatcher.register("route", handler);

        await dispatcher.dispatch("route", params, "high_1", {
            taskId: "task-1",
            model: "jev-1.13.0",
        });

        expect(handler).toHaveBeenCalledWith(params, "high_1", {
            taskId: "task-1",
            model: "jev-1.13.0",
        });
    });

    it("passes an empty meta when the caller sends none", async () => {
        const handler = vi.fn(async () => undefined);
        dispatcher.register("route", handler);

        await dispatcher.dispatch("route", params, "high_1");

        expect(handler).toHaveBeenCalledWith(params, "high_1", {});
    });

    it("rejects params without targetId or field", async () => {
        const handler = vi.fn(async () => undefined);
        dispatcher.register("route", handler);

        await expect(
            dispatcher.dispatch("route", { targetId: "vr-1" }, "high_1")
        ).rejects.toBeInstanceOf(BadRequestException);
        expect(handler).not.toHaveBeenCalled();
    });
});
