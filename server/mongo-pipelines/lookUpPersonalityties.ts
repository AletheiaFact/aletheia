export default function () {
    return {
        $lookup: {
            from: "personalities",
            let: {
                personalityId: {
                    $toObjectId: "$machine.context.claimReview.personality",
                },
            },
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$personalityId"] } } },
                { $project: { slug: 1, name: 1, _id: 1 } },
            ],
            as: "machine.context.claimReview.personality",
        },
    };
}
