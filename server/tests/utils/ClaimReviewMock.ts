const ObjectId = require("mongodb").ObjectID;

export const ReviewMock = (claimId, personalitiesId, reportId, userId) => ({
    isPartialReview: false,
    isHidden: false,
    isDeleted: false,
    deletedAt: null,
    personality: ObjectId(personalitiesId[0]),
    claim: ObjectId(claimId),
    usersId: [ObjectId(userId)],
    report: ObjectId(reportId),
    date: "2024-04-18T17:32:36.769+00:00",
    isPublished: true,
});
