import { MongoClient } from "mongodb";
import { ReviewMock } from "./ClaimReviewMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestClaimReview = async (
    uri: string,
    claimId: string,
    personalitiesId: string[],
    reportId: string,
    userId: string
) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db(getTestDbName(uri))
            .collection("claimreviews")
            .insertOne(ReviewMock(claimId, personalitiesId, reportId, userId));
    } finally {
        await client.close();
    }
};
