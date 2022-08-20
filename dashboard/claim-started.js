/* eslint-disable no-undef */

//Querying how long it took from start to finish considering
//the day the claim was registered
db.getCollection("stateevents").aggregate([
    {
        $facet: {
            claim: [
                {
                    $match: {
                        claimId: ObjectId("62e9882c042df35d1de30aa9"),
                        taskId: null,
                    },
                },
                { $project: { date: 1 } },
            ],
            tasks: [
                {
                    $match: {
                        claimId: ObjectId("62e9882c042df35d1de30aa9"),
                        taskId: ObjectId("62e99af928bdbf2c8f1de4cc"),
                    },
                },
                { $project: { date: 1 } },
                { $sort: { date: -1 } },
                { $limit: 1 },
            ],
        },
    },
    {
        $project: {
            seconds: {
                $dateDiff: {
                    startDate: { $arrayElemAt: ["$claim.date", 0] },
                    endDate: { $arrayElemAt: ["$tasks.date", 0] },
                    unit: "second",
                },
            },
        },
    },
]);
