const { ObjectId } = require("mongodb");

export const SpeechMock = (paragraphId: string) => ({
    content: [new ObjectId(paragraphId)],
    type: "speech",
    personality: null as string | null,
});
