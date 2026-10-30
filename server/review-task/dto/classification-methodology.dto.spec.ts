import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateReviewTaskDTO } from "./create-review-task.dto";
import { SaveDraftDTO } from "./save-draft.dto";

const createBody = {
    machine: { context: {}, value: "assigned" },
    data_hash: "a".repeat(32),
    reportModel: "Fact-checking",
    recaptcha: "token",
    nameSpace: "main",
    target: "507f1f77bcf86cd799439011",
    reviewTaskType: "Claim",
};

const failingProperties = async (cls: any, body: object) =>
    (
        await validate(plainToInstance(cls, body), {
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    ).map((error) => error.property);

describe("classificationMethodology on review-task DTOs", () => {
    it("is optional on create", async () => {
        expect(
            await failingProperties(CreateReviewTaskDTO, createBody)
        ).toEqual([]);
    });

    it("accepts a registered methodology on create", async () => {
        expect(
            await failingProperties(CreateReviewTaskDTO, {
                ...createBody,
                classificationMethodology: "rncd-debate",
            })
        ).toEqual([]);
    });

    it("rejects an unknown methodology on create (400)", async () => {
        expect(
            await failingProperties(CreateReviewTaskDTO, {
                ...createBody,
                classificationMethodology: "nope",
            })
        ).toEqual(["classificationMethodology"]);
    });

    it("accepts and validates it on save-draft", async () => {
        const draft = { machine: { context: {} } };
        expect(
            await failingProperties(SaveDraftDTO, {
                ...draft,
                classificationMethodology: "rncd-debate",
            })
        ).toEqual([]);
        expect(
            await failingProperties(SaveDraftDTO, {
                ...draft,
                classificationMethodology: "nope",
            })
        ).toEqual(["classificationMethodology"]);
    });
});
