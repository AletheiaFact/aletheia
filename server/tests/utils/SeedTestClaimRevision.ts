import { MongoClient } from "mongodb";
import { ClaimRevisionMock } from "./ClaimRevisionMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestClaimRevision = async (
    uri,
    claimRevisionId,
    personalitiesId,
    claimId,
    speecheId
) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db(getTestDbName(uri))
            .collection("claimrevisions")
            .insertOne(
                ClaimRevisionMock(
                    claimRevisionId,
                    personalitiesId,
                    claimId,
                    speecheId
                )
            );
    } finally {
        await client.close();
    }
};
