import { MongoClient } from "mongodb";
import { AdminUserMock } from "./AdminUserMock";

export const SeedTestUser = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        return await client
            .db("Aletheia")
            .collection("users")
            .insertOne(AdminUserMock);
    } finally {
        await client.close();
    }
};
