import { MongoClient } from "mongodb";
import { AdminUserMock } from "./AdminUserMock";

export const SeedTestUser = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        // Use updateOne with upsert to avoid duplicate key errors in parallel execution
        const result = await client
            .db("test")
            .collection("users")
            .updateOne(
                { _id: AdminUserMock._id },
                { $set: AdminUserMock },
                { upsert: true }
            );

        return {
            insertedId: AdminUserMock._id,
            acknowledged: result.acknowledged,
        };
    } finally {
        await client.close();
    }
};
