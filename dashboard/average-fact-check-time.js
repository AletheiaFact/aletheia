/* eslint-disable no-undef */

//Querying average fact-checking time
db.getCollection("stateevents").aggregate([
    { $match: { taskId: ObjectId("62e99af928bdbf2c8f1de4cc") } },
    { $sort: { date: 1 } },
    {
        $group: {
            _id: "Dates",
            count: { $sum: 1 },
            lastUpdate: { $last: "$date" },
            firstUpdate: { $first: "$date" },
        },
    },
    {
        $project: {
            average: {
                $let: {
                    vars: {
                        dateDiff: {
                            $dateDiff: {
                                startDate: "$firstUpdate",
                                endDate: "$lastUpdate",
                                unit: "second",
                            },
                        },
                    },
                    in: { $divide: ["$$dateDiff", "$count"] },
                },
            },
        },
    },
]);
