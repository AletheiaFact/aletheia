import { MongoClient } from "mongodb";
import { ParagraphMock } from "./ParagraphMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestParagraph = async (uri, sentenceId) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db(getTestDbName(uri))
            .collection("paragraphs")
            .insertOne(ParagraphMock(sentenceId));
    } finally {
        await client.close();
    }
};
