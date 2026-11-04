import { Types } from "mongoose";

// Matches a `target` reference stored either as an ObjectId or as its hex
// string. ReviewTask and ClaimReview declare `target` with
// `type: mongoose.Types.ObjectId`, which Mongoose turns into Mixed: values
// are stored as given and queries are not cast. ReviewTask drafts store a
// string, ClaimReview an ObjectId, so a filter on one form misses the other.
export function targetIdFilter(id: Types.ObjectId | string) {
    return { $in: [new Types.ObjectId(String(id)), String(id)] };
}
