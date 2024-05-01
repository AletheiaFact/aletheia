const ObjectId = require("mongodb").ObjectID;

export const ReportMock = (userId) => ({
    sources: ["https://https://www.lipsum.com/"],
    questions: ["Lorem Ipsum is simply dummy"],
    usersId: [ObjectId(userId)],
    summary:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    report: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    verification:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    classification: "misleading",
    data_hash: "4be75d25957a3cc0dbc6975a6939a385",
});
