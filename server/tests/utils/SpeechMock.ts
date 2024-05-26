const ObjectId = require("mongodb").ObjectID;

export const SpeechMock = (paragraphId) => ({
    content: [ObjectId(paragraphId)],
    type: "speech",
    personality: null,
});
