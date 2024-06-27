import { TargetModel } from "../history/schema/history.schema";

export default function lookupClaimRevisions(target) {
    if (target === TargetModel.ReviewTask) {
        return {
            $lookup: {
                from: "claimrevisions",
                localField: "latestRevision",
                foreignField: "_id",
                as: "latestRevision",
            },
        };
    } else if (target === TargetModel.ClaimReview) {
        return {
            $lookup: {
                from: "claimrevisions",
                localField: "claim.latestRevision",
                foreignField: "_id",
                as: "claim.latestRevision",
            },
        };
    }
}
