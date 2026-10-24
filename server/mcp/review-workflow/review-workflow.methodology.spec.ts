import { BadRequestException, ConflictException } from "@nestjs/common";
import { ReviewWorkflowService } from "./review-workflow.service";
import { ReviewTaskQueueService } from "../../review-task/review-task-queue.service";

const DATA_HASH = "a".repeat(32);
const USER = { _id: "507f1f77bcf86cd799439011", role: { main: "reviewer" } };

const publishableReport = {
    reviewerId: USER._id,
    classification: "false",
    summary: "s",
    report: "r",
    verification: "v",
    questions: ["q"],
    sources: [{ href: "https://example.org" }],
};

const build = () => {
    const claimService = {
        getById: vi.fn(async () => ({
            content: [{ data_hash: DATA_HASH, content: "A sentence." }],
        })),
    };
    const reviewTaskService = {
        getReviewTaskByDataHash: vi.fn(async () => null as any),
        create: vi.fn(async (body: any) => body),
        // Flag on: any registered methodology is accepted
        resolveMethodologyForNewTask: vi.fn(
            (requested?: string) => requested || "aletheia"
        ),
    };
    const reviewTaskQueue = {
        transitionAtomically: vi.fn(async () => ({ _id: "t1" })),
        createAssigned: vi.fn(async (body: any) => body),
        publishSubmitted: vi.fn(async () => ({
            machine: { context: { reviewData: { usersId: [] } } },
        })),
    };
    const service = new ReviewWorkflowService(
        claimService as any,
        reviewTaskService as any,
        reviewTaskQueue as any
    );
    return { service, reviewTaskService, reviewTaskQueue };
};

const submittedTask = (classification: string, methodology?: string) => ({
    _id: "t1",
    nameSpace: "main",
    classificationMethodology: methodology,
    machine: {
        value: "submitted",
        context: { reviewData: { ...publishableReport, classification } },
    },
});

describe("ReviewWorkflowService classification methodology", () => {
    it("passes the requested methodology to the new task", async () => {
        const { service, reviewTaskQueue } = build();
        await service.startReviewTask(USER, {
            claimId: "claim-1",
            dataHash: DATA_HASH,
            nameSpace: "main",
            classificationMethodology: "rncd-debate",
        });
        expect(reviewTaskQueue.createAssigned).toHaveBeenCalledWith(
            expect.objectContaining({
                classificationMethodology: "rncd-debate",
            })
        );
    });

    const takeUpdate = (reviewTaskQueue: any) =>
        reviewTaskQueue.transitionAtomically.mock.calls[0][1].$set;

    it("sets the requested methodology when it takes a queued task", async () => {
        const { service, reviewTaskService, reviewTaskQueue } = build();
        reviewTaskService.getReviewTaskByDataHash.mockResolvedValue({
            _id: "t1",
            machine: { value: "unassigned" },
        });
        await service.startReviewTask(USER, {
            claimId: "claim-1",
            dataHash: DATA_HASH,
            nameSpace: "main",
            classificationMethodology: "rncd-debate",
        });
        expect(takeUpdate(reviewTaskQueue).classificationMethodology).toBe(
            "rncd-debate"
        );
    });

    it("sets aletheia when it takes a queued task without a request", async () => {
        const { service, reviewTaskService, reviewTaskQueue } = build();
        reviewTaskService.getReviewTaskByDataHash.mockResolvedValue({
            _id: "t1",
            machine: { value: "unassigned" },
        });
        await service.startReviewTask(USER, {
            claimId: "claim-1",
            dataHash: DATA_HASH,
            nameSpace: "main",
        });
        expect(takeUpdate(reviewTaskQueue).classificationMethodology).toBe(
            "aletheia"
        );
    });

    it("refuses to switch a queued task that already has a methodology", async () => {
        const { service, reviewTaskService, reviewTaskQueue } = build();
        reviewTaskService.getReviewTaskByDataHash.mockResolvedValue({
            _id: "t1",
            classificationMethodology: "aletheia",
            machine: { value: "unassigned" },
        });
        await expect(
            service.startReviewTask(USER, {
                claimId: "claim-1",
                dataHash: DATA_HASH,
                nameSpace: "main",
                classificationMethodology: "rncd-debate",
            })
        ).rejects.toBeInstanceOf(ConflictException);
        expect(reviewTaskQueue.transitionAtomically).not.toHaveBeenCalled();
    });

    it("keeps a queued task's stored methodology when taking it", async () => {
        const { service, reviewTaskService, reviewTaskQueue } = build();
        reviewTaskService.getReviewTaskByDataHash.mockResolvedValue({
            _id: "t1",
            classificationMethodology: "rncd-debate",
            machine: { value: "unassigned" },
        });
        await service.startReviewTask(USER, {
            claimId: "claim-1",
            dataHash: DATA_HASH,
            nameSpace: "main",
        });
        expect(takeUpdate(reviewTaskQueue)).not.toHaveProperty(
            "classificationMethodology"
        );
    });

    it("refuses to publish a classification outside the methodology", async () => {
        const { service, reviewTaskQueue } = build();
        await expect(
            service.publishReviewTask(
                USER,
                submittedTask("exaggerated", "rncd-debate")
            )
        ).rejects.toBeInstanceOf(BadRequestException);
        expect(reviewTaskQueue.publishSubmitted).not.toHaveBeenCalled();
    });

    it("publishes an allowed classification", async () => {
        const { service, reviewTaskQueue } = build();
        await service.publishReviewTask(
            USER,
            submittedTask("trustworthy", "rncd-debate")
        );
        expect(reviewTaskQueue.publishSubmitted).toHaveBeenCalledWith("t1");
    });
});

describe("ReviewTaskQueueService.publishSubmitted", () => {
    it("hands the task's methodology to the report", async () => {
        const effects = { createReportAndClaimReview: vi.fn(async () => {}) };
        const queue = new ReviewTaskQueueService({} as any, effects as any);
        vi.spyOn(queue, "transitionAtomically").mockResolvedValue({
            data_hash: DATA_HASH,
            reportModel: "Fact-checking",
            nameSpace: "main",
            target: "claim-1",
            reviewTaskType: "Claim",
            classificationMethodology: "rncd-debate",
            toObject: () => ({ machine: { context: {} } }),
        } as any);

        await queue.publishSubmitted("507f1f77bcf86cd799439011");

        expect(effects.createReportAndClaimReview).toHaveBeenCalledWith(
            DATA_HASH,
            { context: {} },
            "Fact-checking",
            "main",
            "claim-1",
            "Claim",
            "rncd-debate"
        );
    });
});
