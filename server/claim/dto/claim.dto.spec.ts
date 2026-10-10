import {
    ClaimCreatePageQuerySchema,
    ClaimIdParam,
    CreateClaimSchema,
    CreateDebateClaimSchema,
    CreateImageClaimSchema,
    CreateUnattributedClaimSchema,
    GetClaimQuerySchema,
    ListClaimsQuerySchema,
    SentenceTopicsSchema,
    UpdateClaimSchema,
    UpdateDebateSchema,
    UpdateHiddenStatusSchema,
} from "./claim.dto";

const objectId = "64b7f0c2e1a2b3c4d5e6f701";
const base = {
    title: "A claim",
    date: "2024-01-01T00:00:00.000Z",
    contentModel: "Speech",
    sources: ["https://a.test"],
    recaptcha: "tok",
    nameSpace: "main",
};

describe("claim DTO schemas", () => {
    describe("CreateClaimSchema", () => {
        it("accepts the create-claim machine payload", () => {
            const r = CreateClaimSchema.safeParse({
                ...base,
                content: "Some speech",
                personalities: [objectId],
                group: objectId,
            });
            expect(r.success).toBe(true);
        });

        it("accepts a plain ISO date and an empty nameSpace, as the class DTO did", () => {
            expect(
                CreateClaimSchema.safeParse({
                    ...base,
                    date: "2024-01-01",
                    nameSpace: "",
                    content: "x",
                }).success
            ).toBe(true);
        });

        it("rejects an empty content, an empty sources list, an unknown contentModel and unknown keys", () => {
            expect(
                CreateClaimSchema.safeParse({ ...base, content: "" }).success
            ).toBe(false);
            expect(
                CreateClaimSchema.safeParse({
                    ...base,
                    content: "x",
                    sources: [],
                }).success
            ).toBe(false);
            expect(
                CreateClaimSchema.safeParse({
                    ...base,
                    content: "x",
                    contentModel: "Video",
                }).success
            ).toBe(false);
            expect(
                CreateClaimSchema.safeParse({ ...base, content: "x", extra: 1 })
                    .success
            ).toBe(false);
        });

        it("rejects an empty personalities array (ArrayNotEmpty) but accepts it absent", () => {
            expect(
                CreateClaimSchema.safeParse({
                    ...base,
                    content: "x",
                    personalities: [],
                }).success
            ).toBe(false);
            expect(
                CreateClaimSchema.safeParse({ ...base, content: "x" }).success
            ).toBe(true);
        });
    });

    it("UpdateClaimSchema makes every field optional and stays strict", () => {
        expect(UpdateClaimSchema.safeParse({ title: "t" }).success).toBe(true);
        expect(UpdateClaimSchema.safeParse({ nope: "t" }).success).toBe(false);
    });

    it("CreateDebateClaimSchema needs two personalities and takes no content", () => {
        expect(
            CreateDebateClaimSchema.safeParse({
                ...base,
                contentModel: "Debate",
                personalities: [objectId, objectId],
            }).success
        ).toBe(true);
        expect(
            CreateDebateClaimSchema.safeParse({
                ...base,
                contentModel: "Debate",
                personalities: [objectId],
            }).success
        ).toBe(false);
        expect(
            CreateDebateClaimSchema.safeParse({
                ...base,
                contentModel: "Debate",
                personalities: [objectId, objectId],
                content: "x",
            }).success
        ).toBe(false);
    });

    it("CreateImageClaimSchema takes the upload result as content and allows no personalities", () => {
        expect(
            CreateImageClaimSchema.safeParse({
                ...base,
                contentModel: "Image",
                content: {
                    DataHash: "a".repeat(32),
                    FileURL: "https://s3/x.png",
                    Key: "x.png",
                    Extension: "png",
                },
                personalities: [],
            }).success
        ).toBe(true);
        expect(
            CreateImageClaimSchema.safeParse({
                ...base,
                contentModel: "Image",
                content: "not an object",
            }).success
        ).toBe(false);
    });

    it("CreateUnattributedClaimSchema allows an empty personalities array", () => {
        expect(
            CreateUnattributedClaimSchema.safeParse({
                ...base,
                contentModel: "Unattributed",
                content: "text",
                personalities: [],
            }).success
        ).toBe(true);
        expect(
            CreateUnattributedClaimSchema.safeParse({
                ...base,
                contentModel: "Unattributed",
                content: null,
            }).success
        ).toBe(false);
    });

    it("UpdateDebateSchema requires all three fields, as the class DTO did", () => {
        expect(
            UpdateDebateSchema.safeParse({
                content: "",
                personality: "",
                isLive: true,
            }).success
        ).toBe(true);
        expect(UpdateDebateSchema.safeParse({ isLive: true }).success).toBe(
            false
        );
    });

    it("UpdateHiddenStatusSchema accepts false and rejects a missing recaptcha", () => {
        expect(
            UpdateHiddenStatusSchema.safeParse({
                isHidden: false,
                recaptcha: "tok",
                description: "why",
            }).success
        ).toBe(true);
        expect(
            UpdateHiddenStatusSchema.safeParse({ isHidden: true }).success
        ).toBe(false);
    });

    describe("ListClaimsQuerySchema", () => {
        it("coerces the page params and the legacy isHidden flag", () => {
            const r = ListClaimsQuerySchema.safeParse({
                page: "1",
                pageSize: "5",
                order: "asc",
                language: "pt",
                personality: objectId,
                isHidden: "false",
                nameSpace: "main",
            });
            expect(r.success).toBe(true);
            expect(r.data).toMatchObject({
                page: 1,
                pageSize: 5,
                isHidden: false,
            });
        });

        it("defaults isHidden to false when absent and coerces 'true'", () => {
            const absent = ListClaimsQuerySchema.safeParse({
                page: "0",
                pageSize: "5",
                order: "asc",
                language: "pt",
            });
            expect(absent.data?.isHidden).toBe(false);
            const on = ListClaimsQuerySchema.safeParse({
                page: "0",
                pageSize: "5",
                order: "asc",
                language: "pt",
                isHidden: "true",
            });
            expect(on.data?.isHidden).toBe(true);
        });

        it("rejects a negative page, a non-alpha language, and unknown keys", () => {
            expect(
                ListClaimsQuerySchema.safeParse({
                    page: "-1",
                    pageSize: "5",
                    order: "asc",
                    language: "pt",
                }).success
            ).toBe(false);
            expect(
                ListClaimsQuerySchema.safeParse({
                    page: "0",
                    pageSize: "5",
                    order: "asc",
                    language: "pt-BR",
                }).success
            ).toBe(false);
            expect(
                ListClaimsQuerySchema.safeParse({
                    page: "0",
                    pageSize: "5",
                    order: "asc",
                    language: "pt",
                    _: "123",
                }).success
            ).toBe(false);
        });
    });

    it("GetClaimQuerySchema and ClaimCreatePageQuerySchema strip unknown keys", () => {
        expect(
            GetClaimQuerySchema.safeParse({ nameSpace: "main", _: "1" })
        ).toMatchObject({ success: true, data: { nameSpace: "main" } });
        expect(
            ClaimCreatePageQuerySchema.safeParse({
                personality: "slug",
                verificationRequest: objectId,
                other: "x",
            })
        ).toMatchObject({
            success: true,
            data: { personality: "slug", verificationRequest: objectId },
        });
    });

    it("ClaimIdParam accepts an ObjectId or a uuid and rejects anything else", () => {
        expect(ClaimIdParam.safeParse(objectId).success).toBe(true);
        expect(
            ClaimIdParam.safeParse("3f2504e0-4f89-41d3-9a0c-0305e82c3301")
                .success
        ).toBe(true);
        expect(ClaimIdParam.safeParse("nope").success).toBe(false);
    });

    it("SentenceTopicsSchema accepts slug strings and topic refs, rejects a non-array", () => {
        expect(
            SentenceTopicsSchema.safeParse([
                "saude",
                { id: objectId, label: "Saúde", value: "Q1" },
            ]).success
        ).toBe(true);
        expect(SentenceTopicsSchema.safeParse({ a: 1 }).success).toBe(false);
    });
});
