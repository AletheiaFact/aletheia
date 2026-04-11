import { MongoClient } from "mongodb";
import { SentenceMock } from "./SentenceMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestSentence = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db(getTestDbName(uri))
            .collection("sentences")
            .insertOne(SentenceMock);
    } finally {
        await client.close();
    }
};
