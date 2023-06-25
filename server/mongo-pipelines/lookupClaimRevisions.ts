export default function () {
    return {
        $lookup: {
            from: "claimrevisions",
            localField: "latestRevision",
            foreignField: "_id",
            as: "latestRevision",
        },
    };
}
