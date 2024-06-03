import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

const ObjectId = require("mongodb").ObjectID;

export const ReviewMock = (claimId, personalitiesId, reportId, userId) => ({
    isPartialReview: false,
    isHidden: false,
    isDeleted: false,
    deletedAt: null,
    personality: ObjectId(personalitiesId[0]),
    claim: ObjectId(claimId),
    usersId: [ObjectId(userId)],
    report: ObjectId(reportId),
    data_hash: "4be75d25957a3cc0dbc6975a6939a385",
    date: "2024-04-18T17:32:36.769+00:00",
    isPublished: true,
    nameSpace: NameSpaceEnum.Main,
});
