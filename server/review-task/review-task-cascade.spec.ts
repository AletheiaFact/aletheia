import { Types } from "mongoose";
import { ReviewTaskService } from "./review-task.service";
import { ReviewTaskSchema } from "./schemas/review-task.schema";

// cascadeUpdateDataHash is how the admin claim editor moves an in-progress
// review task to an edited sentence's new hash. A filter on a field the
// schema does not store matches nothing, which silently detaches the task.
describe("ReviewTaskService.cascadeUpdateDataHash", () => {
    it("filters only on fields stored by the ReviewTask schema", async () => {
        const updateMany = vi.fn().mockResolvedValue({ modifiedCount: 1 });
        const service = Object.create(ReviewTaskService.prototype);
        service.ReviewTaskModel = { updateMany };
        const claimId = new Types.ObjectId();
        const session: any = { id: "session" };

        const count = await service.cascadeUpdateDataHash(
            "old",
            "new",
            claimId,
            session
        );

        expect(count).toBe(1);
        const [filter, update, options] = updateMany.mock.calls[0];
        // `target` is Mixed: drafts store it as a string, so both forms
        // must match.
        expect(filter).toEqual({
            data_hash: "old",
            target: { $in: [claimId, claimId.toString()] },
            reviewTaskType: "Claim",
        });
        for (const key of Object.keys(filter)) {
            expect(ReviewTaskSchema.path(key), key).toBeDefined();
        }
        expect(update).toEqual({ $set: { data_hash: "new" } });
        expect(options).toEqual({ session });
    });
});
