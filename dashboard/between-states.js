/* eslint-disable no-undef */

//Querying how long it takes to move between specifics states
db.getCollection("stateevents").aggregate([
    {
        $facet: {
            assigned: [
                {
                    $match: {
                        taskId: ObjectId("62eaaaf819007c3f2bfe2a80"),
                        type: "assigned",
                    },
                },
                { $project: { date: 1, _id: 0 } },
                { $sort: { date: 1 } },
                { $limit: 1 },
            ],
            reported: [
                {
                    $match: {
                        taskId: ObjectId("62eaaaf819007c3f2bfe2a80"),
                        type: "reported",
                    },
                },
                { $project: { date: 1, _id: 0 } },
                { $sort: { date: 1 } },
                { $limit: 1 },
            ],
        },
    },
    {
        $project: {
            seconds: {
                $dateDiff: {
                    startDate: { $arrayElemAt: ["$assigned.date", 0] },
                    endDate: { $arrayElemAt: ["$reported.date", 0] },
                    unit: "second",
                },
            },
        },
    },
]);
