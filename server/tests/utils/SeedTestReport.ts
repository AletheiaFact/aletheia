import { MongoClient } from "mongodb";
import { ReportMock } from "./ReportMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestReport = async (uri, userId) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db(getTestDbName(uri))
            .collection("reports")
            .insertOne(ReportMock(userId));
    } finally {
        await client.close();
    }
};
