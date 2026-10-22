import {
    CreateOrganizationSchema,
    SearchOrganizationsQuerySchema,
    UpdateOrganizationSchema,
} from "./organization.dto";

const uploadedLogo = {
    FileURL: "https://bucket.s3.amazonaws.com/logo-2026.png",
    Key: "logo-2026.png",
    Extension: "png",
    DataHash: "0123456789abcdef0123456789abcdef",
};

const validOrganization = {
    name: "Agência Exemplo",
    website: "https://example.org",
    logo: uploadedLogo,
};

describe("organization DTO schemas", () => {
    describe("CreateOrganizationSchema", () => {
        it("accepts a fresh upload result as logo", () => {
            expect(
                CreateOrganizationSchema.safeParse(validOrganization).success
            ).toBe(true);
        });

        it("accepts an existing Image document as logo", () => {
            const parsed = CreateOrganizationSchema.parse({
                name: "Org",
                logo: {
                    _id: "507f1f77bcf86cd799439011",
                    content: "https://bucket/logo.png",
                },
            });
            expect(parsed.logo).toHaveProperty("_id");
        });

        it("rejects a missing logo and an incomplete upload result", () => {
            expect(
                CreateOrganizationSchema.safeParse({ name: "Org" }).success
            ).toBe(false);
            expect(
                CreateOrganizationSchema.safeParse({
                    ...validOrganization,
                    logo: { FileURL: uploadedLogo.FileURL },
                }).success
            ).toBe(false);
        });

        it("rejects non-http(s) websites", () => {
            expect(
                CreateOrganizationSchema.safeParse({
                    ...validOrganization,
                    website: "javascript:alert(1)",
                }).success
            ).toBe(false);
        });

        it("rejects names without letters or digits and oversized names", () => {
            expect(
                CreateOrganizationSchema.safeParse({
                    ...validOrganization,
                    name: "!!!",
                }).success
            ).toBe(false);
            expect(
                CreateOrganizationSchema.safeParse({
                    ...validOrganization,
                    name: "a".repeat(121),
                }).success
            ).toBe(false);
        });

        it("rejects unknown keys", () => {
            expect(
                CreateOrganizationSchema.safeParse({
                    ...validOrganization,
                    slug: "custom",
                }).success
            ).toBe(false);
        });
    });

    describe("UpdateOrganizationSchema", () => {
        it("accepts a partial update and rejects a bad website", () => {
            expect(
                UpdateOrganizationSchema.safeParse({ name: "New name" }).success
            ).toBe(true);
            expect(
                UpdateOrganizationSchema.safeParse({ website: "not a url" })
                    .success
            ).toBe(false);
            expect(
                UpdateOrganizationSchema.safeParse({ website: "" }).success
            ).toBe(true);
        });
    });

    describe("SearchOrganizationsQuerySchema", () => {
        it("coerces limit and applies the default", () => {
            expect(
                SearchOrganizationsQuerySchema.parse({ name: " lupa " })
            ).toEqual({ name: "lupa", limit: 10 });
        });

        it("rejects a missing name and a limit above 20", () => {
            expect(SearchOrganizationsQuerySchema.safeParse({}).success).toBe(
                false
            );
            expect(
                SearchOrganizationsQuerySchema.safeParse({
                    name: "a",
                    limit: "21",
                }).success
            ).toBe(false);
        });
    });
});
