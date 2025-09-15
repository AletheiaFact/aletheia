import { MongoClient } from "mongodb";
import { ReviewMock } from "./ClaimReviewMock";

export const SeedTestClaimReview = async (
    uri,
    claimId,
    personalitiesId,
    reportId,
    userId
) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("test")
            .collection("claimreviews")
            .insertOne(ReviewMock(claimId, personalitiesId, reportId, userId));
    } finally {
        await client.close();
    }
};
