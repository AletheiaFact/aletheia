import { TargetModel } from "../history/schema/history.schema";

export default function lookupClaims(target, params: any = {}) {
    if (target === TargetModel.ReviewTask) {
        const { pipeline, as } = params;
        return {
            $lookup: {
                from: "claims",
                let: {
                    claimId: {
                        $toObjectId: "$machine.context.claimReview.claim",
                    },
                },
                pipeline,
                as,
            },
        };
    } else if (target === TargetModel.ClaimReview) {
        return {
            $lookup: {
                from: "claims",
                localField: "claim",
                foreignField: "_id",
                as: "claim",
            },
        };
    }
}
