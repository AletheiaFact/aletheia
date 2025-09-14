import { MongoClient } from "mongodb";
import { ParagraphMock } from "./ParagraphMock";

export const SeedTestParagraph = async (uri, sentenceId) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("test")
            .collection("paragraphs")
            .insertOne(ParagraphMock(sentenceId));
    } finally {
        await client.close();
    }
};
