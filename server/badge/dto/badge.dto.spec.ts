import { CreateBadgeSchema, UpdateBadgeSchema } from "./badge.dto";

const user = {
    _id: "64b7f0c2e1a2b3c4d5e6f701",
    name: "Ana",
    role: { main: "admin" },
    badges: [{ _id: "64b7f0c2e1a2b3c4d5e6f702", name: "Old" }],
};

describe("badge DTO schemas", () => {
    describe("CreateBadgeSchema", () => {
        it("accepts the admin form payload with a new image and selected users", () => {
            const result = CreateBadgeSchema.safeParse({
                name: "Fact-checker",
                description: "Verified 10 claims",
                image: { DataHash: "abc", src: "https://x/y.png" },
                created_at: new Date().toISOString(),
                users: [user],
            });
            expect(result.success).toBe(true);
        });

        it("accepts an existing image reference and no users", () => {
            expect(
                CreateBadgeSchema.safeParse({
                    name: "x",
                    description: "y",
                    image: { _id: "64b7f0c2e1a2b3c4d5e6f703" },
                    created_at: "2026-01-01T00:00:00Z",
                }).success
            ).toBe(true);
        });

        it("rejects an empty name, a missing created_at, a non-object image and unknown keys", () => {
            const base = {
                name: "x",
                description: "y",
                image: {},
                created_at: "2026-01-01T00:00:00Z",
            };
            expect(
                CreateBadgeSchema.safeParse({ ...base, name: "" }).success
            ).toBe(false);
            expect(
                CreateBadgeSchema.safeParse({ ...base, created_at: undefined })
                    .success
            ).toBe(false);
            expect(
                CreateBadgeSchema.safeParse({ ...base, image: "img" }).success
            ).toBe(false);
            expect(
                CreateBadgeSchema.safeParse({ ...base, extra: 1 }).success
            ).toBe(false);
        });
    });

    describe("UpdateBadgeSchema", () => {
        it("accepts the admin form payload", () => {
            expect(
                UpdateBadgeSchema.safeParse({
                    _id: "64b7f0c2e1a2b3c4d5e6f704",
                    name: "Reviewer",
                    description: "Reviewed 5 claims",
                    image: { _id: "64b7f0c2e1a2b3c4d5e6f703" },
                    users: [user],
                }).success
            ).toBe(true);
        });

        it("rejects a missing _id, missing users and a user without _id or badges", () => {
            const base = {
                _id: "64b7f0c2e1a2b3c4d5e6f704",
                name: "x",
                description: "y",
                image: {},
                users: [],
            };
            expect(
                UpdateBadgeSchema.safeParse({ ...base, _id: undefined }).success
            ).toBe(false);
            expect(
                UpdateBadgeSchema.safeParse({ ...base, users: undefined })
                    .success
            ).toBe(false);
            expect(
                UpdateBadgeSchema.safeParse({
                    ...base,
                    users: [{ name: "Ana", badges: [] }],
                }).success
            ).toBe(false);
            expect(
                UpdateBadgeSchema.safeParse({
                    ...base,
                    users: [{ _id: "u1", role: {} }],
                }).success
            ).toBe(false);
        });
    });
});
