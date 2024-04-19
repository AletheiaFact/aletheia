const ObjectId = require("mongodb").ObjectID;

export const ParagraphMock = (sentenceId) => ({
    content: [ObjectId(sentenceId)],
    type: "paragraph",
    props: { id: 1 },
});
