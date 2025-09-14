const { ObjectId } = require("mongodb");

export const SpeechMock = (paragraphId) => ({
    content: [new ObjectId(paragraphId)],
    type: "speech",
    personality: null,
});
