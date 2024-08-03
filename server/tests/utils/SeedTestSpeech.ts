import { MongoClient } from "mongodb";
import { SpeechMock } from "./SpeechMock";

export const SeedTestSpeech = async (uri, paragraphId) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("Aletheia")
            .collection("speeches")
            .insertOne(SpeechMock(paragraphId));
    } finally {
        await client.close();
    }
};
