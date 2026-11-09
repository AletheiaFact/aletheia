import { Types } from "mongoose";
import { targetIdFilter } from "./target-id-filter";

describe("targetIdFilter", () => {
    it("matches the id as an ObjectId and as a string", () => {
        const id = new Types.ObjectId();
        expect(targetIdFilter(id)).toEqual({ $in: [id, id.toString()] });
        expect(targetIdFilter(id.toString())).toEqual({
            $in: [id, id.toString()],
        });
    });
});
