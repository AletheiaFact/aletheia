import { MongoClient } from "mongodb";
import { ClaimRevisionMock } from "./ClaimRevisionMock";

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
            .db("Aletheia")
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
