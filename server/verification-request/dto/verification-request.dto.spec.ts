import {
    CreateVerificationRequestSchema,
    ListVerificationRequestsQuerySchema,
    RemoveFromGroupSchema,
    SearchVerificationRequestsQuerySchema,
    UpdateVerificationRequestSchema,
    VerificationRequestIdParam,
    VerificationRequestTopicsSchema,
} from "./verification-request.dto";

const objectId = "64b7f0c2e1a2b3c4d5e6f701";
const uuid = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";

describe("verification-request DTO schemas", () => {
    describe("CreateVerificationRequestSchema", () => {
        it("accepts the public form payload", () => {
            const result = CreateVerificationRequestSchema.safeParse({
                nameSpace: "main",
                content: "Claim",
                reportType: "Speech",
                impactArea: { label: "Saúde", value: "health" },
                sourceChannel: "Web",
                source: [{ href: "https://a.test" }],
                publicationDate: "2024-01-01",
                email: "a@b.c",
                date: "2024-01-01T00:00:00.000Z",
                heardFrom: "tv",
                recaptcha: "tok",
            });
            expect(result.success).toBe(true);
            expect(result.data.date).toBeInstanceOf(Date);
        });

        it("rejects a missing content, an invalid date, a non-numeric embedding and unknown keys", () => {
            const base = { content: "c", sourceChannel: "Web" };
            expect(
                CreateVerificationRequestSchema.safeParse({
                    sourceChannel: "Web",
                }).success
            ).toBe(false);
            expect(
                CreateVerificationRequestSchema.safeParse({
                    ...base,
                    date: "nope",
                }).success
            ).toBe(false);
            expect(
                CreateVerificationRequestSchema.safeParse({
                    ...base,
                    embedding: ["x"],
                }).success
            ).toBe(false);
            expect(
                CreateVerificationRequestSchema.safeParse({ ...base, extra: 1 })
                    .success
            ).toBe(false);
            expect(
                CreateVerificationRequestSchema.safeParse({
                    ...base,
                    reportType: "Nope",
                }).success
            ).toBe(false);
        });
    });

    describe("UpdateVerificationRequestSchema", () => {
        it("accepts the admin drawer payloads", () => {
            expect(
                UpdateVerificationRequestSchema.safeParse({
                    publicationDate: "2024-01-01",
                    source: [{ href: "https://a.test" }],
                }).success
            ).toBe(true);
            expect(
                UpdateVerificationRequestSchema.safeParse({
                    status: "Posted",
                    group: [{ _id: objectId, content: "x" }, uuid],
                }).success
            ).toBe(true);
            expect(
                UpdateVerificationRequestSchema.safeParse({ group: null })
                    .success
            ).toBe(true);
        });

        it("maps the legacy rejected flag and rejects a bad status or non-array group", () => {
            expect(
                UpdateVerificationRequestSchema.parse({ rejected: "enabled" })
                    .rejected
            ).toBe(true);
            expect(UpdateVerificationRequestSchema.parse({}).rejected).toBe(
                false
            );
            expect(
                UpdateVerificationRequestSchema.safeParse({ status: "Nope" })
                    .success
            ).toBe(false);
            expect(
                UpdateVerificationRequestSchema.safeParse({ group: "x" })
                    .success
            ).toBe(false);
            expect(
                UpdateVerificationRequestSchema.safeParse({
                    isSensitive: "yes",
                }).success
            ).toBe(false);
        });
    });

    describe("ListVerificationRequestsQuerySchema", () => {
        it("coerces paging, wraps single filter values into arrays and keeps sourceChannel a string", () => {
            const parsed = ListVerificationRequestsQuerySchema.parse({
                page: "2",
                pageSize: "20",
                status: "Pre Triage",
                topics: ["a", "b"],
                sourceChannel: "all",
                cacheBuster: "1",
            });
            expect(parsed).toEqual({
                page: 2,
                pageSize: 20,
                order: "desc",
                contentFilters: [],
                topics: ["a", "b"],
                status: ["Pre Triage"],
                sourceChannel: "all",
            });
        });

        it("rejects an out-of-range pageSize and an unknown order", () => {
            expect(
                ListVerificationRequestsQuerySchema.safeParse({ pageSize: "0" })
                    .success
            ).toBe(false);
            expect(
                ListVerificationRequestsQuerySchema.safeParse({
                    pageSize: "101",
                }).success
            ).toBe(false);
            expect(
                ListVerificationRequestsQuerySchema.safeParse({ order: "up" })
                    .success
            ).toBe(false);
        });
    });

    describe("SearchVerificationRequestsQuerySchema", () => {
        it("coerces pageSize and rejects a non-integer", () => {
            expect(
                SearchVerificationRequestsQuerySchema.parse({ pageSize: "5" })
                    .pageSize
            ).toBe(5);
            expect(
                SearchVerificationRequestsQuerySchema.safeParse({
                    pageSize: "x",
                }).success
            ).toBe(false);
        });
    });

    describe("params and small bodies", () => {
        it("ids accept an ObjectId or a uuid only", () => {
            expect(VerificationRequestIdParam.safeParse(objectId).success).toBe(
                true
            );
            expect(VerificationRequestIdParam.safeParse(uuid).success).toBe(
                true
            );
            expect(VerificationRequestIdParam.safeParse("abc").success).toBe(
                false
            );
            expect(
                RemoveFromGroupSchema.safeParse({ group: uuid }).success
            ).toBe(true);
            expect(
                RemoveFromGroupSchema.safeParse({ group: "abc" }).success
            ).toBe(false);
            expect(
                RemoveFromGroupSchema.safeParse({ group: uuid, extra: 1 })
                    .success
            ).toBe(false);
        });

        it("topics accept picks, persisted topics and strings, and reject a non-array", () => {
            expect(
                VerificationRequestTopicsSchema.safeParse([
                    { label: "Saúde", value: "Q1" },
                    { _id: objectId, name: "x", wikidataId: "Q2" },
                    "bare",
                ]).success
            ).toBe(true);
            expect(
                VerificationRequestTopicsSchema.safeParse({ value: "Q1" })
                    .success
            ).toBe(false);
            expect(
                VerificationRequestTopicsSchema.safeParse([{ value: 1 }])
                    .success
            ).toBe(false);
        });
    });
});
