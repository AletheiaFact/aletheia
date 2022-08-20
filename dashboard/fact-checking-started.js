/* eslint-disable no-undef */

//Querying how long it took from start to finish considering
//the day the fact-checking started
db.getCollection("stateevents").aggregate([
    { $match: { taskId: ObjectId("62e99af928bdbf2c8f1de4cc") } },
    { $sort: { date: 1 } },
    {
        $group: {
            _id: "Dates",
            lastUpdate: { $last: "$date" },
            firstUpdate: { $first: "$date" },
        },
    },
    {
        $project: {
            seconds: {
                $dateDiff: {
                    startDate: "$firstUpdate",
                    endDate: "$lastUpdate",
                    unit: "second",
                },
            },
        },
    },
]);
