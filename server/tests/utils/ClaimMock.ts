const { ObjectId } = require("mongodb");

export const ClaimMock = (
    personalitiesId: string[],
    claimRevisionId: string
) => ({
    nameSpace: "main",
    isHidden: false,
    personalities: [new ObjectId(personalitiesId[0])],
    isDeleted: false,
    deletedAt: null as Date | null,
    latestRevision: new ObjectId(claimRevisionId),
    slug: "test",
});
