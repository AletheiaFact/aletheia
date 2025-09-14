const { ObjectId } = require("mongodb");

export const ClaimMock = (personalitiesId, claimRevisionId) => ({
    nameSpace: "main",
    isHidden: false,
    personalities: [new ObjectId(personalitiesId[0])],
    isDeleted: false,
    deletedAt: null,
    latestRevision: new ObjectId(claimRevisionId),
    slug: "test",
});
