import { BadRequestException } from "@nestjs/common";
import { ReviewTaskService } from "./review-task.service";

class FakeReviewTaskModel {
    save = vi.fn(async () => this);
    constructor(body: Record<string, unknown>) {
        Object.assign(this, body);
    }
}

const build = (flagEnabled = true) => {
    const reportService = {
        create: vi.fn(async (report: any) => ({ ...report, _id: "r1" })),
    };
    const claimReviewService = { create: vi.fn(async () => ({})) };
    const req = { user: { _id: "u1", role: { main: "admin" } } };
    const service = new ReviewTaskService(
        req as any,
        FakeReviewTaskModel as any,
        claimReviewService as any,
        reportService as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        { isEnableClassificationMethodology: () => flagEnabled } as any
    );
    vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(null as any);
    vi.spyOn(service as any, "_createReviewTaskHistory").mockResolvedValue(
        undefined
    );
    vi.spyOn(service as any, "_createStateEvent").mockReturnValue(undefined);
    return { service, reportService };
};

const createBody = (overrides: Record<string, unknown> = {}) => ({
    data_hash: "a".repeat(32),
    reportModel: "Fact-checking",
    reviewTaskType: "Claim",
    nameSpace: "main",
    target: "t1",
    recaptcha: "",
    machine: {
        value: "assigned",
        context: { reviewData: {}, review: {} },
    },
    ...overrides,
});

const publishedTask = (classification: string, methodology?: string) => ({
    classificationMethodology: methodology,
    target: "t1",
    reviewTaskType: "Claim",
    machine: {
        value: "published",
        context: { reviewData: { classification, reviewerId: "u1" } },
    },
});

describe("ReviewTaskService classification methodology", () => {
    it("stores the requested methodology on a new fact-checking task", async () => {
        const { service } = build(true);
        const created: any = await service.create(
            createBody({ classificationMethodology: "rncd-debate" }) as any
        );
        expect(created.classificationMethodology).toBe("rncd-debate");
    });

    it("defaults a new fact-checking task to aletheia", async () => {
        const { service } = build(false);
        const created: any = await service.create(createBody() as any);
        expect(created.classificationMethodology).toBe("aletheia");
    });

    it("rejects a non-default methodology while the flag is off", async () => {
        const { service } = build(false);
        await expect(
            service.create(
                createBody({ classificationMethodology: "rncd-debate" }) as any
            )
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("does not store a methodology on non-fact-checking tasks", async () => {
        const { service } = build(true);
        const created: any = await service.create(
            createBody({
                reportModel: "Request",
                classificationMethodology: "rncd-debate",
            }) as any
        );
        expect(created.classificationMethodology).toBeUndefined();
    });

    it("refuses to publish a classification outside the methodology", () => {
        const { service, reportService } = build();
        const task = publishedTask("exaggerated", "rncd-debate");
        expect(() =>
            (service as any)._publishReviewTask(
                task,
                "main",
                task.machine,
                "hash",
                "Fact-checking"
            )
        ).toThrow(BadRequestException);
        expect(reportService.create).not.toHaveBeenCalled();
    });

    it("copies the methodology to the report on publish", async () => {
        const { service, reportService } = build();
        const task = publishedTask("trustworthy", "rncd-debate");
        (service as any)._publishReviewTask(
            task,
            "main",
            task.machine,
            "hash",
            "Fact-checking"
        );
        await vi.waitFor(() =>
            expect(reportService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    classification: "trustworthy",
                    classificationMethodology: "rncd-debate",
                })
            )
        );
    });

    it("publishes tasks saved before methodologies without the field", async () => {
        const { service, reportService } = build();
        const task = publishedTask("exaggerated");
        (service as any)._publishReviewTask(
            task,
            "main",
            task.machine,
            "hash",
            "Fact-checking"
        );
        await vi.waitFor(() => expect(reportService.create).toHaveBeenCalled());
        expect(reportService.create.mock.calls[0][0]).not.toHaveProperty(
            "classificationMethodology"
        );
    });
});
