export default function ({ pipeline, as }) {
    return {
        $lookup: {
            from: "claims",
            let: {
                claimId: { $toObjectId: "$machine.context.claimReview.claim" },
            },
            pipeline,
            as,
        },
    };
}
