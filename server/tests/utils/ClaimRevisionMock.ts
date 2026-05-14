const { ObjectId } = require("mongodb");

export const ClaimRevisionMock = (
    claimRevisionId: string,
    personalitiesId: string[],
    claimId: string,
    speecheId: string
) => ({
    _id: claimRevisionId,
    personalities: [new ObjectId(personalitiesId[0])],
    contentModel: "Speech",
    title: "Mock Tittle",
    date: "2024-04-18T16:31:16.372+00:00",
    claimId: new ObjectId(claimId),
    slug: "test",
    contentId: new ObjectId(speecheId),
});
