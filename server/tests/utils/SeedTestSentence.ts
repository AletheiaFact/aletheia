import { MongoClient } from "mongodb";
import { SentenceMock } from "./SentenceMock";

export const SeedTestSentence = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("Aletheia")
            .collection("sentences")
            .insertOne(SentenceMock);
    } finally {
        await client.close();
    }
};
