const ObjectId = require("mongodb").ObjectID;

export const ClaimRevisionMock = (
    claimRevisionId,
    personalitiesId,
    claimId,
    speecheId
) => ({
    _id: claimRevisionId,
    personalities: [ObjectId(personalitiesId[0])],
    contentModel: "Speech",
    tittle: "Mock Tittle",
    date: "2024-04-18T16:31:16.372+00:00",
    claimId: ObjectId(claimId),
    slug: "test",
    contentId: ObjectId(speecheId),
});
