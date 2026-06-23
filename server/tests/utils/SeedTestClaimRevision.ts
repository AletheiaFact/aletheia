import { MongoClient } from "mongodb";
import { ClaimRevisionMock } from "./ClaimRevisionMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestClaimRevision = async (
    uri: string,
    claimRevisionId: string,
    personalitiesId: string[],
    claimId: string,
    speecheId: string
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
                ) as any
            );
    } finally {
        await client.close();
    }
};
