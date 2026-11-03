import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ReviewTaskService } from "./review-task.service";
import { ReviewTaskEffectsService } from "./review-task-effects.service";

class FakeReviewTaskModel {
    static findByIdAndUpdate = vi.fn(async () => ({}));
    save = vi.fn(async () => this);
    constructor(body: Record<string, unknown>) {
        Object.assign(this, body);
    }
}

const build = (flagEnabled = true, role = "admin") => {
    const reportService = {
        create: vi.fn(async (report: any) => ({ ...report, _id: "r1" })),
    };
    const claimReviewService = { create: vi.fn(async () => ({})) };
    const req = { user: { _id: "u1", role: { main: role } } };
    // Real effects so the report built on publish is checked; history and
    // state events are out of scope here
    const effects = new ReviewTaskEffectsService(
        req as any,
        claimReviewService as any,
        reportService as any,
        {} as any,
        {} as any
    );
    vi.spyOn(effects, "recordHistory").mockResolvedValue(undefined);
    vi.spyOn(effects, "recordStateEvent").mockReturnValue(undefined);
    const service = new ReviewTaskService(
        req as any,
        FakeReviewTaskModel as any,
        effects,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        { isEnableClassificationMethodology: () => flagEnabled } as any
    );
    vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(null as any);
    return { service, reportService, effects };
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

    it.each(["exaggerated", "misleading"])(
        "refuses to publish %s, a classification outside the methodology",
        (value) => {
            const { service, reportService } = build();
            const task = publishedTask(value, "rncd-debate");
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
        }
    );

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

    describe("on an existing task", () => {
        const storedTask = (state: unknown, reviewData = {}) => ({
            _id: "task-1",
            reportModel: "Fact-checking",
            nameSpace: "main",
            classificationMethodology: "aletheia",
            machine: { value: state, context: { reviewData, review: {} } },
            toObject() {
                return { ...this };
            },
        });
        const assignBody = (reviewData = {}) =>
            createBody({
                classificationMethodology: "rncd-debate",
                machine: {
                    value: { assigned: "draft" },
                    context: { reviewData: { usersId: [], ...reviewData } },
                },
            }) as any;
        const savedSet = () =>
            (FakeReviewTaskModel.findByIdAndUpdate.mock.calls.at(-1) as any)[1]
                .$set;

        beforeEach(() => FakeReviewTaskModel.findByIdAndUpdate.mockClear());

        it("switches the methodology when an admin reassigns the task", async () => {
            const { service } = build(true, "admin");
            vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(
                storedTask("reported") as any
            );
            await service.create(
                assignBody({
                    classification: "exaggerated",
                    crossCheckingClassification: "exaggerated",
                    crossCheckingComment: "ok",
                })
            );
            const set = savedSet();
            expect(set.classificationMethodology).toBe("rncd-debate");
            expect(set.machine.context.reviewData).toEqual(
                expect.objectContaining({
                    classification: "",
                    crossCheckingClassification: "",
                    crossCheckingComment: "",
                })
            );
        });

        it("keeps a label the new methodology also offers", async () => {
            const { service } = build(true, "admin");
            vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(
                storedTask("reported") as any
            );
            await service.create(assignBody({ classification: "false" }));
            expect(savedSet().machine.context.reviewData.classification).toBe(
                "false"
            );
        });

        it("lets anyone set it when taking a queued task", async () => {
            const { service } = build(true, "fact-checker");
            vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(
                storedTask("unassigned") as any
            );
            await service.create(assignBody());
            expect(savedSet().classificationMethodology).toBe("rncd-debate");
        });

        it("refuses a non-admin reassignment that changes it", async () => {
            const { service } = build(true, "fact-checker");
            vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(
                storedTask("reported") as any
            );
            await expect(service.create(assignBody())).rejects.toBeInstanceOf(
                ForbiddenException
            );
            expect(
                FakeReviewTaskModel.findByIdAndUpdate
            ).not.toHaveBeenCalled();
        });

        it("ignores a different methodology on saves that are not an assignment", async () => {
            const { service } = build(true, "admin");
            vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(
                storedTask({ assigned: "draft" }) as any
            );
            await service.create(
                createBody({
                    classificationMethodology: "rncd-debate",
                    machine: {
                        value: "reported",
                        context: {
                            reviewData: { classification: "exaggerated" },
                        },
                    },
                }) as any
            );
            const set = savedSet();
            expect(set).not.toHaveProperty("classificationMethodology");
            expect(set.machine.context.reviewData.classification).toBe(
                "exaggerated"
            );
        });

        it("refuses a non-default methodology on reassignment while the flag is off", async () => {
            const { service } = build(false, "admin");
            vi.spyOn(service, "getReviewTaskByDataHash").mockResolvedValue(
                storedTask("reported") as any
            );
            await expect(service.create(assignBody())).rejects.toBeInstanceOf(
                BadRequestException
            );
        });
    });
});
