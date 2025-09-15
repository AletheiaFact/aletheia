const { ObjectId } = require("mongodb");

export const ParagraphMock = (sentenceId) => ({
    content: [new ObjectId(sentenceId)],
    type: "paragraph",
    data_hash: "cc07fdd8165c15ef17b183a69e393318",
    props: { id: 1 },
});
