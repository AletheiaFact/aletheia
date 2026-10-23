import { ReviewTaskTypeEnum } from "../types/enums";

/**
 * Aggregation pipelines behind the review-task listing (Kanban) and its
 * counts. Pure builders: ReviewTaskService resolves the user-scoped `match`
 * (getQueryObject) and runs them.
 */

function buildTargetLookupPipeline(reviewTaskType: ReviewTaskTypeEnum) {
    const pipeline: any[] = [
        {
            $match: {
                $expr: {
                    $and: [
                        { $ne: ["$$targetId", null] },
                        { $eq: ["$_id", "$$targetId"] },
                    ],
                },
            },
        },
    ];

    if (reviewTaskType === ReviewTaskTypeEnum.Claim) {
        pipeline.push(
            {
                $lookup: {
                    from: "claimrevisions",
                    localField: "latestRevision",
                    foreignField: "_id",
                    as: "latestRevision",
                },
            },
            { $unwind: "$latestRevision" }
        );
    }

    return pipeline;
}

function addNotDeletedMatch(
    pipeline: any[],
    value: string,
    reviewTaskType: ReviewTaskTypeEnum
): number {
    if (
        value === "published" &&
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest
    ) {
        return pipeline.push(
            {
                $lookup: {
                    from: "claimreviews",
                    localField: "data_hash",
                    foreignField: "data_hash",
                    as: "machine.context.claimReview.claimReview",
                },
            },
            { $unwind: "$machine.context.claimReview.claimReview" },
            {
                $match: {
                    "machine.context.claimReview.claimReview.isDeleted": false,
                    $or: [
                        { "target.isDeleted": false },
                        { "target.isDeleted": { $exists: false } },
                    ],
                },
            }
        );
    }

    return pipeline.push({
        $match: {
            $or: [
                { "target.isDeleted": false },
                { "target.isDeleted": { $exists: false } },
            ],
        },
    });
}

/** Listing pipeline: match, then join assignees, personality and target. */
export function buildListPipeline(
    match: Record<string, any>,
    value: string,
    nameSpace: string,
    reviewTaskType: ReviewTaskTypeEnum
): any[] {
    const pipeline: any[] = [];

    pipeline.push(
        { $match: { ...match, reviewTaskType, nameSpace } },
        {
            $lookup: {
                from: "users",
                let: { usersId: "$machine.context.reviewData.usersId" },
                pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$usersId"] } } },
                    { $project: { name: 1 } },
                ],
                as: "machine.context.reviewData.usersId",
            },
        },
        {
            $lookup: {
                from: "personalities",
                let: {
                    personalityId: {
                        $let: {
                            vars: {
                                personalityValue:
                                    "$machine.context.review.personality",
                            },
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $ne: [
                                                    "$$personalityValue",
                                                    null,
                                                ],
                                            },
                                            {
                                                $ne: ["$$personalityValue", ""],
                                            },
                                        ],
                                    },
                                    { $toObjectId: "$$personalityValue" },
                                    null,
                                ],
                            },
                        },
                    },
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ["$$personalityId", null] },
                                    { $eq: ["$_id", "$$personalityId"] },
                                ],
                            },
                        },
                    },
                    { $project: { slug: 1, name: 1, _id: 1 } },
                ],
                as: "machine.context.review.personality",
            },
        },
        {
            $unwind: {
                path: "$machine.context.review.personality",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: `${reviewTaskType.toLowerCase()}s`,
                let: {
                    targetId: {
                        $let: {
                            vars: { targetValue: "$target" },
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: ["$$targetValue", null] },
                                            { $ne: ["$$targetValue", ""] },
                                        ],
                                    },
                                    { $toObjectId: "$$targetValue" },
                                    null,
                                ],
                            },
                        },
                    },
                },
                pipeline: buildTargetLookupPipeline(reviewTaskType),
                as: "target",
            },
        },
        { $unwind: { path: "$target", preserveNullAndEmptyArrays: true } }
    );

    addNotDeletedMatch(pipeline, value, reviewTaskType);

    return pipeline;
}

/** Counts tasks whose target and claim review are not soft-deleted. */
export function buildNotDeletedCountPipeline(
    match: Record<string, any>,
    nameSpace: string,
    reviewTaskType: ReviewTaskTypeEnum
): any[] {
    return [
        { $match: { ...match, nameSpace, reviewTaskType } },
        {
            $lookup: {
                from: "claimreviews",
                localField: "data_hash",
                foreignField: "data_hash",
                as: "machine.context.review.claimReview",
            },
        },
        {
            $lookup: {
                from:
                    reviewTaskType === ReviewTaskTypeEnum.Claim
                        ? "claims"
                        : "sources",
                let: { targetId: { $toObjectId: "$target" } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$targetId"] },
                        },
                    },
                    { $project: { isDeleted: 1 } },
                ],
                as: "target",
            },
        },
        {
            $match: {
                "machine.context.review.claimReview.isDeleted": {
                    $ne: true,
                },
                $or: [
                    { "target.isDeleted": false },
                    { "target.isDeleted": { $exists: false } },
                ],
            },
        },
        { $count: "count" },
    ];
}
