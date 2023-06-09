export default function () {
    return {
        $lookup: {
            from: "users",
            let: { usersId: "$machine.context.reviewData.usersId" },
            pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$usersId"] } } },
                { $project: { name: 1 } },
            ],
            as: "machine.context.reviewData.users",
        },
    };
}
