const ObjectId = require("mongodb").ObjectID;

export const ClaimMock = (personalitiesId, claimRevisionId) => ({
    nameSpace: "main",
    isHidden: false,
    personalities: [ObjectId(personalitiesId[0])],
    isDeleted: false,
    deletedAt: null,
    latestRevision: ObjectId(claimRevisionId),
    slug: "test",
});
