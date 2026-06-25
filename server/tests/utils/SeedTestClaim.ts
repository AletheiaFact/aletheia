import { MongoClient } from "mongodb";
import { ClaimMock } from "./ClaimMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestClaim = async (
    uri: string,
    personalitiesId: string[],
    claimRevisionId: string
) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db(getTestDbName(uri))
            .collection("claims")
            .insertOne(ClaimMock(personalitiesId, claimRevisionId));
    } finally {
        await client.close();
    }
};
