import { Types } from "mongoose";
import { ReviewTaskQueueService } from "./review-task-queue.service";

const doc = (value: unknown) => {
    const plain = {
        _id: new Types.ObjectId(),
        data_hash: "a".repeat(32),
        reportModel: "Fact-checking",
        nameSpace: "main",
        target: new Types.ObjectId(),
        reviewTaskType: "Claim",
        machine: { value, context: { reviewData: {}, review: {} } },
    };
    return { ...plain, toObject: () => plain };
};

function build() {
    const model = {
        findOneAndUpdate: vi.fn(),
        findById: vi.fn(),
        updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
        create: vi.fn(),
    };
    const effects = {
        recordHistory: vi.fn().mockResolvedValue(undefined),
        recordStateEvent: vi.fn(),
        createReportAndClaimReview: vi.fn().mockResolvedValue(undefined),
    };
    const service = new ReviewTaskQueueService(model as any, effects as any);
    return { service, model, effects };
}

describe("ReviewTaskQueueService", () => {
    describe("publishSubmitted", () => {
        it("puts the task back in submitted when the Report or ClaimReview fails", async () => {
            const { service, model, effects } = build();
            const submitted = doc("submitted");
            const published = doc("published");
            model.findOneAndUpdate.mockResolvedValue(submitted);
            model.findById.mockResolvedValue(published);
            effects.createReportAndClaimReview.mockRejectedValue(
                new Error("ClaimReview failed")
            );

            await expect(
                service.publishSubmitted(published._id.toString())
            ).rejects.toThrow("ClaimReview failed");
            expect(model.updateOne).toHaveBeenCalledWith(
                { _id: published._id, "machine.value": "published" },
                { $set: { "machine.value": "submitted" } }
            );
        });

        it("keeps the task published when the Report and ClaimReview exist", async () => {
            const { service, model } = build();
            const published = doc("published");
            model.findOneAndUpdate.mockResolvedValue(doc("submitted"));
            model.findById.mockResolvedValue(published);

            await expect(
                service.publishSubmitted(published._id.toString())
            ).resolves.toBe(published);
            expect(model.updateOne).not.toHaveBeenCalled();
        });
    });

    describe("createAssigned", () => {
        it("returns null when another caller created the task first", async () => {
            const { service, model, effects } = build();
            model.create.mockRejectedValue(
                Object.assign(new Error("E11000"), { code: 11000 })
            );
            await expect(service.createAssigned({} as any)).resolves.toBeNull();
            expect(effects.recordHistory).not.toHaveBeenCalled();
        });

        it("rethrows any other error", async () => {
            const { service, model } = build();
            model.create.mockRejectedValue(new Error("connection lost"));
            await expect(service.createAssigned({} as any)).rejects.toThrow(
                "connection lost"
            );
        });
    });
});
