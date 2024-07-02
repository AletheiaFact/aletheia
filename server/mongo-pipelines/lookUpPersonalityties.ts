import { TargetModel } from "../history/schema/history.schema";

export default function lookupPersonalities(target) {
    if (target === TargetModel.ReviewTask) {
        return {
            $lookup: {
                from: "personalities",
                let: {
                    personalityId: {
                        $toObjectId: "$machine.context.review.personality",
                    },
                },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$personalityId"] } } },
                    { $project: { slug: 1, name: 1, _id: 1 } },
                ],
                as: "machine.context.review.personality",
            },
        };
    } else if (target === TargetModel.ClaimReview) {
        return {
            $lookup: {
                from: "personalities",
                localField: "personality",
                foreignField: "_id",
                as: "personality",
            },
        };
    }
}
