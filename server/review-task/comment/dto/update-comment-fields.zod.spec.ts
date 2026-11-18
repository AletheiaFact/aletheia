import { UpdateCommentFieldsSchema } from "./update-comment-fields.zod";

const userId = "64b7f0c2a1b2c3d4e5f60718";

describe("UpdateCommentFieldsSchema", () => {
    it("keeps editable fields and strips the rest of a full comment", () => {
        const result = UpdateCommentFieldsSchema.safeParse({
            _id: userId,
            comment: "note",
            text: "quoted text",
            from: 1,
            to: 5,
            resolved: true,
            type: "review",
            user: { _id: userId, name: "Reviewer" },
            replies: [],
            targetId: userId,
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual({
            comment: "note",
            text: "quoted text",
            from: 1,
            to: 5,
            resolved: true,
            type: "review",
            user: { _id: userId },
        });
    });

    it("accepts a user id string", () => {
        const result = UpdateCommentFieldsSchema.safeParse({ user: userId });
        expect(result.success).toBe(true);
    });

    it.each([
        ["text", { $gt: "" }],
        ["comment", { $ne: null }],
        ["resolved", { $exists: true }],
        ["from", { $where: "sleep(1000)" }],
        ["user", { _id: { $ne: null } }],
        ["type", "unknown"],
    ])("rejects a non-primitive or unknown value in %s", (field, value) => {
        const result = UpdateCommentFieldsSchema.safeParse({ [field]: value });
        expect(result.success).toBe(false);
    });
});
