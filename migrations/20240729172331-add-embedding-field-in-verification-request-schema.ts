import { Db } from "mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

export async function up(db: Db) {
    const embeddings = new OpenAIEmbeddings();
    const verificationRequestCursor = await db
        .collection("verificationrequests")
        .find();

    while (await verificationRequestCursor.hasNext()) {
        const verificationRequest = await verificationRequestCursor.next();

        const embedding = await embeddings.embedQuery(
            verificationRequest.content
        );

        await db
            .collection("verificationrequests")
            .updateOne(
                { _id: verificationRequest._id },
                { $set: { embedding } }
            );
    }
}

export async function down(db: Db) {
    await db
        .collection("verificationrequests")
        .updateMany({}, { $unset: { embedding: "" } });
}
