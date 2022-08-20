/* eslint-disable no-undef */

//Querying all action taken in the fact-checking workflow
db.getCollection("stateevents").aggregate([
    { $match: { taskId: ObjectId("62eaaaf819007c3f2bfe2a80") } },
    { $sort: { date: 1 } },
    {
        $bucket: {
            groupBy: "$type",
            boundaries: ["assigned", "published", "reported"],
            default: "reported",
            output: {
                count: { $sum: 1 },
                action: {
                    $push: {
                        date: "$date",
                        draft: "$draft",
                    },
                },
            },
        },
    },
]);
