import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

const { ObjectId } = require("mongodb");

export const ReviewMock = (claimId, personalitiesId, reportId, userId) => ({
    isPartialReview: false,
    isHidden: false,
    isDeleted: false,
    deletedAt: null,
    personality: new ObjectId(personalitiesId[0]),
    target: new ObjectId(claimId),
    targetModel: "Claim",
    usersId: [new ObjectId(userId)],
    report: new ObjectId(reportId),
    data_hash: "4be75d25957a3cc0dbc6975a6939a385",
    date: "2024-04-18T17:32:36.769+00:00",
    isPublished: true,
    nameSpace: NameSpaceEnum.Main,
});
