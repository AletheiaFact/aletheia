import { MongoClient } from "mongodb";
import { ClaimMock } from "./ClaimMock";

export const SeedTestClaim = async (uri, personalitiesId, claimRevisionId) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("test")
            .collection("claims")
            .insertOne(ClaimMock(personalitiesId, claimRevisionId));
    } finally {
        await client.close();
    }
};
